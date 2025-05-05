<template>
  <div id="app">
    <!-- Tab navigation buttons -->
    <div>
      <button @click="activeTab = 'canvas'" :class="{'active': activeTab === 'canvas'}">Canvas</button>
      <button @click="activeTab = 'rect'" :class="{'active': activeTab === 'rect'}">Rectangles</button>
      <button @click="activeTab = 'polygon'" :class="{'active': activeTab === 'polygon'}">Polygon</button>
      <button @click="activeTab = 'other'" :class="{'active': activeTab === 'other'}">Other Tab</button>
    </div>
    
    <!-- Content for the active tab -->
    <div v-if="activeTab === 'canvas'">
      <CanvasComponent />
    </div>
    <div v-if="activeTab === 'rect'">
      <RectCanvas />
    </div>
    <div v-if="activeTab === 'polygon'">
      <PolygonCanvas />
    </div>
    <div v-if="activeTab === 'other'">
      <OtherComponent />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CanvasComponent from './components/CanvasComponent.vue';
import OtherComponent from './components/Canvas.vue';  // Import the new component
import RectCanvas from '@/components/RectCanvas.vue';
import PolygonCanvas from '@/components/PolygonCanvas.vue'

export default defineComponent({
  name: 'App',
  components: {
    CanvasComponent,
    OtherComponent,  // Register the new component
    RectCanvas,
    PolygonCanvas
  },
  setup() {
    const activeTab = ref('canvas'); // Default tab is 'canvas'

    return {
      activeTab,
    };
  },
});
</script>

<style scoped>
/* Add styles for the tab buttons */
button {
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f0f0f0;
}

/* Style for the active tab */
button.active {
  background-color: #4CAF50;
  color: white;
}

/* Optional: add some spacing around the tab content */
div {
  margin-top: 20px;
}
</style>
