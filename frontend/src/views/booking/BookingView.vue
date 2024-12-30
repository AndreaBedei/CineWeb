<script setup lang="ts">
import { useRoute } from 'vue-router';
import MovieRoom, { type Spot } from '@/views/edit_halls/MovieRoom.vue';
import { onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import SimpleButton from '@/components/SimpleButton.vue';
import PayPallModal from '@/components/PayPallModal.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const route = useRoute();
const user = useUserStore();

const screeningId = ref(route.query.id);
const ticketPrice = ref(0);
const cols = ref(0);
const rows = ref(0);
const occupied: Ref<{ row: number, col: number }[]> = ref([])
const selectedSpots: Ref<Spot[]> = ref([])

const bookingModal = ref(false);

function updateSpots(spots: Spot[]) {
    selectedSpots.value = spots;
}

function getTotalPrice() {
    return ticketPrice.value * selectedSpots.value.length;
}

onMounted(async () => {
    if (!screeningId.value) {
        router.push("/");
    }

    const screeningResponse = await axios.get(`http://localhost:3001/screenings/${screeningId.value}`);
    if (!screeningResponse.data) {
        console.error("Unable to load screening");
        return;
    }

    ticketPrice.value = screeningResponse.data.ticketPrice;

    const hallId = screeningResponse.data.cinemaHall._id;
    const hallResponse = await axios.get(`http://localhost:3001/cinemaHalls/${hallId}`);
    if (!hallResponse.data) {
        console.error("Unable to load hall info");
        return;
    }

    rows.value = hallResponse.data.numberOfRows;
    cols.value = hallResponse.data.numberOfColumns;

    const seatsResponse = await axios.get(`http://localhost:3001/screenings/${screeningId.value}/booked-seats`);
    if (!seatsResponse) {
        console.error("Unable to load screening");
        return;
    }

    occupied.value = (seatsResponse.data as { row: number, column: number }[]).map(o => ({ row: o.row, col: o.column }))

});
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="my-4">
            <h1 class="text-2xl font-bold text-center">Prenota posti</h1>
        </div>
        <div class="flex flex-wrap gap-10 m-auto justify-center p-8">
            <!-- Primo componente -->
            <MovieRoom v-if="rows" :rows="rows" :cols="cols" :occupied="occupied" @selected-spots="updateSpots"
                class="flex-grow max-w-[80vw] max-h-[40vh]" />

            <!-- Secondo componente -->
            <div v-if="rows" class="my-auto flex flex-col items-center gap-2 flex-grow min-w-[200px]">
                <p class="w-40 text-center">Posti selezionati: {{ selectedSpots.length }}</p>
                <p v-show="selectedSpots.length != 0" class="font-bold w-40 text-center">Totale: {{
                    getTotalPrice().toFixed(2) }} €</p>
                <SimpleButton color="primary" :disabled="selectedSpots.length == 0" :bold="true" content="Prenota"
                    :handle-click="() => bookingModal = true" class="mb-4" />
            </div>
        </div>
    </div>

    <PayPallModal v-if="bookingModal" :price="getTotalPrice().toFixed(2)" :user-id="user.userId"
        :screening-id="screeningId!.toString()" :selected-spots="selectedSpots" @close="bookingModal = false" />
</template>
