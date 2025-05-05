<!-- src/components/RectCanvas.vue -->
<template>
    <section class="h-full w-full flex flex-col gap-3">
      <nav class="flex gap-2">
        <button @click="addRect">Add Rect</button>
        <button @click="deleteSelected" :disabled="!hasSelection">Delete Selected</button>
      </nav>
  
      <canvas ref="canvasEl" class="border grow" />
    </section>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import * as fabric from 'fabric'    // needs "esModuleInterop": true in tsconfig
  
  /* ---------- refs ---------- */
  const canvasEl = ref<HTMLCanvasElement | null>(null)
  let canvas!: fabric.Canvas
  
  /* ---------- reactive flag ---------- */
  const hasSelection = computed(() => Boolean(canvas?.getActiveObject()))
  
  /* ---------- lifecycle ---------- */
  onMounted(() => {
    canvas = new fabric.Canvas(canvasEl.value as HTMLCanvasElement, {
      selection: true,
      preserveObjectStacking: true
    })
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', handleKey)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    window.removeEventListener('keydown', handleKey)
  })
  
  /* ---------- actions ---------- */
  function addRect (): void {
    const rect = new fabric.Rect({
      left: rand(50, 400),
      top:  rand(50, 250),
      width: 120,
      height: 80,
      rx: 6, ry: 6,
      fill: randomColor()
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)   // ← call on the canvas, not the rect
    canvas.requestRenderAll()
  }
  
  function deleteSelected (): void {
    const obj = canvas.getActiveObject()
    if (!obj) return
    canvas.remove(obj)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }
  
  /* ---------- helpers ---------- */
  function handleKey (e: KeyboardEvent): void {
    if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected()
  }
  
  function resize (): void {
    const parent = canvasEl.value!.parentElement as HTMLElement
    canvas.setWidth(parent.clientWidth)
    canvas.setHeight(parent.clientHeight)
    canvas.requestRenderAll()
  }
  
  const rand = (min: number, max: number) => Math.random() * (max - min) + min
  const randomColor = () => `hsl(${Math.random() * 360},65%,70%)`
  </script>
  
  <style scoped>
  button {
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    background: #ececec;
    transition: background 0.15s;
  }
  button:hover:enabled { background: #e0e0e0; }
  button:disabled { opacity: 0.5; cursor: default; }
  canvas { width: 100%; height: 100%; }
  </style>
  