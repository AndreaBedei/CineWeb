<script setup lang="ts">
import { ref } from 'vue';
import MovieRoom from './MovieRoom.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import InputList from '@/components/InputList.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter()
const user = useUserStore()

if (!user.isAdmin) {
    router.push("/")
}

const name = ref("")
const rows = ref("1")
const cols = ref("1")

function addMovieRoom() {
    alert(`Movie room ${name.value} added!`) // TODO: (also backend should double-check that the user is an admin)
}

function resetValues() {
    name.value = ""
    rows.value = "1"
    cols.value = "1"
}

function handleInputUpdate(index: number, value: string) {
    switch (index) {
        case 0:
            name.value = value
            break
        case 1:
            rows.value = value
            break
        case 2:
            cols.value = value
            break
        default:
            break
    }
}
</script>

<template>
    <div class="w-full flex flex-col mb-8">
        <div class="my-4">
            <h1 class="text-2xl font-bold text-center">Aggiungi nuova sala</h1>
        </div>
        <div class="flex flex-grow justify-center gap-2">
            <div class="flex flex-col gap-2 bg-gray-50 border-1, border-solid border-slate-500 rounded-lg w-4/5 max-w-[800px] p-5 self-center">
                <form class="flex flex-col gap-2" @submit.prevent="addMovieRoom" @reset="resetValues">
                    <InputList
                        :inputs="[
                            {
                                id: 'room_name',
                                label: 'Nome sala:',
                                placeholder: 'Nome sala',
                                required: true,
                                inputSize: 'fit',
                                value: name,
                            },
                            {
                                id: 'room_rows',
                                label: 'Righe:',
                                placeholder: 'Numero righe',
                                inputType: 'number',
                                required: true,
                                inputSize: 'fit',
                                value: rows,
                                range: { min: 1, max: 30 }
                            },
                            {
                                id: 'room_seats',
                                label: 'Posti per riga:',
                                placeholder: 'Numero posti per riga',
                                inputType: 'number',
                                required: true,
                                inputSize: 'fit',
                                value: cols,
                                range: { min: 1, max: 50 }
                            },
                        ]"
                        @update:value="handleInputUpdate"/>
                    <MovieRoom :rows="Number(rows)" :cols="Number(cols)" :interactive="false" class="h-[50vh]"/>
                    <div class="flex justify-end gap-2">
                        <SimpleButton id="reset" type="reset" color="red" size="small" content="Reset" rounding="small"/>
                        <SimpleButton id="submit" type="submit" color="green" size="small" content="Aggiungi" rounding="small"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
