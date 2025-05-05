<template>
  <div>
    <canvas ref="canvasEl" width="1600" height="1200"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as fabric from 'fabric';

class Cross extends fabric.Object {
  width: number;
  height: number;
  w1: number;
  h1: number;
  w2: number;
  h2: number;
  animDirection: string;

  constructor(options: any = {}) {
    super(options);

    // TypeScript may not recognize these properties directly, so we cast them
    (this as any).transparentCorners = false;  // Property belongs to fabric.Object
    (this as any).objectCaching = false;       // Property belongs to fabric.Object
    this.animDirection = 'up';

    this.width = 100;
    this.height = 100;
    this.w1 = this.h2 = 100;
    this.h1 = this.w2 = 30;
  }

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

  _render(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1);
    ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2);
  }
}

export default defineComponent({
  name: 'CanvasComponent',
  setup() {
    const canvasEl = ref<HTMLCanvasElement | null>(null);
    const canvas = ref<fabric.Canvas | null>(null);

    onMounted(() => {
      if (canvasEl.value) {
        canvas.value = new fabric.Canvas(canvasEl.value);

        canvas.value.add(
          new Cross({ top: 100, left: 100 }),
          new Cross({ top: 140, left: 230 }),
          new Cross({ top: 300, left: 210 }),
          new Cross({ top: 40, left: 400 }),
          new Cross({ top: 450, left: 400 })
        );

        const animate = () => {
          canvas.value?.forEachObject((obj) => {
            if (obj instanceof Cross) {
              obj.animateWidthHeight();
            }
          });
          canvas.value?.requestRenderAll();
          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }
    });

    return { canvasEl };
  },
});
</script>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
