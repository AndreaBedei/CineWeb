<script setup lang="ts">
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
import { useUserStore } from './views/stores/user';
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();
const user = useUserStore();

watch(router.currentRoute, async (to) => {
    const logged = await user.tryLogin();
    if (!logged && to.path !== '/signon') {
        router.push('/signon');
    }
})

</script>

<template>
    <PageHeader :logged="user.userId != ''"></PageHeader>
    <main class="flex flex-grow bg-secondary-light">
        <RouterView />
    </main>
    <PageFooter></PageFooter>
</template>

<style scoped></style>
