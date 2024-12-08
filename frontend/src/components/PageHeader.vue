<script setup lang="ts">
defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-4 p-2 bg-neutral-dark text-white border-b border-neutral-dark">
      <img
        src="../assets/img/icon.svg"
        alt="Icona CineWeb"
        class="w-10 h-10 sm:w-12 sm:h-12"
      />
 
      <input
        type="text"
        name="searchbar"
        id="searchbar"
        placeholder="Ricerca:"
        class="w-0 flex-grow bg-neutral-dark border border-neutral-light text-neutral-light placeholder-neutral-light px-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:outline-none"
      />
  
      <div class="flex gap-4 ms-auto">
        <button
          v-if="logged"
          class="px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
        >
          Profilo Utente
        </button>
        <button
          class="px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-secondary focus:ring-2 focus:ring-secondary-light focus:outline-none"
        >
          {{ logged ? "Logout" : "Login" }}
        </button>
      </div>
    </div>
  </template>
  
