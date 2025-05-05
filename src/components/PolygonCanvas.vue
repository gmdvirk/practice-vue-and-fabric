<!-- src/components/PolygonCanvas.vue -->
<template>
    <section class="h-full w-full flex flex-col gap-3">
      <nav class="flex gap-2">
        <button @click="addPolygon">Add Polygon</button>
        <button @click="deleteSelected" :disabled="!hasSelection">Delete Selected</button>
      </nav>
  
      <canvas ref="canvasEl" class="border grow" />
    </section>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import * as fabric from 'fabric'            // tsconfig: "esModuleInterop": true
  
  /* -------------- refs / state -------------- */
  const canvasEl = ref<HTMLCanvasElement | null>(null)
  let canvas!: fabric.Canvas
  
  const hasSelection = computed(() => Boolean(canvas?.getActiveObject()))
  
  /* -------------- life‑cycle -------------- */
  onMounted((): void => {
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
  
  /* -------------- actions -------------- */
  function addPolygon (): void {
    const sides = 6                      // hexagon; change if you like
    const radius = 60
    const points: fabric.Point[] = Array.from({ length: sides }, (_v, i) => {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2 // start at top
      return new fabric.Point(
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      )
    })
  
    const poly = new fabric.Polygon(points, {
      left: rand(100, 500),
      top: rand(100, 400),
      fill: randomColor(),
      stroke: '#000',
      strokeWidth: 1
    })
  
    canvas.add(poly)
    canvas.setActiveObject(poly)         // << fixed: call on canvas
    canvas.requestRenderAll()
  }
  
  function deleteSelected (): void {
    const obj = canvas.getActiveObject()
    if (!obj) return
    canvas.remove(obj)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }
  
  /* -------------- helpers -------------- */
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
  