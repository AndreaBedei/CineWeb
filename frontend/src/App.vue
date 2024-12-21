<script setup lang="ts">
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
import { useUserStore } from './views/stores/user';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { io } from 'socket.io-client';

const router = useRouter();
const user = useUserStore();
// const registered = ref(false);

// const socket = io('http://localhost:3001');
// const notifications = ref<string[]>([]);

// onMounted(() => {
//   // Ricevi notifiche in tempo reale
//   socket.on('newReviewNotification', (reviewData) => {
//     notifications.value.push(`Nuova recensione: ${reviewData}`);
//   });
// });

watch(router.currentRoute, async (to) => {
    const logged = await user.tryLogin();
    if (!logged && to.path !== '/signon') {
        router.push('/signon');
    }
    // if (logged && user.isAdmin && !registered.value) {
    //     registered.value = true;
    //     socket.emit('registerAdmin');
    // }
})

// onUnmounted(() => {
//   socket.disconnect();
// });

</script>

<template>
    <PageHeader :logged="user.userId != ''"></PageHeader>
    <main class="flex flex-grow bg-secondary-light">
        <RouterView />
    </main>
    <PageFooter></PageFooter>
</template>

<style scoped></style>
