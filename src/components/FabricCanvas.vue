<template>
    <div>
      <h1>Fabric.js with Vue 3 and TypeScript</h1>
      <canvas ref="canvas" width="800" height="600"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import * as fabric from 'fabric'; // Import fabric.js
  import { ref, onMounted } from 'vue'; // Import ref and onMounted
  
  // Define Cross class which extends fabric.Object
  class Cross extends fabric.Object {
    animDirection: 'up' | 'down' = 'up';
    w1: number = 30;
    w2: number = 30;
    h1: number = 30;
    h2: number = 100;
  
    constructor(options: any = {}) {
      super(options); // Calling the parent constructor
  
      this.transparentCorners = false;
      this.objectCaching = false; // This property exists on fabric.Object
    }
  
    // Add animateWidthHeight method
    animateWidthHeight() {
      const interval = 2;
  
      if (this.h2 >= 30 && this.h2 <= 100) {
        const actualInterval =
          this.animDirection === 'up' ? interval : -interval;
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
  
  export default {
    name: 'FabricCanvas',
    setup() {
      // Define the canvas reference with proper type
      const canvasRef = ref<HTMLCanvasElement | null>(null); // Reference for the canvas
      let canvas: fabric.Canvas | null = null;
  
      // On component mount
      onMounted(() => {
        // Check if the canvas is correctly mounted
        console.log('Canvas mounted:', canvasRef.value);
  
        if (canvasRef.value) {
          // Initialize Fabric.js canvas
          canvas = new fabric.Canvas(canvasRef.value);
          canvas.setWidth(800);
          canvas.setHeight(600);
  
          console.log('Fabric.js canvas initialized:', canvas);
  
          // Add Cross objects to the canvas
          canvas.add(
            new Cross({
              top: 100,
              left: 100,
            }),
            new Cross({
              top: 140,
              left: 230,
            }),
            new Cross({
              top: 300,
              left: 210,
            }),
            new Cross({
              top: 40,
              left: 400,
            }),
            new Cross({
              top: 450,
              left: 400,
            })
          );
  
          console.log('Cross objects added to the canvas.');
  
          // Start the animation
          animate();
        }
      });
  
      // Animation loop
      const animate = () => {
        if (canvas) {
          // Ensure that we are animating Cross objects only
          canvas.forEachObject((obj: fabric.Object) => {
            if (obj instanceof Cross) {
              obj.animateWidthHeight();
            }
          });
  
          // Debug log to see if animation loop is running
          console.log('Rendering frame...');
  
          canvas.requestRenderAll(); // Render the canvas
          requestAnimationFrame(animate); // Keep the animation going
        }
      };
  
      return {
        canvasRef,
      };
    },
  };
  </script>
  
  <style scoped>
  canvas {
    border: 1px solid #000;
  }
  </style>
  