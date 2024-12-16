<script setup lang="ts">
import { useUserStore } from '@/views/stores/user';
import SimpleButton from './SimpleButton.vue';
import { useRouter } from 'vue-router';

defineProps<{
    logged: boolean
}>()

const router = useRouter();

function goToLogin() {
  router.push('/signon');
}

function goToLoginAndOut() {
  const userStore = useUserStore();
  userStore.logout();
  goToLogin();
}

function goToProfile() {
  router.push('/profile');
}

function goToHome() {
  router.push('/');
}
</script>

<template>
    <div class="flex gap-2 p-2 bg-neutral-dark text-white border-b border-neutral-dark relative">
        <img src="../assets/img/icon.svg" alt="Icona CineWeb" class="w-10 h-10 sm:w-12 sm:h-12 self-center" />

        <input type="text" name="searchbar" id="searchbar" placeholder="Ricerca:"
            class="w-0 flex-grow bg-neutral-dark border border-neutral-light text-neutral-light placeholder-neutral-light px-2
                    text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:outline-none mr-16 md:mr-0" />

        <div class="hidden md:flex gap-2 ms-auto">
            <SimpleButton v-if="logged" content="Profilo" color="secondary" rounding="small" :handle-click="goToProfile"></SimpleButton>
            <SimpleButton v-if="logged" content="Home" color="secondary" rounding="small" :handle-click="goToHome"></SimpleButton>
            <SimpleButton v-if="logged" content="Logout" color="red" rounding="small" :handle-click="goToLoginAndOut"></SimpleButton>
            <SimpleButton v-if="!logged" content="Login" color="secondary" rounding="small" :handle-click="goToLogin"></SimpleButton>
        </div>
        <!-- TODO: bottone per espandere -->
        <div class="flex md:hidden gap-2 flex-col absolute right-2">
            <SimpleButton v-if="logged" content="P" color="secondary" rounding="full" :handle-click="goToProfile" class="aspect-square"></SimpleButton>
            <SimpleButton v-if="logged" content="H" color="secondary" rounding="full" :handle-click="goToHome" class="aspect-square"></SimpleButton>
            <SimpleButton v-if="logged" content="L" color="red" rounding="full" :handle-click="goToLoginAndOut" class="aspect-square"></SimpleButton>
            <SimpleButton v-if="!logged" content="L" color="secondary" rounding="full" :handle-click="goToLogin" class="aspect-square"></SimpleButton>
        </div>
    </div>
</template>
