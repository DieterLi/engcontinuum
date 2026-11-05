---
title: A local OntoOS core, four kernels
summary: One Rust process holds aligned columns, a Roaring intersection, an HNSW index keyed by entity id, and a sandbox delta. The check below is 100,000 rows on this machine.
date: 2026-11-05
category: notes
tags:
  - architecture
  - graph
  - storage
keywords:
  - OntoOS AbutionGraph local Rust core
  - RoaringTreemap multi-predicate intersection
  - usearch 2.21 HNSW entity id key
  - copy-on-write sandbox property delta
  - graph shock propagation with a decay
faqs:
  - question: What does the local OntoOS core keep in one process?
    answer: Aligned attribute columns, one Roaring bitmap per predicate, an HNSW index whose key is the entity id, the adjacency list, and a per-session property delta. Axum serves that state on localhost.
  - question: Which 64-bit bitmap type did the roaring crate export?
    answer: roaring 0.11.5 exports RoaringTreemap for u64 ids. The filter inserts entity ids and intersects with bitwise AND. An empty predicate list, or a key that was never indexed, returns an empty bitmap.
  - question: Which usearch version linked on this machine?
    answer: usearch 2.21.4. Version 2.26.6 pulls numkong, and this MSVC compiler rejected that build — cl.exe ignored -std:c99, then serial.h failed with C2059. 2.21.4 links through cxx.
  - question: What did the sandbox change, and what did the shock walk return?
    answer: Setting status to isolated on node 12 made the session read isolated and left the base column active. The open walk reached node 13 at 0.512. With node 12 isolated, the walk recorded 0.64 on node 12 and stopped.
---

This pass stands up the local OntoOS / AbutionGraph core in one Rust process. Columns, predicate bitmaps, the HNSW index, and the graph share entity ids. A sandbox session stores only the rows it changes. The SvelteKit console, when you add it, posts to this process and draws the JSON.

The measured tree is `ontopo-poc/core-engine`. `cargo run --release` loads the fixture, runs the check, and exits. `--serve` keeps the same state on `127.0.0.1:3001`.

```text
ontopo-poc/core-engine/
├── Cargo.toml
└── src/
    ├── lib.rs        # fixture + run_check
    ├── main.rs       # Axum routes
    ├── storage.rs    # aligned columns, mmap of the id column
    ├── bitmap.rs     # RoaringTreemap per predicate
    ├── vector.rs     # graph node + usearch key
    ├── sandbox.rs    # owned property delta
    └── causal.rs     # shock walk
```

Toolchain on this Windows machine: rustc 1.99.1. The release build that printed the numbers below resolved these crates:

| Crate | Version | Role in this pass |
| --- | --- | --- |
| roaring | 0.11.5 | `RoaringTreemap`, u64 entity ids |
| usearch | 2.21.4 | HNSW, cosine, f32, key = entity id |
| memmap2 | 0.9.12 | map the packed id column |
| axum | 0.8.9 | the four local routes |
| tokio | 1.54.1 | runtime |

`usearch` 2.26.6 is the current crates.io release and it did not link here. Its build compiles `numkong`. `cl.exe` ignored `-std:c99`, then `include/numkong/cast/serial.h` failed with C2059. Pinning `usearch = "=2.21.4"` dropped `numkong` and compiled through `cxx`. The Rust calls below are that version: `Index::new`, `reserve`, `add(key, vector)`, `search`.

Attribute columns in this pass are aligned `Vec<String>`. The id column is the file that gets mapped. A Parquet writer can sit on the same row alignment once the columns stop moving. Arrow is not a dependency of this binary.

---

## 1. Columns, then the intersection

The fixture is deterministic. Entity ids run from 1 through 100,000. Two columns, written at insert, and two bitmaps keyed `column:value`:

| Column | Rule | Bitmap | Ids |
| --- | --- | --- | --- |
| status | even id → `active`, else `inactive` | `status:active` | 50,000 |
| day | id divisible by 4 → `today`, else `yesterday` | `day:today` | 25,000 |
| both | bitwise AND of those two keys | intersection | 25,000 |

Every `today` id is even, so the intersection is exactly the multiples of 4. The check requires the bitmap length and a full column scan to both equal 25,000.

```rust
use roaring::RoaringTreemap;
use std::collections::HashMap;

pub struct IndexManager {
    bitmaps: HashMap<String, RoaringTreemap>,
}

impl IndexManager {
    pub fn add_index(&mut self, key: &str, id: u64) {
        self.bitmaps.entry(key.to_string()).or_default().insert(id);
    }

    pub fn intersect_query(&self, keys: &[&str]) -> RoaringTreemap {
        let mut keys = keys.iter();
        let Some(first_key) = keys.next() else {
            return RoaringTreemap::new();
        };
        let Some(first) = self.bitmaps.get(*first_key) else {
            return RoaringTreemap::new();
        };
        let mut result = first.clone();
        for key in keys {
            match self.bitmaps.get(*key) {
                Some(bitmap) => result &= bitmap,
                None => return RoaringTreemap::new(),
            }
        }
        result
    }
}
```

An empty key list returns an empty bitmap. A key that was never inserted returns an empty bitmap. The AND only runs across keys that exist.

The id column is then written as a packed native-endian `[u64]` and mapped back with `memmap2`. The check compares the mapped slice to the in-memory ids: 800,000 bytes, 100,000 ids, equal.

Timing is a batch mean in the release binary, with `std::hint::black_box` on the returned count. One thousand intersections took 1.06 µs each. Fifty full scans of the two string columns took 142.91 µs each. Same machine, same 25,000 hits. The single HTTP call later in this note is a different measurement.

---

## 2. The HNSW key is the entity id

`GraphNode` holds identity, a type, and outgoing edges. The vector lives in the HNSW index under that same id. A search result is already an entity id, so the column store can resolve it with the row map it already has.

```rust
pub struct GraphNode {
    pub id: u64,
    pub type_id: u32,
    pub outgoing: Vec<u64>,
}
```

```rust
let mut options = IndexOptions::default();
options.dimensions = dimensions;
options.metric = MetricKind::Cos;
options.quantization = ScalarKind::F32;
let index = Index::new(&options)?;
index.reserve(capacity)?;
index.add(entity_id, vector)?;
let matches = index.search(vector, k)?;
// matches.keys are entity ids
```

The local index is 16 dimensions and the first 1,000 entity ids. `reserve` is called with that capacity. A 768-d index is the same `add(entity_id, vector)` call with a longer slice. This pass did not allocate 100,000 vectors of 768 floats.

Searching the vector stored for id 42 returned keys `[42, 781, 412]`. The first key is the node. Graph node 10 is type 1 with outgoing `[11]`. The chain used by the walk is `10 → 11 → 12 → 13`. The other rows are column entities with no adjacency record.

---

## 3. The session owns the delta

A borrowed overlay is enough for one function call. A fork has to outlive the request that created it, so the session owns the delta and borrows the base columns only while answering a read.

```rust
pub struct SandboxDelta {
    delta_properties: HashMap<u64, HashMap<String, String>>,
    deleted_nodes: HashSet<u64>,
}

impl SandboxDelta {
    pub fn set_property(&mut self, id: u64, key: &str, value: &str) {
        self.delta_properties
            .entry(id)
            .or_default()
            .insert(key.to_string(), value.to_string());
    }

    pub fn get_property(&self, columns: &ColumnStore, id: u64, key: &str) -> Option<String> {
        if self.deleted_nodes.contains(&id) {
            return None;
        }
        if let Some(props) = self.delta_properties.get(&id) {
            if let Some(value) = props.get(key) {
                return Some(value.clone());
            }
        }
        columns.get(id, key).map(str::to_string)
    }
}
```

On this fixture, entity 12 is `active` in the base column (12 is even). The session sets `status` to `isolated`. The overlay read returns `isolated`. The base read after that write is still `active`. Deleting entity 99 hides it from the session; `columns.get(99, "status")` still returns the base value.

Edge lists stay on the base graph. This delta covers property writes and tombstones.

---

## 4. The shock walk

`simulate_propagation` records the shock on the start node, then replaces the frontier each round. Decay is `0.8`. A propagated value under `0.01` is dropped. Impacts accumulate on every node that received a shock, so the map is the path, and the start node keeps the unscaled initial shock.

A node whose sandbox `status` is `isolated` keeps the impact that already arrived and forwards nothing. Deleted nodes are skipped. Outgoing edges are read from the base graph.

```rust
const DECAY: f64 = 0.8;
const THRESHOLD: f64 = 0.01;

for _round in 0..max_rounds {
    let mut next = HashMap::new();
    for (&node_id, &impact) in &frontier {
        if impact < THRESHOLD {
            continue;
        }
        if sandbox.get_property(columns, node_id, "status").as_deref() == Some("isolated") {
            continue;
        }
        for &neighbor in graph.outgoing(node_id) {
            if sandbox.is_deleted(neighbor) {
                continue;
            }
            let propagated = impact * DECAY;
            if propagated < THRESHOLD {
                continue;
            }
            *next.entry(neighbor).or_insert(0.0) += propagated;
        }
    }
    if next.is_empty() {
        break;
    }
    for (&node_id, &shock) in &next {
        *impacts.entry(node_id).or_insert(0.0) += shock;
    }
    frontier = next;
}
```

From node 10 with shock `1.0` and 8 rounds, the open session printed:

```text
10:1.000 11:0.800 12:0.640 13:0.512
```

That is `1`, then `0.8`, `0.8²`, `0.8³` along `10 → 11 → 12 → 13`. With node 12 isolated inside the session, the same call printed:

```text
10:1.000 11:0.800 12:0.640
```

Node 12 is in the map. Node 13 is absent. The base status of 12 is still `active`.

---

## 5. The check, then the same facts over HTTP

```bash
cargo run --release
```

```text
entities 100000
bitmap status:active ∩ day:today = 25000
bitmap mean 1.06 µs over 1000 intersections
scan mean 142.91 µs over 50 full passes
mmap id column 800000 bytes, 100000 ids match
hnsw dim 16, indexed 1000, nearest [42, 781, 412]
graph node 10 type 1 outgoing [11]
sandbox base status[12]=active overlay status[12]=isolated
propagate open 10:1.000 11:0.800 12:0.640 13:0.512
propagate isolated-12 10:1.000 11:0.800 12:0.640
```

The process exits after that print. The server is the same binary:

```bash
cargo run --release -- --serve
```

It binds `127.0.0.1:3001` after the check passes. Four routes, all `POST`:

| Route | Body | What it returns |
| --- | --- | --- |
| `/query` | `{"keys":["status:active","day:today"]}` | hit count, one-call microseconds, first ids |
| `/sandbox/fork` | `{}` | `{session}` |
| `/sandbox/{session}/property` | `{"id":12,"key":"status","value":"isolated"}` | overlay value and base value |
| `/sandbox/{session}/propagate` | `{"start":10,"shock":1.0,"rounds":8}` | impact list for that session |

```bash
curl -s -X POST http://127.0.0.1:3001/query \
  -H 'content-type: application/json' \
  -d '{"keys":["status:active","day:today"]}'

curl -s -X POST http://127.0.0.1:3001/sandbox/fork \
  -H 'content-type: application/json' -d '{}'

curl -s -X POST http://127.0.0.1:3001/sandbox/1/property \
  -H 'content-type: application/json' \
  -d '{"id":12,"key":"status","value":"isolated"}'

curl -s -X POST http://127.0.0.1:3001/sandbox/1/propagate \
  -H 'content-type: application/json' \
  -d '{"start":10,"shock":1.0,"rounds":8}'
```

Responses from this run:

```json
{"count":25000,"micros":9.3,"ids":[4,8,12,16,20,24,28,32]}
{"session":1}
{"overlay":"isolated","base":"active"}
{"impacts":[{"id":10,"impact":1.0},{"id":11,"impact":0.8},{"id":12,"impact":0.6400000000000001}]}
```

The handler's `9.3` µs is one intersection inside that request. The `1.06` µs figure is the mean of a thousand calls in-process. Both counts are 25,000. The sample ids start at 4 because ids start at 1 and the hit set is multiples of 4. `0.6400000000000001` is `0.8 × 0.8` in `f64`; the in-process printer rounds it to `0.640`.

A SvelteKit console for this core is a client of those four calls. It draws the count, the sample ids, the overlay beside the base value, and the impact list. The entity table stays in the Rust process. This pass stops at the curl output above.
