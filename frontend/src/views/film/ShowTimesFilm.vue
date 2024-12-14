<script setup lang="ts">
const props = defineProps({
  showtimes: {
    type: Array,
    required: true,
  },
});

console.log(props.showtimes);
</script>

<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-4">Orari</h2>
    <ul class="divide-y divide-gray-300">
      <li v-for="showtime in showtimes" :key="showtime.id" class="py-2">
        <p>
          <strong>Cinema:</strong> {{ showtime.cinema }} - <strong>Sala:</strong> {{ showtime.room }} - <strong>Orario:</strong> {{ showtime.time }}
        </p>
      </li>
    </ul>
  </div>
</template>
