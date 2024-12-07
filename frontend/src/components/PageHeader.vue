<script setup lang="ts">
defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-4 p-2 border-b-solid border-b-black border-b-1">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="size-10 sm:size-12">
        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:" class="w-0 flex-grow border-slate-400 border-1 px-2 text-sm sm:text-base">
        <div class="flex gap-4 ms-auto">
            <button v-if="logged" class="w-14 text-sm sm:w-fit sm:text-base">Profilo Utente</button>
            <button class="text-sm sm:text-base">{{ logged ? "Logout" : "Login" }}</button>
        </div>
    </div>
</template>
