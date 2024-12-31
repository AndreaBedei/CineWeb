<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';
import AddShowTimesModal from './AddShowTimesModal.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import dayjs from "dayjs";
import axios from 'axios';
import PageModal from '@/components/PageModal.vue';
import router from '@/router';

const props = defineProps({
    showtimes: {
        type: [Object, String],
        required: true,
    },
    movie: {
        type: Object,
        required: true,
    },
});


const emit = defineEmits(["update"]);

const user = useUserStore();
const modalShowTime = ref(false);
const modalCheck = ref(false);
const screeningId = ref('');
const cinema = ref('');
const cinemaHall = ref('');
const screeningDate = ref(dayjs());
const ticketPrice = ref('0.00');
const h = ref(8)
const m = ref(0)

const title = ref('');
const message = ref('');
const elimination = ref(true);


function formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function isFutureDate(date: string): boolean {
    const screeningDate = new Date(date);
    const currentDate = new Date();
    return screeningDate > currentDate;
}

function closeModalAddShowTimes() {
    modalShowTime.value = false;
    cinema.value = '';
    cinemaHall.value = '';
    screeningDate.value = dayjs();
    ticketPrice.value = '0.00';
    screeningId.value = '';
    h.value = 8;
    m.value = 0;
}

function openModalCheck(id: string) {
    modalCheck.value = true;
    title.value = "Elimina proiezione"
    message.value = "Sei sicuro di voler eliminare la proiezione?"
    screeningId.value = id;
}

function openModalAddShowTimes() {
    modalShowTime.value = true;
}

function closeCheck() {
    modalCheck.value = false;
    elimination.value = true;
}

function booking(screeningId: string) {
    router.push({
        name: "booking",
        query: {
            id: screeningId
        }
    });
}

function openModalAddShowTimesWithParams(cinemaN: string, cinemaHallN: string, screeningDateN: dayjs.Dayjs, ticketPriceN: string, screeningIdN: string) {
    cinema.value = cinemaN;
    cinemaHall.value = cinemaHallN;
    screeningDate.value = dayjs(screeningDateN);
    screeningId.value = screeningIdN;
    ticketPrice.value = ticketPriceN;
    h.value = dayjs(screeningDateN).hour();
    m.value = dayjs(screeningDateN).minute();
    modalShowTime.value = true;
}

async function deleteScreen() {
    try {
        user.socket.emit('changeScreening', { screening: screeningId.value });
        const response = await axios.delete(`http://localhost:3001/screenings/${screeningId.value}`);
        screeningId.value = '';
        elimination.value = false;
        if (response.status === 200) {
            title.value = "Conferma eliminazione"
            message.value = "Proiezione eliminata con successo"
        } else {
            title.value = "Errore eliminazione"
            message.value = "Proiezione non eliminata!!!"
        }

    } catch (error) {
        console.error('Errore nel caricamento degli orari', error);
    }
    emit('update');
}

function updateShowTimes() {
    emit('update');
}
</script>

<template>
    <section class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
        <header>
            <h2 class="text-3xl font-bold text-primary-dark border-b pb-2 mb-4">Orari</h2>
        </header>

        <div v-if="Object.keys(props.showtimes).length === 0">
            <p class="text-lg text-gray-700 font-medium">
                Non ci sono orari disponibili per questo film
            </p>
        </div>

        <div v-else>
            <section v-for="(screenings, cinema) in props.showtimes" :key="cinema" class="p-4">
                <header>
                    <h3 class="text-2xl font-bold text-primary-dark border-b pb-2 mb-4">
                        {{ cinema }}
                    </h3>
                </header>

                <!-- Tabella -->
                <div class="overflow-x-auto">
                    <table
                        class="table-auto w-full text-left text-sm text-black border-collapse border min-w-max border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th :id="'room' + cinema" scope="col" class="py-2 px-1 font-semibold text-center">
                                    Sala
                                </th>
                                <th :id="'price' + cinema" scope="col" class="py-2 px-1 font-semibold text-center">
                                    Prezzo
                                </th>
                                <th :id="'date' + cinema" scope="col" class="py-2 px-1 font-semibold text-center">
                                    Orario
                                </th>
                                <th v-if="!user.isAdmin" :id="'action' + cinema" scope="col"
                                    class="py-2 px-1 font-semibold text-center">
                                    Prenota
                                </th>
                                <th v-else :id="'action' + cinema" scope="col"
                                    class="py-2 px-1 font-semibold text-center">
                                    Gestisci
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="screening in screenings" :key="screening.screeningId"
                                class="odd:bg-white even:bg-gray-200 hover:bg-gray-300 text-center">
                                <td :headers="'room' + cinema" class="py-2 px-1">
                                    {{ screening.cinemaHallName }}
                                </td>
                                <td :headers="'price' + cinema" class="py-2 px-1">
                                    {{ screening.ticketPrice.toFixed(2) }}
                                </td>
                                <td :headers="'date' + cinema" class="py-2 px-1">
                                    {{ formatDate(screening.screeningDate).split(',')[0] }} <br />
                                    {{ formatDate(screening.screeningDate).split(',')[1] }}
                                </td>
                                <td :headers="'action' + cinema"
                                    class="flex flex-wrap justify-center items-center py-2 px-1 text-center gap-2">
                                    <SimpleButton v-if="isFutureDate(screening.screeningDate) && !user.isAdmin"
                                        class="mx-1" size="small" rounding="small" content="Prenota" color="primary"
                                        :handle-click="() => booking(screening.screeningId)" />
                                    <div v-if="user.isAdmin" class="flex flex-col sm:flex-row items-center gap-1">
                                        <SimpleButton v-if="isFutureDate(screening.screeningDate)" size="small"
                                            rounding="small" content="Modifica" color="secondary" class="mx-1"
                                            :handle-click="() => openModalAddShowTimesWithParams(cinema, screening.cinemaHallId, screening.screeningDate, screening.ticketPrice.toFixed(2), screening.screeningId)" />
                                        <SimpleButton size="small" rounding="small" content="Elimina" color="red"
                                            :handle-click="() => openModalCheck(screening.screeningId)" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
        <div class="flex justify-end">
            <SimpleButton v-if="user.isAdmin" content="Aggiungi proiezione" color="primary" rounding="small"
                :handle-click="openModalAddShowTimes" />
        </div>
    </section>
    <PageModal v-if="modalCheck" :title="title" :message="message" :confirm="elimination" @confirm="deleteScreen"
        @close-modal="closeCheck" />
    <AddShowTimesModal v-if="modalShowTime" :movie="movie" :cinema="cinema" :room="cinemaHall" :date="screeningDate"
        :priceV="ticketPrice" :h="h" :m="m" :screeningId="screeningId" class="overflow-auto max-h-screen"
        @update="updateShowTimes" @close="closeModalAddShowTimes" />
</template>
