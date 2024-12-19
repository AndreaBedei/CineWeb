<!-- <script setup lang="ts">
import { ref } from 'vue';
import SimpleButton from '@/components/SimpleButton.vue';
import ErrorAlert from "@/components/ErrorAlert.vue";
import axios from 'axios';
import LoadingAlert from '@/components/LoadingAlert.vue';


// Props ricevute
const props = defineProps({
    modalTitle: {
        type: String,
        default: "Aggiungi proiezione"
    },
    movieId: {
        type: String,
        default: ''
    },
    modality: {
        type: Boolean,
        default: false
    },
});

const msgUser = ref("");
const check = ref(false);

const emit = defineEmits(['close', 'save', 'update']);


async function addTimeLine() {
    try {
        const response = await axios.post('http://localhost:3001/movies', {
            
        });

        if (response.status === 200) {
            emit('close', true);
        } else {
            msgUser.value = "Errore durante l'aggiunta della proiezione.";
            check.value = false;
        }
    } catch (error) {
        console.error('Errore di connessione:', error);
        msgUser.value = "Errore di connessione durante l'aggiunta del film.";
        check.value = false;
    }
}

async function updateTimeLine() {
    try {
        const response = await axios.put(`http://localhost:3001/movies/movie/${props.movieId}`, {

        });

        if (response.status === 200) {
            emit('update');
        } else {
            msgUser.value = "Errore durante l'aggiornamento del film.";
            check.value = false;
        }
    } catch (error) {
        console.error('Errore di connessione:', error);
        msgUser.value = "Errore di connessione durante l'aggiunta del film.";
        check.value = false;
    }
}

function handleSubmit() {
    check.value = true;
    if (props.modality) {
        updateTimeLine();
    } else {
        addTimeLine();
    }
}

function closeModal() {
    emit('close', false);
}

</script>
<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" role="dialog"
        aria-labelledby="modal-title" aria-modal="true">
        <div
            class="bg-white rounded-lg shadow-lg max-w-md sm:max-w-lg lg:max-w-2xl w-full p-6 relative max-h-[98vh] overflow-y-auto overflow-x-hidden">
            <header>
                <h2 id="modal-title" class="text-2xl font-semibold text-primary-dark mb-4">
                    {{ props.modalTitle }}
                </h2>
            </header>
            <ErrorAlert v-if="msgUser" :message="msgUser" @clear="msgUser = ''" />
            <LoadingAlert v-if="check" />
            <form @submit.prevent="handleSubmit">
                
                <div class="flex justify-end space-x-4">
                    <SimpleButton content="Annulla" color="red" :handleClick="closeModal" rounding="small" />
                    <SimpleButton content="Salva" color="green" rounding="small" type="submit" />
                </div>
            </form>
        </div>
    </div>
</template> -->


<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import dayjs from "dayjs";
import axios from "axios";
import SimpleButton from "@/components/SimpleButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import LoadingAlert from '@/components/LoadingAlert.vue';
import ErrorAlert from "@/components/ErrorAlert.vue";
import "dayjs/locale/it"; // Importa la localizzazione italiana
dayjs.locale("it"); // Imposta la lingua italiana

const props = defineProps({
    movie: {
        type: Object,
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

const emit = defineEmits(['close']);

const selectedRoom = ref(""); // Sala selezionata
const selectedCinema = ref(""); // Sala selezionata
const checkLoading = ref(false);
const msgUserOk = ref("");
const msgUserError = ref("");

interface Projection {
    roomId: string;
    date: string;
    times: string[];
    movie: string;
}

const projections = ref<Projection[]>([]); // Proiezioni per la sala selezionata

const currentDate = ref(dayjs()); // Data corrente del calendario
const selectedDate = ref(currentDate.value.format("YYYY-MM-DD")); // Usa ref per renderlo reattivo
const newProjection = ref({ hour: 8, minute: 0 }); // Orario della nuova proiezione
const price = ref("0.0"); // Prezzo del biglietto

const isModalOpen = ref(false); // Stato del modale

async function getScreeningsByDate(room: string) {
    projections.value = [];
    try {
        const startTime = dayjs(selectedDate.value).hour(0).minute(0).second(0).millisecond(0);
        const response = await axios.get(`http://localhost:3001/screenings/cinemaHall/${room}/date/${startTime.toISOString()}`);
        if (response.status === 200) {
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
        } else {
            console.error("Errore durante il recupero delle proiezioni.");
        }

    } catch (error) {
        console.error("Errore di connessione:", error);
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
    try {
        const response = await axios.post(`http://localhost:3001/screenings/`, {
            movie: props.movie?._id, // Sostituisci con l'ID effettivo del film
            cinemaHall: selectedRoom.value, // Sostituisci con l'ID della sala selezionata
            ticketPrice: price.value, // Prezzo del biglietto
            screeningDate: startTime.toISOString() // Converte il valore in formato ISO
        });

        if (response.status === 201) {
            msgUserOk.value = "Proiezione aggiunta con successo.";
        } else {
            console.error("Errore durante l'inserimento della proiezione.");
            msgUserError.value = "Errore durante l'inserimento della proiezione.";
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        msgUserError.value = "Errore di connessione durante l'inserimento della proiezione.";
    } finally {
        checkLoading.value = false;
    }

    // Reset del nuovo orario
    newProjection.value = { hour: 8, minute: 0 };
}


function closeModal() {
    isModalOpen.value = false;
    emit('close', false);
}

onMounted(() => {
    getCinemas();
    console.log(props.movie?.duration);
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
    getScreeningsByDate(selectedRoom.value);
}

watch(selectedCinema, async (newCinemaName) => {
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
                        <button @click="changeMonth('prev')" class="text-primary hover:primary-dark">
                            ← Mese precedente
                        </button>
                        <h3 class="text-lg font-bold">{{ currentDate.format("MMMM YYYY") }}</h3>
                        <button @click="changeMonth('next')" class="text-primary hover:text-prymary-dark">
                            Mese successivo →
                        </button>
                    </div>

                    <div class="mt-4 grid grid-cols-7 gap-2">
                        <div v-for="day in daysInMonth" :key="day"
                            class="border rounded-lg p-2 text-center cursor-pointer"
                            :class="day === selectedDate ? 'bg-primary-medium' : 'bg-gray-50 hover:bg-gray-100'"
                            @click="changeDate(day)">
                            {{ dayjs(day).date() }}
                        </div>
                    </div>
                </section>

                <BaseInput id="price" label="Prezzo" type="number" v-model="price" :require="true"
                    :range="{ min: 0, max: 100, step: 0.01 }" />

                <!-- Proiezioni per la data selezionata -->
                <section v-if="selectedDate">
                    <h5 v-if="selectedRoom!==''" class="text-lg font-bold">
                        Proiezioni per il {{ dayjs(selectedDate).format("DD MMMM YYYY") }}
                    </h5>
                    <ul v-if="projections.length!==0" class="mt-2 space-y-2">
                        <li class="flex gap-3 items-center bg-gray-100 rounded-md px-4 py-2" v-for="projection in projections"
                            :key="projection.date + projection.times">
                            <p class="font-semibold">{{ projection.movie }}</p>
                            <p>{{projection.times.join(", ")}}</p>
                        </li>
                    </ul>
                    <p v-else-if="selectedRoom!==''" class="text-gray-700 mt-2">Nessuna proiezione in questa sala per questa data.</p>

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
                        <SimpleButton class="justify-end" content="Aggiungi" type="submit" color="green"
                            rounding="small" />
                    </div>
                </section>
            </form>
        </div>
    </section>
</template>
