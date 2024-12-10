<script setup lang="ts">
import { ref } from "vue";

defineProps({
  items: { type: Array, required: true },
  cardClass: { type: String, default: "" },
});

const scrollContainer = ref<HTMLDivElement | null>(null);

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: "smooth" });
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: "smooth" });
  }
}
</script>

<template>
  <div class="relative w-full">
    <button
      @click="scrollLeft"
      class="absolute left-0 z-10 p-2 bg-neutral-dark text-neutral-light rounded-full shadow-md hover:bg-primary-dark"
    >
      ◀
    </button>

    <div
      ref="scrollContainer"
      class="flex overflow-x-scroll space-x-4 scrollbar-hide scroll-smooth"
    >
      <slot v-for="(item, index) in items" :item="item" :key="index" />
    </div>

    <button
      @click="scrollRight"
      class="absolute right-0 z-10 p-2 bg-neutral-dark text-neutral-light rounded-full shadow-md hover:bg-primary-dark"
    >
      ▶
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}
</style>
