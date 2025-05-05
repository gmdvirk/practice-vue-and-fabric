<!-- src/components/FabricPlayground.vue -->
<template>
    <section class="h-full w-full flex flex-col gap-3">
      <nav class="flex gap-2">
        <button @click="addRect">Add Rect</button>
        <button @click="addPolygon">Add Polygon</button>
        <button @click="deleteSelection" :disabled="!hasSelection()">Delete Selection</button>
      </nav>
  
      <!-- Fabric hooks straight into this canvas -->
      <canvas ref="canvasEl" class="border grow" />
    </section>
  </template>
  
  <script lang="ts" setup>
  import { useFabricCanvas } from '@/composables/useFabricCanvas'
  
  const {
    canvasEl,
    addRect,
    addPolygon,
    deleteSelection,
    hasSelection
  } = useFabricCanvas()
  </script>
  
  <style scoped>
  button {
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    background: #ececec;
  }
  button:disabled { opacity: .5; }
  canvas { width: 100%; height: 100%; }
  </style>
  