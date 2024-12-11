<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  categories: { type: Array, required: true },
  vote: { type: String, required: true },
  imageUrl: { type: String, required: true },
});
</script>

<template>
  <div class="w-48 md:w-56 bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
    <img :src="imageUrl" :alt="title" class="w-full h-56 object-cover" />
    <div class="p-4">
      <h3 class="text-lg font-bold text-neutral-dark truncate">{{ title }}</h3>
      <p class="text-sm text-neutral text-neutral-medium mb-2 truncate">{{ categories.join(', ') }}</p>
      <div class="flex items-center justify-between">
        <span class="text-primary font-semibold">{{ vote }}</span>
        <span class="text-sm text-neutral-medium">Voto</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>