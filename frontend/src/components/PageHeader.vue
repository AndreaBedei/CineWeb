<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import SimpleButton from './SimpleButton.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { ArrowLeftStartOnRectangleIcon, ArrowRightEndOnRectangleIcon, EllipsisVerticalIcon, HomeIcon, UserCircleIcon, BellIcon } from '@heroicons/vue/16/solid';
import SearchBar from './SearchBar.vue';

defineProps<{
    logged: boolean
}>()

const router = useRouter();
const user = useUserStore();

const hasNewNotification = ref(false);

onMounted(() => {
    user.socket.on('newReviewNotification', () => {
        hasNewNotification.value = true;
        setTimeout(() => {
            hasNewNotification.value = false;
        }, 60000);
    });
    user.socket.on('newFilmNotification', () => {
        hasNewNotification.value = true;
        setTimeout(() => {
            hasNewNotification.value = false;
        }, 60000);
    });
    user.socket.on('newScreeningNotification', () => {
        hasNewNotification.value = true;
        setTimeout(() => {
            hasNewNotification.value = false;
        }, 60000);
    });
});

function goToNotify() {
    hasNewNotification.value = false; // Resetta lo stato
    router.push('/notify');
}

function goToLogin() {
    router.push('/signon');
}

function goToLoginAndOut() {
    const userStore = useUserStore();
    userStore.logout();
    goToLogin();
}

function goToProfile() {
    router.push(`/profile/${useUserStore().userId}`);
}

function goToHome() {
    router.push('/');
}

const expanded = ref(false);

function toggleExpandedMenu() {
    expanded.value = !expanded.value;
}
</script>

<template>
    <div class="flex gap-2 p-2 bg-neutral-dark text-white border-b border-neutral-dark relative">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="w-10 h-10 sm:w-12 sm:h-12 self-center" />

        <SearchBar class="flex-grow" />

        <div class="hidden md:flex gap-2 ms-auto">
            <SimpleButton v-if="logged" content="Profilo" color="secondary" rounding="small"
                :handle-click="goToProfile"></SimpleButton>
            <SimpleButton v-if="logged" content="Home" color="secondary" rounding="small" :handle-click="goToHome">
            </SimpleButton>
            <button
                v-if="logged"
                class="flex items-center gap-2 rounded-lg transition-colors border-solid border-2 px-5 py-3 bg-secondary hover:bg-secondary-dark text-white border-secondary hover:border-secondary-dark"
                @click="goToNotify" :class="{ 'bg-yellow-500 animate-pulse': hasNewNotification }">
                <span>Notifiche</span>
                <BellIcon class="w-6 h-6" />
            </button>

            <SimpleButton v-if="logged" content="Logout" color="red" rounding="small" :handle-click="goToLoginAndOut">
            </SimpleButton>
            <SimpleButton v-if="!logged" content="Login" color="secondary" rounding="small" :handle-click="goToLogin">
            </SimpleButton>
        </div>
        <div class="md:hidden relative flex-shrink-0 w-14 z-50">
            <div class="absolute right-0 h-full aspect-square">
                <div class="flex gap-2 flex-col bg-slate-700 rounded-full"
                    :class="{ 'aspect-square overflow-hidden': !expanded }">
                    <SimpleButton color="primary" :title="expanded ? 'Chiudi menù azioni' : 'Apri menù azioni'"
                        rounding="full" :handle-click="toggleExpandedMenu" size="small" :bold="true"
                        class="aspect-square transition-all" :class="{ '-rotate-90 m-1': expanded }">
                        <EllipsisVerticalIcon class="py-0" />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Profilo" color="secondary" rounding="full"
                        :handle-click="goToProfile" size="small" class="aspect-square m-1">
                        <UserCircleIcon />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Home" color="secondary" rounding="full" :handle-click="goToHome"
                        size="small" class="aspect-square m-1">
                        <HomeIcon />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Notifiche" color="secondary" rounding="full"
                        :handle-click="goToNotify" size="small" class="aspect-square m-1"
                        :class="{ 'animate-notify': hasNewNotification }">
                        <BellIcon />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Logout" color="red" rounding="full"
                        :handle-click="goToLoginAndOut" size="small" class="aspect-square m-1">
                        <ArrowLeftStartOnRectangleIcon />
                    </SimpleButton>
                    <SimpleButton v-if="!logged" title="Login" color="green" rounding="full" :handle-click="goToLogin"
                        size="small" class="aspect-square m-1">
                        <ArrowRightEndOnRectangleIcon />
                    </SimpleButton>
                </div>
            </div>
        </div>
    </div>
</template>
