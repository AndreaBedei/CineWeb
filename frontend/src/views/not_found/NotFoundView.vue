<script setup lang="ts">
import SimpleButton from '@/components/SimpleButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
    router.push('/');
}

function goBack() {
    router.go(-2);
}
</script>

<template>
    <div
        class="flex flex-col justify-center bg-gray-100 p-4 rounded-lg shadow items-center text-center px-6 w-screen m-10">
        <h1 class="text-6xl font-extrabold text-primary mb-4 drop-shadow-lg">
            404
        </h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-6">
            Risorsa non trovata
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-lg">
            La pagina che stavi cercando è stata rimossa o non è mai esistita. Se pensi ci sia un errore, contatta il
            supporto.
        </p>
        <div class="flex flex-col md:flex-row gap-4">
            <SimpleButton content="Torna alla Home" :handle-click="goToHome" color="primary" rounding="small"
                size="regular" />
            <SimpleButton content="Torna indietro" :handle-click="goBack" color="secondary" rounding="small"
                size="regular" />
        </div>
    </div>
</template>