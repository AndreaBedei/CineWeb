<script setup lang="ts">
import { useUserStore } from '@/views/stores/user';
import SimpleButton from './SimpleButton.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { ArrowLeftStartOnRectangleIcon, ArrowRightEndOnRectangleIcon, EllipsisVerticalIcon, HomeIcon, UserCircleIcon } from '@heroicons/vue/16/solid';
import SearchBar from './SearchBar.vue';

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

        <SearchBar  />

        <!-- <input type="search" name="searchbar" id="searchbar" placeholder="Ricerca:"
            class="w-0 flex-grow bg-neutral-dark border border-neutral-light text-neutral-light placeholder-neutral-light px-2
                    text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:outline-none" /> -->

        <div class="hidden md:flex gap-2 ms-auto">
            <SimpleButton v-if="logged" content="Profilo" color="secondary" rounding="small" :handle-click="goToProfile"></SimpleButton>
            <SimpleButton v-if="logged" content="Home" color="secondary" rounding="small" :handle-click="goToHome"></SimpleButton>
            <SimpleButton v-if="logged" content="Logout" color="red" rounding="small" :handle-click="goToLoginAndOut"></SimpleButton>
            <SimpleButton v-if="!logged" content="Login" color="secondary" rounding="small" :handle-click="goToLogin"></SimpleButton>
        </div>
        <div class="md:hidden relative flex-shrink-0 w-14">
            <div class="absolute right-0 h-full aspect-square">
                <div class="flex gap-2 flex-col bg-slate-700 rounded-full" :class="{ 'aspect-square overflow-hidden' : !expanded }">
                    <SimpleButton color="primary" :title="expanded ? 'Chiudi menù azioni' : 'Apri menù azioni'" rounding="full" :handle-click="toggleExpandedMenu" size="small" :bold="true"
                        class="aspect-square transition-all" :class="{ '-rotate-90 m-1' : expanded }">
                        <EllipsisVerticalIcon class="py-0"/>
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Profilo" color="secondary" rounding="full" :handle-click="goToProfile" size="small" class="aspect-square m-1">
                        <UserCircleIcon />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Home" color="secondary" rounding="full" :handle-click="goToHome" size="small" class="aspect-square m-1">
                        <HomeIcon />
                    </SimpleButton>
                    <SimpleButton v-if="logged" title="Logout" color="red" rounding="full" :handle-click="goToLoginAndOut" size="small" class="aspect-square m-1">
                        <ArrowLeftStartOnRectangleIcon />
                    </SimpleButton>
                    <SimpleButton v-if="!logged" title="Login" color="green" rounding="full" :handle-click="goToLogin"  size="small" class="aspect-square m-1">
                        <ArrowRightEndOnRectangleIcon />
                    </SimpleButton>
                </div>
            </div>
        </div>
    </div>
</template>
