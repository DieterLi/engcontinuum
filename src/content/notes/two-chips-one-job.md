---
title: Two chips, one job
summary: Why wildlife and outdoor cameras fail when a media SoC stays awake for control traffic — and how to split the continuum early.
date: 2026-09-16
tags:
  - architecture
  - devices
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
