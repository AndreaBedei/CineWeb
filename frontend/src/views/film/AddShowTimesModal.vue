<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import dayjs from "dayjs";
import axios, { type AxiosResponse } from "axios";
import SimpleButton from "@/components/SimpleButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import LoadingAlert from '@/components/LoadingAlert.vue';
import ErrorAlert from "@/components/ErrorAlert.vue";
import "dayjs/locale/it"; // Importa la localizzazione italiana
import OkAlert from "@/components/OkAlert.vue";
dayjs.locale("it"); // Imposta la lingua italiana

const props = defineProps({
    movie: {
        type: Object,
    },
    cinema: {
        type: String,
        default: "",
    },
    room: {
        type: String,
        default: "",
    },
    date: {
        type: dayjs.Dayjs,
        default: dayjs(),
    },
    priceV: {
        type: String,
        default: "0.0",
    },
    h: {
        type: Number,
        default: 8,
    },
    m: {
        type: Number,
        default: 0,
    },
    screeningId: {
        type: String,
        default: "",
    },
});

// Stato delle sale, proiezioni e modale
interface Room {
    _id: string;
    name: string;
}

const rooms = ref<Room[]>([]);

interface Cinema {
    _id: string;
    name: string;
}

const cinemas = ref<Cinema[]>([]);

const emit = defineEmits(['close', "update"]);

const selectedCinema = ref(props.cinema); // Sala selezionata
if (selectedCinema.value !== "") {
    getRooms(selectedCinema.value);
}
const selectedRoom = ref(props.room); // Sala selezionata
const checkLoading = ref(false);
const msgUserOk = ref("");
const screeningId = ref(props.screeningId);
const msgUserError = ref("");
const loading = ref(false);
const currentDate = ref(props.date); // Data corrente del calendario
const selectedDate = ref(currentDate.value.format("YYYY-MM-DD")); // Usa ref per renderlo reattivo
const price = ref(props.priceV); // Prezzo del biglietto
const newProjection = ref({ hour: props.h, minute: props.m }); // Orario della nuova proiezione
const projections = ref<Projection[]>([]); // Proiezioni per la sala selezionata
const isModalOpen = ref(false); // Stato del modale
changeDate(selectedDate.value);

interface Projection {
    roomId: string;
    date: string;
    times: string[];
    movie: string;
}

async function getScreeningsByDate(room: string) {
    loading.value = true;
    projections.value = [];
    try {
        const startTime = dayjs(selectedDate.value).hour(0).minute(0).second(0).millisecond(0);
        const response = await axios.get(`http://localhost:3001/screenings/cinemaHall/${room}/date/${startTime.toISOString()}`);
        if (response.status === 200 && response.data.length > 0) {
            projections.value = response.data.map((screening: {
                screeningDate: string | number | Date | dayjs.Dayjs | null | undefined; movie: {
                    title: string; duration: string;
                }; cinemaHall: string;
            }) => {
                const startTime = dayjs(screening.screeningDate);
                const endTime = startTime.add(parseInt(screening.movie?.duration, 10), 'minute');

                return {
                    roomId: room,
                    date: startTime.format("YYYY-MM-DD"),
                    times: [`${startTime.format("HH:mm")} - ${endTime.format("HH:mm")}`],
                    movie: screening.movie.title,
                };
            });
        }

    } catch (error) {
        console.error("Errore di connessione:", error);
    } finally {
        loading.value = false;
    }
}

// Genera i giorni del mese
const daysInMonth = computed(() => {
    const startOfMonth = currentDate.value.startOf("month");
    const endOfMonth = currentDate.value.endOf("month");
    const days = [];

    for (let d = startOfMonth; d.isBefore(endOfMonth) || d.isSame(endOfMonth); d = d.add(1, "day")) {
        days.push(d.format("YYYY-MM-DD"));
    }

    return days;
});

// Cambia sala
function changeRoom(id: string) {
    selectedRoom.value = id;
}

function changeCinema(name: string) {
    selectedCinema.value = name;
}

// Cambia mese
function changeMonth(direction: "prev" | "next") {
    currentDate.value = direction === "prev"
        ? currentDate.value.subtract(1, "month")
        : currentDate.value.add(1, "month");
}

// Aggiungi una nuova proiezione
async function addProjection() {
    checkLoading.value = true;
    const { hour, minute } = newProjection.value;
    const startTime = dayjs(selectedDate.value).hour(hour).minute(minute); // Combina la data selezionata con l'ora di inizio
    let response: AxiosResponse;

    try {
        if (screeningId.value === "") {
            response = await axios.post(`http://localhost:3001/screenings/`, {
                movie: props.movie?._id, // Sostituisci con l'ID effettivo del film
                cinemaHall: selectedRoom.value, // Sostituisci con l'ID della sala selezionata
                ticketPrice: price.value, // Prezzo del biglietto
                screeningDate: startTime.toISOString() // Converte il valore in formato ISO
            });
        } else {
            response = await axios.put(`http://localhost:3001/screenings/${screeningId.value}`, {
                movie: props.movie?._id, // Sostituisci con l'ID effettivo del film
                cinemaHall: selectedRoom.value, // Sostituisci con l'ID della sala selezionata
                ticketPrice: price.value, // Prezzo del biglietto
                screeningDate: startTime.toISOString() // Converte il valore in formato ISO
            });
        }

        if (response.status === 201 && screeningId.value === "") {
            msgUserOk.value = "Proiezione aggiunta con successo.";
            getScreeningsByDate(selectedRoom.value);
            emit('update');
        } else if (response.status === 200) {
            msgUserOk.value = "Proiezione modificata con successo.";
            getScreeningsByDate(selectedRoom.value);
            emit('update');
        } else if (screeningId.value === ""){
            msgUserError.value = "Errore durante l'inserimento della proiezione.";
        } else {
            msgUserError.value = "Errore durante la modifica della proiezione.";
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        msgUserError.value = "Errore di connessione durante l'inserimento della proiezione.";
    } finally {
        checkLoading.value = false;
    }
}


function closeModal() {
    isModalOpen.value = false;
    emit('close', false);
}

onMounted(() => {
    getCinemas();
});

async function getCinemas() {
    try {
        const response = await axios.get(`http://localhost:3001/cinemas`);
        if (response.status === 200) {
            cinemas.value = response.data.map((cinema: { _id: string; name: string }) => ({ _id: cinema._id, name: cinema.name }));
        } else {
            console.error("Errore durante il recupero delle sale.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

async function getRooms(newCinemaName: string) {
    try {
        const response = await axios.get(`http://localhost:3001/cinemaHalls/cinema/${newCinemaName}`);
        if (response.status === 200) {
            rooms.value = response.data;
        } else {
            console.error("Errore durante il recupero delle sale.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

async function changeDate(day: string) {
    selectedDate.value = day;
    if (selectedRoom.value !== "") {
        getScreeningsByDate(selectedRoom.value);
    }
}

watch(selectedCinema, async (newCinemaName) => {
    selectedRoom.value = "";
    getRooms(newCinemaName);
});

watch(selectedRoom, async (newRoom) => {
    getScreeningsByDate(newRoom);
});
</script>

<template>
    <section class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-3xl overflow-hidden">
            <header class="flex justify-between items-center bg-primary text-white px-4 py-3">
                <h4 class="text-lg font-semibold">Nuova Proiezione Per Film "{{ movie?.title }}"</h4>
                <button @click="closeModal" class="text-white hover:text-gray-200">
                    ✕
                </button>
            </header>
            <LoadingAlert v-if="checkLoading" />
            <ErrorAlert v-if="msgUserError" :message="msgUserError" @clear="msgUserError = ''" />
            <OkAlert v-if="msgUserOk" :message="msgUserOk" @clear="msgUserOk = ''" />
            <form @submit.prevent="addProjection" class="p-4 space-y-4" method="post">
                <!-- Selezione del cinema -->
                <section>
                    <label for="cinema" class="block text-sm font-medium text-gray-700">Cinema</label>
                    <select id="cinema" v-model="selectedCinema" required
                        @change="changeCinema(($event.target as HTMLSelectElement).value)"
                        class="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-700">
                        <option v-for="cinema in cinemas" :key="cinema._id" :value="cinema.name"
                            class="text-gray-700 hover:bg-gray-100">
                            {{ cinema.name }}
                        </option>
                    </select>
                </section>

                <!-- Selezione della sala -->
                <section>
                    <label for="room" class="block text-sm font-medium text-gray-700">Sala</label>
                    <select id="room" v-model="selectedRoom" required
                        @change="changeRoom(($event.target as HTMLSelectElement).value)"
                        class="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                        :disabled="selectedCinema === ''"
                        :class="selectedCinema === '' ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-white text-gray-700'">
                        <option v-for="room in rooms" :key="room._id" :value="room._id">
                            {{ room.name }}
                        </option>
                    </select>
                </section>

                <!-- Calendario -->
                <section>
                    <div class="flex justify-between items-center">
                        <button type="button" @click="changeMonth('prev')" class="text-primary hover:primary-dark">
                            ← Mese precedente
                        </button>
                        <h3 class="text-lg font-bold">{{ currentDate.format("MMMM YYYY") }}</h3>
                        <button type="button" @click="changeMonth('next')" class="text-primary hover:text-prymary-dark">
                            Mese successivo →
                        </button>
                    </div>

                    <div class="mt-4 grid grid-cols-7 gap-2">
                        <p v-for="day in daysInMonth" :key="day"
                            class="border rounded-lg p-2 text-center cursor-pointer"
                            :class="day === selectedDate ? 'bg-primary-medium' : 'bg-gray-50 hover:bg-gray-100'"
                            @click="changeDate(day)">
                            {{ dayjs(day).date() }}
                        </p>
                    </div>
                </section>

                <BaseInput id="price" label="Prezzo" type="number" v-model="price" :require="true"
                    :range="{ min: 0, max: 100, step: 0.01 }" />

                <!-- Proiezioni per la data selezionata -->
                <section v-if="selectedDate">
                    <h5 v-if="selectedRoom !== ''" class="text-lg font-bold">
                        Proiezioni per il {{ dayjs(selectedDate).format("DD MMMM YYYY") }}
                    </h5>
                    <ul v-if="projections.length !== 0" class="mt-2 space-y-2">
                        <li class="flex gap-3 items-center bg-gray-100 rounded-md px-4 py-2"
                            v-for="projection in projections" :key="projection.date + projection.times">
                            <p class="font-semibold">{{ projection.movie }}</p>
                            <p>{{ projection.times.join(", ") }}</p>
                        </li>
                    </ul>
                    <p v-else-if="loading" class="text-gray-700 mt-2">Caricamento...</p>
                    <p v-else-if="selectedRoom !== ''" class="text-gray-700 mt-2">Nessuna proiezione in questa sala per
                        questa data.</p>

                    <div class="mt-4 flex items-center gap-4">
                        <!-- Selezione ora -->
                        <label for="hour" class="text-sm">Ora:</label>
                        <select id="hour" v-model="newProjection.hour"
                            class="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option v-for="hour in 17" :key="hour" :value="hour + 7">{{ hour + 7 }}</option>
                        </select>

                        <!-- Selezione minuti -->
                        <label for="minute" class="text-sm">Minuti:</label>
                        <select id="minute" v-model="newProjection.minute"
                            class="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option v-for="minute in 12" :key="minute" :value="(minute - 1) * 5">{{ (minute - 1) * 5 }}
                            </option>
                        </select>

                        <!-- Spaziatore per spingere il bottone a destra -->
                        <div class="flex-grow"></div>

                        <!-- Bottone -->

                        <SimpleButton v-if="screeningId === ''" class="justify-end" content="Aggiungi" type="submit" color="green"
                            rounding="small" />
                        <SimpleButton v-else class="justify-end" content="Modifica" type="submit" color="secondary"
                            rounding="small" />
                    </div>
                </section>
            </form>
        </div>
    </section>
</template>
