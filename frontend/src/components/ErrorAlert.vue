    <script setup lang="ts">

    const props = defineProps({
        message: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(["clear"]);

    function clearMessage() {
        emit("clear");
    }
</script>

<template>
    <div v-if="message" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-2"
        role="alert" aria-live="polite">
        <strong class="font-bold">Errore: </strong>
        <span class="block sm:inline">{{ props.message }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3" role="button" @click="clearMessage">
            <svg class="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Chiudi</title>
                <path
                    d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
            </svg>
        </span>
    </div>
</template>


