<template>
    <div>
      <div class="controls">
        <button @click="addObjects">Add Rectangle and Polygon</button>
        <button @click="deleteSelected" :disabled="!selectedObject">Delete Selected Object</button>
      </div>
      
      <div id="canvas-container">
        <canvas ref="canvasEl" width="800" height="600"></canvas>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import * as fabric from 'fabric';
  
  // Define custom class for a shape (e.g., CustomObject)
  class CustomObject extends fabric.Object {
    animDirection: 'up' | 'down' = 'up';
    w1: number = 30;
    w2: number = 30;
    h1: number = 30;
    h2: number = 100;
  
    constructor(options: fabric.ObjectOptions = {}) {
      super(options); // Calling the parent constructor
      this.transparentCorners = false;
      this.objectCaching = false; // This property exists on fabric.Object
    }
  
    // Custom animation method
    animateWidthHeight() {
      const interval = 2;
      if (this.h2 >= 30 && this.h2 <= 100) {
        const actualInterval = this.animDirection === 'up' ? interval : -interval;
        this.h2 += actualInterval;
        this.w1 += actualInterval;
      }
  
      if (this.h2 >= 100) {
        this.animDirection = 'down';
        this.h2 -= interval;
        this.w1 -= interval;
      }
      if (this.h2 <= 30) {
        this.animDirection = 'up';
        this.h2 += interval;
        this.w1 += interval;
      }
    }
  
    // Custom render function
    _render(ctx: CanvasRenderingContext2D) {
      ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1);
      ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2);
    }
  }
  
  export default defineComponent({
    name: 'CanvasComponent',
    setup() {
      const canvasEl = ref<HTMLCanvasElement | null>(null);
      const selectedObject = ref<fabric.Object | null>(null);
      let canvas: fabric.Canvas | null = null;
  
      onMounted(() => {
        if (canvasEl.value) {
          canvas = new fabric.Canvas(canvasEl.value);
          canvas.setWidth(800);
          canvas.setHeight(600);
  
          // Add Custom objects to the canvas
          canvas.add(
            new CustomObject({ top: 100, left: 100 }),
            new CustomObject({ top: 140, left: 230 }),
            new CustomObject({ top: 300, left: 210 }),
            new CustomObject({ top: 40, left: 400 }),
            new CustomObject({ top: 450, left: 400 })
          );
  
          // Start the animation
          animate();
        }
      });
  
      // Animation loop
      const animate = () => {
        if (canvas) {
          // Ensure that we are animating Custom objects only
          canvas.forEachObject((obj: fabric.Object) => {
            if (obj instanceof CustomObject) {
              obj.animateWidthHeight();
            }
          });
  
          canvas.requestRenderAll(); // Render the canvas
          requestAnimationFrame(animate); // Keep the animation going
        }
      };
  
      // Function to add rectangle and polygon to the canvas
      const addObjects = () => {
        if (canvas) {
          const rect = new fabric.Rect({
            left: 50,
            top: 50,
            width: 100,
            height: 100,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
            objectCaching: false,
          });
  
          const polygon = new fabric.Polygon(
            [
              { x: 200, y: 200 },
              { x: 300, y: 200 },
              { x: 300, y: 300 },
              { x: 200, y: 300 },
            ],
            {
              fill: 'blue',
              stroke: 'black',
              strokeWidth: 2,
              objectCaching: false,
            }
          );
  
          const customObject = new CustomObject({
            top: 100,
            left: 100,
          });
  
          canvas.add(rect, polygon, customObject);
  
          // Create active selection
          const activeSelection = new fabric.ActiveSelection([rect, polygon], {
            borderColor: 'blue',
            cornerColor: 'blue',
            cornerSize: 12,
            transparentCorners: false,
          });
  
          canvas.setActiveObject(activeSelection);
          canvas.renderAll();
        }
      };
  
      // Function to delete the selected object
      const deleteSelected = () => {
        // Check if selectedObject is valid and of type fabric.Object
        if (selectedObject.value && canvas) {
          // Only remove the object from the canvas if it is a valid fabric object
          canvas.remove(selectedObject.value);
          selectedObject.value = null; // Reset the selected object
          canvas.requestRenderAll(); // Request the canvas to render again
        }
      };
  
      return {
        canvasEl,
        addObjects,
        deleteSelected,
        selectedObject,
      };
    },
  });
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
  
  .controls {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  #canvas-container {
    margin-top: 20px;
    border: 1px solid #ddd;
    background-color: #fff;
    position: relative;
  }
  
  canvas {
    border: 1px solid #000;
    background-color: #eaeaea;
  }
  </style>
  