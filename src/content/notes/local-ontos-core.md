---
title: OntoOS locally — ontology, prefix KV, and a sandbox walk
summary: Palantir-shaped ontology, TPFRole bitmaps, and a causal sandbox — with RocksDB embedded in a local Docker Linux image when the Windows host has no cmake.
date: 2026-11-05
category: notes
tags:
  - architecture
  - ontology
  - graph
keywords:
  - Palantir ontology for agentic AI
  - enterprise ontology object graph
  - knowledge graph causal what-if sandbox
  - OntoOS AbutionGraph TPFRole semantic layer
  - Ontology TPFRole HOLAP Roaring bitmap filter
  - RocksDB Docker Compose prefix iterator
  - agentic workflow ontology decision loop
  - copy-on-write sandbox causal propagation agent
faqs:
  - question: How does this OntoOS PoC relate to a Palantir-style ontology?
    answer: Objects and links share one entity-id space. TPFRole collapses ERP rows, time buckets, and spatial cells onto that space. Filters are Roaring intersections; walks are prefix scans on out-edges — not Cypher text plans.
  - question: What is TPFRole in this stack?
    answer: Six facets — Type, Predicate, Function, Aggregation, Action, Role — that name how a heterogeneous feed becomes bitmap keys and agent context. The local role for the check was Supplier / status:active / time:today / ops.
  - question: How do you run RocksDB on a Windows host without cmake?
    answer: RocksDB is embedded in the backend, not a separate network service. docker compose builds a Linux image with --features rocksdb (cmake/clang inside the builder), mounts volume rocksdb-data at /data/rocksdb, and publishes 18080. The host cargo build keeps the BTree PrefixKv with the same key layout.
  - question: What did the sandbox shock walk and agent return?
    answer: Open walk 1001→2002→3003→4004 ended at 0.544. Isolating plant 2002 stopped the path at 0.850. With no ONTO_LLM_API_KEY, the agent emitted a local-policy re_route_supplier JSON for replay inside the overlay.
---

General graph databases pay for a text query language and a distributed transaction story. A local OntoOS / AbutionGraph core does not. It needs a Palantir-shaped **ontology** — objects and links with a shared id space — a way to fold ERP, time-series, and spatial feeds into that space (**TPFRole**), a CoW sandbox that forks in well under a millisecond, and a causal walk that an agent can read before anything is promoted.

This note is the second pass on that core. The first pass proved columns, bitmaps, and an in-memory overlay. This pass hardens the **key layout**, the **semantic layer**, the **HTTP + SvelteKit loop**, and the **agent hook**. The Windows host still cannot link `rocksdb-sys` without cmake; **Docker Desktop** builds the real RocksDB engine in Linux and mounts a durable volume.

---

## 1. Principle — replace the general graph runtime

Three costs dominate a Cypher / nGQL stack in a what-if loop:

1. **Parser and planner.** Every hypothetical is a string plan.
2. **Join across stores.** ERP ids, sensor series, and GIS cells live in different systems until an expensive ETL.
3. **Isolation for speculation.** Snapshotting a whole graph, or opening a heavyweight transaction, is the wrong unit for a one-millisecond fork.

The replacement is deliberate and narrow:

| General graph DB | OntoOS local core |
| --- | --- |
| Cypher / nGQL text | Rust calls on a KV + bitmap API |
| Logical planner / CBO | Fixed operators: intersect → prefix walk → property eval |
| Separate vector / GIS / TS stores | One entity id; predicates are bitmap keys |
| DB transaction for what-if | Memory `SandboxOverlay` delta over a read-only base |

**Prefix seeking instead of pointer romance.** Out-edges are encoded so a dictionary-ordered LSM (RocksDB in production) returns neighbors with a single seek:

```text
v:{id}                         → vertex JSON
e:out:{src}:{EdgeType}:{dst}   → edge JSON { "weight": 0.85 }
```

`prefix_iterator("e:out:1001:")` is the traversal primitive. On RocksDB that is an LSM dictionary-order seek. On this machine the same bytes live in a sorted `BTreeMap` flushed to `./data/ontopo_prefix_kv.bin`, because `rocksdb-sys` would not build without cmake/clang. The caller contract does not change.

**CoW instead of copy-the-world.** A session owns `delta_properties` and `deleted_nodes`. Reads hit the delta first, then the base KV. Fork cost on this pass was measured in tenths of a microsecond for an empty overlay — the production claim is “under 1 ms”; the empty fork is far below that.

**Ontology instead of schema sprawl.** Palantir’s product ontology is the commercial reference for “everything is an object or a link.” OntoOS names the local facets **TPFRole**:

```text
T Type        entity / relation kind
P Predicate   filter assertion (status:active, …)
F Function    attribute / computed mapping
Agg           time bucket / metric rollup
Action        event response the agent may emit
Role          ACL / ownership tag
```

Relational rows, time windows, and Geohash / H3 cells all emit **bitmap keys** under those facets. The only shared currency before the walk is the entity id.

```text
ERP row ──► type: / status: / role: ──┐
time bucket ──► time:… / metric:…:hot ─┼─► Roaring AND ─► id set ─► prefix walk
geohash/H3 ──► geohash:… / spatial:… ─┘
```

**Agent loop.** Shocked nodes (impact ≥ 0.05) become a compressed ontology slice. The agent returns a tool call. The call is meant to replay inside the overlay before promote. Live LLM is optional (`ONTO_LLM_API_KEY`); without it a deterministic local policy still closes the loop.

---

## 2. Architecture — monorepo shape

```text
ontopo-poc/
├── docker-compose.yml       # RocksDB-backed backend + volume
├── backend/
│   ├── Dockerfile           # Linux build --features rocksdb
│   ├── Cargo.toml           # optional dep rocksdb
│   └── src/storage.rs       # BTree host | RocksDB in Docker
└── frontend/                # SvelteKit sandbox console
```

Resolved crates on rustc 1.99.1 (Windows):

| Crate | Version | Role |
| --- | --- | --- |
| roaring | 0.11.5 | `RoaringTreemap` for u64 ids |
| rayon | 1.10 | parallel frontier expansion |
| axum | 0.8.9 | HTTP API |
| tower-http | 0.6 | CORS for the console |
| reqwest | 0.12 | optional LLM |
| bincode | 1.3 | PrefixKv snapshot |

`roaring` still has **no** `Roaring64Bitmap` root export — the u64 type is `RoaringTreemap`. Blueprint snippets that name `Roaring64Bitmap` need that rename on 0.11.

Storage is feature-gated: host `cargo build` → BTree `PrefixKv`; Docker `--features rocksdb` → embedded RocksDB with the same `e:out:…` keys and `prefix_iterator` neighbor fan-out. RocksDB is **not** a sidecar TCP service — it lives in-process inside the backend container.

---

## 3. Practice — what ran on this machine

### 3.1 Fixture

Supply chain spine in the prefix KV:

```text
1001 Factory A  --SUPPLIES/0.85--> 2002 Plant B
2002            --FEEDS/0.8------> 3003 DC C
3003            --SERVES/0.8-----> 4004 Cust D
```

HOLAP volume: ids `1..=10000` tagged so `status:active ∩ time:today ∩ geohash:wx4g` is every `id % 8 == 0`, plus the four spine ids that the TPFRole ingest also stamps → **1254** hits.

### 3.2 Self-check (`cargo run --release -- --check`)

```text
kv_entries 7
tpfrole_keys type:Supplier,status:active,time:today,role:ops,fn:name
holap status∩time∩geohash = 1254
bitmap mean 5.20 µs over 1000 intersections
prefix e:out:1001: mean 0.24 µs over 1000 scans (1 edge)
sandbox fork 0.300 µs
sandbox base status[2002]=active overlay=isolated
propagate open 1001:1.000 2002:0.850 3003:0.680 4004:0.544
propagate isolated-2002 1001:1.000 2002:0.850
```

Open path: `1 × 0.85 × 0.8 × 0.8 = 0.544` at customer 4004. With plant 2002 isolated in the overlay, the walk records 0.850 on 2002 and does not reach 3003 / 4004. The base vertex JSON for 2002 stays `active`.

### 3.3 Index and overlay (abridged)

```rust
pub fn intersect_query(&self, keys: &[&str]) -> RoaringTreemap {
    // empty list → empty; missing key → empty; else successive &=
}
```

```rust
pub fn get_property(&self, storage: &PrefixKv, node_id: u64, key: &str) -> Option<String> {
    if self.deleted_nodes.contains(&node_id) { return None; }
    if let Some(val) = self.delta_properties.get(&node_id).and_then(|p| p.get(key)) {
        return Some(val.clone());
    }
    // else parse v:{id} JSON from PrefixKv
}
```

```rust
// causal frontier — Rayon over current impacts; edges via scan_by_prefix
let prefix = format!("e:out:{node_id}:");
let edges = storage.scan_by_prefix(&prefix);
```

### 3.4 HTTP surface

`cargo run --release` binds `http://127.0.0.1:18080` after the check (8080 was already taken on this host by another process).

| Route | Purpose |
| --- | --- |
| `GET /health` | liveness |
| `POST /api/query` | HOLAP intersect |
| `POST /api/sandbox/fork` | empty CoW session |
| `POST /api/sandbox/{session}/property` | overlay write + base readback |
| `POST /api/sandbox/simulate` | walk ± agent |

Simulate body:

```json
{
  "start_node_id": 1001,
  "shock_value": 1.0,
  "enable_agent": true,
  "session": 1
}
```

Without `ONTO_LLM_API_KEY`, `agent_recommendation.source` is `local-policy` and `content` is a JSON tool call (`re_route_supplier`, target = top shocked id). With the key set, `agent.rs` posts to an OpenAI-compatible `/chat/completions` and returns the model text. Either path is meant to be **replayed in the overlay** before promote — the PoC stops at emitting the recommendation.

HTTP from this run (session 1 isolates plant 2002, then a second call walks the open base):

```json
{"count":1254,"ids":[8,16,24,32,40,48,56,64,72,80,88,96]}
{"session":1,"fork_us":0.2}
{"overlay":"isolated","base":"active"}
{"impacts":[{"id":1001,"impact":1.0},{"id":2002,"impact":0.85}],"agent_recommendation":{"source":"local-policy","content":"{\"action\":\"re_route_supplier\",\"target\":1001,\"qty\":500, ...}"}}
{"impacts":[{"id":1001,"impact":1.0},{"id":2002,"impact":0.85},{"id":3003,"impact":0.68},{"id":4004,"impact":0.544}], ...}
```

### 3.5 SvelteKit console

```bash
cd frontend && npm install && npm run dev
```

The page posts to the four routes: HOLAP sample, optional isolate of plant 2002, shock walk, agent panel. It is a thin client over the Rust process — the ontology and the walk stay in-process.

### 3.6 RocksDB on Docker Desktop

RocksDB needs cmake + a C++ toolchain. Those are missing on the Windows PATH; they are present in the Linux builder image. From the monorepo root:

```bash
docker compose up --build -d
```

That builds `ontopo-backend:rocksdb` with `--features rocksdb`, mounts named volume `rocksdb-data` at `/data`, sets `ONTO_DATA_DIR=/data/rocksdb`, binds `0.0.0.0:18080`, and health-checks `GET /health`.

Container self-check from this run:

```text
store rocksdb kv_entries 7
tpfrole_keys type:Supplier,status:active,time:today,role:ops,fn:name
holap status∩time∩geohash = 1254
bitmap mean 5.05 µs over 1000 intersections
prefix e:out:1001: mean 0.53 µs over 1000 scans (1 edge)
sandbox fork 0.028 µs
sandbox base status[2002]=active overlay=isolated
propagate open 1001:1.000 2002:0.850 3003:0.680 4004:0.544
propagate isolated-2002 1001:1.000 2002:0.850
Rust backend listening on http://0.0.0.0:18080
```

Host curl against the published port returned the same HOLAP count and open-path impacts as the BTree build. Prefix scan mean moved from **0.24 µs** (in-process BTree) to **0.53 µs** (RocksDB `prefix_iterator` in the container) on this fixture — still sub-microsecond for a single out-edge. The volume keeps the LSM files across `compose down` / `up`.

```bash
docker compose run --rm backend ontopo-backend --check
curl http://127.0.0.1:18080/health
```

---

## 4. What this pass is not

- Not a Cypher engine and not a multi-region ACID graph.
- Not a standalone RocksDB server image — the engine is embedded in the backend process; Docker only supplies the Linux build and the data volume.
- Not a full Palantir Foundry substitute. The word **ontology** here means the object/link id space and TPFRole facets, not a commercial platform claim.
- Not automatic promote-to-production. The agent suggestion is advice inside the sandbox.

Next: richer Action replay (apply tool call → second walk → diff) on the same RocksDB volume. The Docker numbers above are the acceptance gate for the durable store.
