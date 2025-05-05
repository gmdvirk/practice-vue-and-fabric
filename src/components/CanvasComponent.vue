<template>
    <div>
      <canvas ref="canvasEl" width="800" height="600" style="border: 1px solid #000"></canvas>
      <button id="add">Add Rectangle</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import * as fabric from 'fabric';
  
  // Custom logic for the Canvas
  export default defineComponent({
    name: 'CanvasComponent',
    setup() {
      const canvasEl = ref<HTMLCanvasElement | null>(null);
      const canvas = ref<fabric.Canvas | null>(null);
  
      onMounted(() => {
        // Create Fabric Canvas
        if (canvasEl.value) {
          canvas.value = new fabric.Canvas(canvasEl.value);
  
          // Delete icon SVG
          const deleteIcon =
            "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
          const deleteImg = new Image();
          deleteImg.src = deleteIcon;
  
          // Customizing Fabric.js object properties
          fabric.Object.prototype.transparentCorners = false;
          fabric.Object.prototype.cornerColor = 'blue';
          fabric.Object.prototype.cornerStyle = 'circle';
  
          // Function to add a rectangle to the canvas
          function Add() {
            const rect = new fabric.Rect({
              left: 100,
              top: 50,
              fill: 'yellow',
              width: 200,
              height: 100,
              objectCaching: false,
              stroke: 'lightgreen',
              strokeWidth: 4,
              cornerSize: 24, // Set the corner size for this object
            });
  
            // Custom delete control
            rect.controls.deleteControl = new fabric.Control({
              x: 0.5,
              y: -0.5,
              offsetY: 16,
              cursorStyle: 'pointer',
              mouseUpHandler: deleteObject,
              render: renderIcon,
            });
  
            canvas.value?.add(rect);
            canvas.value?.setActiveObject(rect);
          }
  
          // Add button event listener
          document.getElementById('add')?.addEventListener('click', () => Add());
  
          // Initial call to Add a rectangle
          Add();
  
          // Function to delete an object
          function deleteObject(_eventData: any, transform: any) {
            const canvas = transform.target.canvas;
            canvas.remove(transform.target);
            canvas.requestRenderAll();
          }
  
          // Function to render the delete icon at the corner of the object
          function renderIcon(
            ctx: CanvasRenderingContext2D,
            left: number,
            top: number,
            _styleOverride: any,
            fabricObject: any
          ) {
            const size = fabricObject.cornerSize || 24; // Use cornerSize from the fabricObject, default to 24
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
            ctx.restore();
          }
        }
      });
  
      return { canvasEl };
    },
  });
  </script>
  
  <style scoped>
  canvas {
    border: 1px solid black;
  }
  </style>
  