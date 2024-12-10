<script setup lang="ts">
import SimpleButton from './SimpleButton.vue';

defineProps<{
    logged: boolean
}>()
</script>

<template>
    <div class="flex gap-2 p-2 bg-neutral-dark text-white border-b border-neutral-dark">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="w-10 h-10 sm:w-12 sm:h-12 self-center" />

        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:"
            class="w-0 flex-grow bg-neutral-dark border border-neutral-light text-neutral-light placeholder-neutral-light px-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:outline-none" />

        <div class="flex gap-2 ms-auto">
            <SimpleButton v-if="logged" content="Profilo Utente" color="primary" rounding="small"></SimpleButton>
            <SimpleButton :content="logged ? 'Logout' : 'Login'" color="primary" rounding="small"></SimpleButton>
        </div>
    </div>
</template>
