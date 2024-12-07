<script setup lang="ts">
defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-4 p-2 border-b-solid border-b-black border-b-1">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="w-10 h-10">
        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:" class="flex-grow">
        <button v-if="logged">Profilo Utente</button>
        <button>{{ logged ? "Logout" : "Login" }}</button>
    </div>
</template>
