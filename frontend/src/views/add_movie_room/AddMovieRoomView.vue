<script setup lang="ts">
import { ref } from 'vue';
import MovieRoom from './MovieRoom.vue';
import BaseInput from '@/components/BaseInput.vue';
import SimpleButton from '@/components/SimpleButton.vue';

const name = ref("")
const rows = ref("0")
const cols = ref("0")

function addMovieRoom() {
    alert(`Movie room ${name.value} added!`)
}
</script>

<template>
    <div class="w-full flex flex-col">
        <div class="my-4">
            <h1 class="text-2xl font-bold text-center">Aggiungi nuova sala</h1>
        </div>
        <div class="flex flex-grow justify-center gap-2">
            <div class="flex flex-col gap-2 bg-gray-50 border-1, border-solid border-slate-500 rounded-lg w-4/5 p-5 self-center">
                <form class="flex flex-col gap-2">
                    <BaseInput id="room_name" label="Nome sala:" :require="true" input-size="fit" layout="row" v-model="name"/>
                    <BaseInput id="room_rows" label="Righe:" type="number" placeholder="Numero righe" :require="true" input-size="fit" layout="row" v-model="rows"/>
                    <BaseInput id="room_seats" label="Posti per riga:" type="number" placeholder="Numero posti per riga" :require="true" input-size="fit" layout="row" v-model="cols"/>
                </form>
                <MovieRoom :rows="Number(rows)" :cols="Number(cols)" :interactive="false" class="h-[30vh]"/>
                <div class="flex justify-end">
                    <SimpleButton color="primary" size="small" content="Aggiungi" rounding="small" :handle-click="addMovieRoom"/>
                </div>
            </div>
        </div>
    </div>
</template>
