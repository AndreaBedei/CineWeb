<script setup lang="ts">
import { useRoute } from 'vue-router';
import MovieRoom, { type Spot } from '@/views/edit_halls/MovieRoom.vue';
import { onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import SimpleButton from '@/components/SimpleButton.vue';
import PayPallModal from '@/components/PayPallModal.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import PageModal from "@/components/PageModal.vue";


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

const isModalShown = ref(false);
const modalTitle = ref("");
const modalContent = ref("");

function showModal(title: string, message: string) {
    bookingModal.value = false;
    isModalShown.value = true;
    modalTitle.value = title;
    modalContent.value = message;
}

function hideModal() {
    isModalShown.value = false;
    router.back();
}

</script>

<template>
    <PageModal v-if="isModalShown" :title="modalTitle" :message="modalContent" :confirm="false"
        v-on:close-modal="hideModal" />

    <div class="flex flex-col w-full">
        <div class="my-4">
            <h1 v-if="!user.isAdmin" class="text-2xl font-bold text-center">Prenota posti</h1>
            <h1 v-else class="text-2xl font-bold text-center">Controlla prenotazioni</h1>
        </div>
        <div class="flex flex-wrap gap-10 mx-[30%] md:mx-auto my-auto justify-center p-8">
            <!-- Primo componente -->
            <MovieRoom v-if="rows" :rows="rows" :cols="cols" :occupied="occupied" @selected-spots="updateSpots"
                :class="[user.isAdmin ? 'flex-grow w-full h-full' : 'flex-grow max-w-[80vw] max-h-[40vh]']" />

            <!-- Secondo componente -->
            <div v-if="rows && !user.isAdmin" class="my-auto flex flex-col items-center gap-2 flex-grow min-w-[200px]">
                <p class="w-40 text-center">Posti selezionati: {{ selectedSpots.length }}</p>
                <p v-show="selectedSpots.length != 0" class="font-bold w-40 text-center">Totale: {{
                    getTotalPrice().toFixed(2) }} €</p>
                <SimpleButton color="primary" :disabled="selectedSpots.length == 0" :bold="true" content="Prenota"
                    :handle-click="() => bookingModal = true" class="mb-4" />
            </div>
        </div>
    </div>

    <PayPallModal v-if="bookingModal" :price="getTotalPrice().toFixed(2)" :user-id="user.userId"
        :screening-id="screeningId!.toString()" :selected-spots="selectedSpots" @close-msg="showModal"
        @close="bookingModal = false" />
</template>
