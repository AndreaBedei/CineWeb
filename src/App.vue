<script setup lang="ts">
import PageHeader from './components/PageHeader.vue';

</script>

<template>
    <PageHeader :logged="false"></PageHeader>
    <RouterView />
</template>

<style scoped></style>
