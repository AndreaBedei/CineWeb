<script setup lang="ts">
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
</script>

<template>
    <PageHeader :logged="false"></PageHeader>
    <main class="flex flex-grow">
        <RouterView />
    </main>
    <PageFooter></PageFooter>
</template>

<style scoped></style>
