<script setup lang="ts">
import SimpleButton from '@/components/SimpleButton.vue';
import router from '@/router';
</script>

<template>
    <div class="m-5">
        <p>Accesso vietato</p>
        <SimpleButton color="primary" :handle-click="() => router.push('/')">Torna alla home</SimpleButton>
    </div>
</template>
