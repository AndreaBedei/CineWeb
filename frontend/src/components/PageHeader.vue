<script setup lang="ts">
defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-4 p-2 border-b-solid border-b-black border-b-1">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="w-12 h-12">
        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:" class="w-28 sm:flex-grow border-slate-400 border-1 px-2">
        <div class="flex gap-4 ms-auto">
            <button v-if="logged">Profilo Utente</button>
            <button>{{ logged ? "Logout" : "Login" }}</button>
        </div>
    </div>
</template>
