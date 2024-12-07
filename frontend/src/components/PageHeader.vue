<script setup lang="ts">
defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-4 p-2 border-b-solid border-b-black border-b-2">
        <div class="w-6 h-6 bg-red-300"></div>
        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:" class="flex-grow">
        <button v-if="logged">Profilo Utente</button>
        <button>{{ logged ? "Logout" : "Login" }}</button>
    </div>
</template>
