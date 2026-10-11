---
title: Two chips, one job
summary: Why wildlife and outdoor cameras fail when a media SoC stays awake for control traffic — and how to split the continuum early.
date: 2026-09-16
category: notes
tags:
  - architecture
  - devices
keywords:
  - low-power MCU and media SoC split
  - battery camera always-on control plane
  - wildlife camera power architecture
faqs:
  - question: Why split a low-power MCU from a media SoC on a battery camera?
    answer: A media SoC that stays awake for control traffic burns the battery on cheap work. Keep wake, credentials, and session control on an always-on MCU, and power the media SoC only when there is something worth recording.
  - question: What should the protocol boundary own?
    answer: Power and boot are part of the protocol, not leftover GPIO. The MCU hands a short-lived media plane a clean boundary, then services and agents receive media and telemetry without inheriting session state.
---

Battery products collapse when the expensive chip does cheap work all day.

The durable pattern is simple: a low-power MCU owns wake, credentials, and session control; a media SoC only runs when there is something worth recording — then ships media and telemetry over a clean protocol boundary.

## What this is not

This is not a call to buy more silicon. It is a call to price **power and boot as protocol**, not as afterthought GPIO.

## The continuum view

On EngContinuum we treat the path as one system:

1. Sense and decide on the always-on edge
2. Power a short-lived media plane
3. Hand work to services and agents without leaking session state

Future notes will dig into UART control frames, cold-boot realities, and how AI-assisted bring-up still needs acceptance gates.
