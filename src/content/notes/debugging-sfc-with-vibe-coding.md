---
title: Debugging an SFC failure with Vibe Coding
summary: How a contract-first agent loop turned a T23 flash-program failure into a hardware conclusion — and which lookalike bugs had to be ruled out first.
date: 2026-10-11
category: practice
tags:
  - vibe-coding
  - devices
  - bring-up
keywords:
  - Ingenic T23 SFC flash program failure
  - USB cloner PERM ERR stage2_write
  - jz_sfc status register ioctl
  - CH341A SOP-8 NOR rescue
  - MCU rail drop during flash write
faqs:
  - question: What did the SFC failure actually look like?
    answer: The USB cloner reported a one-second erase, then stage2_write error(-1) four times, then PERM ERR, a few percent into the write. The same image had programmed successfully earlier the same night.
  - question: How did readback show the fault was on the board SFC path?
    answer: Two cloner readbacks matched each other byte for byte, so the read path was deterministic. The image matched only through 0x99F. From 0x9A0 the contents were a different xboot build, and from 0xC000 the flash was erased (0xFF). The cloner could no longer repair that through the SoC.
  - question: Why did an earlier cloner failure look the same and was not this bug?
    answer: If the MCU drops the SoC power rail mid-write, the cloner dies with stage2_write -138 and a USB disconnect. That one is fixed by holding the enable pin on for the whole program, and by using an explicit off-then-on only when the bootrom must resample the boot strap.
---

A flash programmer that dies at a few percent is a bad prompt for an agent. The log says `PERM ERR`. The part that is actually broken might be the image, the cable, the power rail, the boot strap, or the SPI flash controller on the SoC. Vibe Coding only helps if each pass is one hypothesis and one measurement.

This is that pass, on a board where a small MCU owns the power rail of an Ingenic T23, and the T23 boots from a 16 MB NOR through its SFC (SPI flash controller).

---

## 1. The symptom, stated so an agent cannot wander

USB cloner behavior after a run of successful programs:

- Erase finished in about a second. A real chip erase of this NOR does not.
- Write failed around 1–5% with `stage2_write error(-1)`, four times, then `PERM ERR`.
- The same night had eight good programs. One later image ran for about ten minutes. After that, every program failed.

The agent was not allowed to “try another image” as the first move. The image was already a controlled variable.

## 2. The loop

Same shape as the rest of this practice. The agent proposes the next disproof. I run it on the bench. The result goes back as evidence, not as a vibe.

| Step | Hypothesis | What would falsify it |
| --- | --- | --- |
| 1 | The image is bad | A previously good image fails the same way |
| 2 | The MCU firmware that sequences power is bad | Rolling back to the last known-good MCU build still fails |
| 3 | The radio is coupling into the flash bus | Failure continues with the radio quiet |
| 4 | The pack is sagging | Failure continues on a full battery |
| 5 | The flash contents are simply stale | A readback matches the image, or two readbacks disagree |
| 6 | The on-board SFC write path is no longer trustworthy | Readback is deterministic and does not match the image past a clean prefix |

Steps 1–4 all failed to clear the error. Step 5 is the one that closed it.

## 3. What the readback actually said

Cloner readback (a read strategy, not another write) was taken twice.

| Region | Contents |
| --- | --- |
| `0x000`–`0x99F` | Matches the image that was supposed to be there |
| `0x9A0` onward | A different xboot build: instruction-level diffs and a growing offset, not random bit rot |
| `0xC000` onward | Erased, `0xFF` |
| Second read vs first | Byte-identical |

A deterministic read with a foreign bootloader spliced in, then a hole of `0xFF`, is not a flaky USB cable. The programmer can still read. It cannot finish a write through the SoC’s SFC. At that point more cloner retries only exercise a path that has already lost the part.

## 4. The lookalike that is software

An earlier failure used almost the same words in the log and was a different bug.

The MCU drives the T23 rail through an enable pin (active-high). If that pin drops while the cloner is in `stage2_write`, the SoC disappears from USB: `stage2_write -138` and `DISCONNECT`. The agent’s first useful patch was not in the flash driver. It was a power-policy comment turned into a build rule:

- Bring-up builds hold the rail on. A casual “reboot” often leaves the rail up, so the bootrom never resamples the boot strap and the USB cloner never enumerates. Cable, card, and driver can all be fine.
- Entering cloner mode is an explicit sequence: hold the boot strap, rail off for a few seconds, rail on, keep the strap held. That is a real power-on reset.
- Do not ship the product power-cycle policy into a flashing session. The product wants the SoC off between recordings. The programmer wants the rail nailed on until verify passes.

That bug is closed in firmware. The October failure survived it, which is why the table above starts by re-checking the rail and the firmware before blaming silicon.

## 5. A small tool, and why it was not written in Zig

Once the SoC is actually up, status registers on `/dev/jz_sfc` are the cheap probe. The vendor ioctl is a single-byte command with magic `'S'`:

| Request | Meaning |
| --- | --- |
| `_IO('S', 0)` | Read SR, SR1, SR2 |
| `_IO('S', 3/4/5)` | Write SR, SR1, SR2 |

The typed wrapper lives in Zig so host tests can parse `0x7c` and register indexes without a board. The binary that runs on the camera does not. A Zig cross-build of the same tool came out large and dynamically linked. The rootfs is not the glibc loader that binary expected (`not found` with the file sitting in `/tmp`). The on-device `sfc-tool` is the C ioctl, built with the mips-gcc toolchain and linked static, a few kilobytes, same requests.

That split is the vibe-coding rule for this tree: the agent may invent the wrapper and the tests in whatever language is readable. The artifact that touches the board must match the loader that is actually there. Do not “fix” a missing `ld.so` by rewriting the flash driver.

`sfc-tool` answers “can this running kernel talk to the controller?” It does not answer “can the bootrom still program the chip?” Those are different masters on the same pins. The cloner failure was the second question.

## 6. Recovery when the SoC is the broken master

If the SFC write path is the fault, another program through that path will not heal the NOR. The recovery is an external programmer on the chip itself, with the board unpowered so the T23 is not a second master on CS, CLK, and the data lines.

Practical shape, not a shopping list:

- SOP-8 clip on the NOR (this board: a 25Q128-class 16 MB part), notch and pin 1 aligned, clip on the SPI header of the programmer rather than the I2C header.
- Board fully off before the clip is attached. Read first and keep the dump. Erase, program, verify. Verify has to pass.
- Acceptance after the clip comes off and the board boots again: the serial banner from the application, the kernel command line you meant to flash, and a recording that actually lands. A green bar in the programmer GUI is not acceptance.

Two outcomes remain, and the agent should say which one the evidence supports:

- External verify passes and the board boots. The NOR was the patient. The on-board path can be retested with a short program, not assumed healthy.
- External verify passes and the board still has no banner. The image is on the chip. The remaining fault is the SoC SFC pin or the address path. That is rework or another board, not another cloner profile.

## 7. What I keep from the session

1. **Name the log line and the region.** `PERM ERR` is not a root cause. `0x9A0` and `0xC000` are.
2. **One hypothesis per pass.** Image, firmware, radio, pack, then readback. An agent that “fixes” three of these in one edit has not learned anything.
3. **Identical readbacks are evidence.** Two copies that match mean the read path is stable. The mismatch against the image is then real.
4. **Power-policy bugs wear the same symptom.** Hold the rail, or you will diagnose silicon for a GPIO.
5. **The binary on the device uses the device’s libc.** Generate the typed helper anywhere. Link the probe the way the rootfs can load it.
6. **Stop programming through a master you have already shown cannot write.** Clip the chip, or send the board to rework. A seventh cloner retry is not a method.

The model was useful where the search space was source, ioctl numbers, and the order of experiments. It was not useful as a guess about the solder joints. The readback did that job.
