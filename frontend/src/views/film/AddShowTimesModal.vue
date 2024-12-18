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
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import axios from "axios";

// Stato delle sale, proiezioni e modale
const rooms = ref([
    { id: "1", name: "Sala 1" },
    { id: "2", name: "Sala 2" },
    { id: "3", name: "Sala 3" },
]);

const cinemas = ref([
    { _id: "1", name: "Cinema 1" },
    { _id: "2", name: "Cinema 2" },
    { _id: "3", name: "Cinema 3" },
]);

const emit = defineEmits(['close']);

const selectedRoom = ref("1"); // Sala selezionata
const selectedCinema = ref("1"); // Sala selezionata
const projections = ref([
    { roomId: "1", date: "2024-12-20", times: ["14:00", "17:00"] },
    { roomId: "1", date: "2024-12-21", times: ["16:00"] },
]);

const currentDate = ref(dayjs()); // Data corrente del calendario
const selectedDate = ref(currentDate.value.format("YYYY-MM-DD")); // Usa ref per renderlo reattivo
const newProjection = ref({ hour: 7, minute: 0 }); // Orario della nuova proiezione

const isModalOpen = ref(false); // Stato del modale

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

function changeCinema(id: string) {
    selectedCinema.value = id;
}

// Cambia mese
function changeMonth(direction: "prev" | "next") {
    currentDate.value = direction === "prev"
        ? currentDate.value.subtract(1, "month")
        : currentDate.value.add(1, "month");
}

// Aggiungi una nuova proiezione
function addProjection() {
    const { hour, minute } = newProjection.value;
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    const existing = projections.value.find(
        (p) => p.roomId === selectedRoom.value && p.date === selectedDate.value
    );

    if (existing) {
        existing.times.push(time);
    } else {
        projections.value.push({
            roomId: selectedRoom.value,
            date: selectedDate.value,
            times: [time],
        });
    }

    newProjection.value = { hour: 7, minute: 0 }; // Reset nuovo orario
}

function closeModal() {
    isModalOpen.value = false;
    emit('close', false);
}

async function getCinemas(){
    try {
        const response = await axios.get(`http://localhost:3001/cinemas/${newCinemaId}/rooms`);
        if (response.status === 200) {
            rooms.value = response.data;
        } else {
            console.error("Errore durante il recupero delle sale.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

async function getRooms(newCinemaId: string){
    try {
        const response = await axios.get(`http://localhost:3001/cinemas/${newCinemaId}/rooms`);
        if (response.status === 200) {
            rooms.value = response.data;
        } else {
            console.error("Errore durante il recupero delle sale.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

watch(selectedCinema, async (newCinemaId) => {
    getRooms(newCinemaId);
});


// Blocca lo scrolling della pagina quando il modale è aperto
watch(isModalOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
});
</script>

<template>
    <section class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-3xl overflow-hidden">
            <header class="flex justify-between items-center bg-primary text-white px-4 py-3">
                <h4 class="text-lg font-semibold">Gestione Proiezioni</h4>
                <button @click="closeModal" class="text-white hover:text-gray-200">
                    ✕
                </button>
            </header>

            <div class="p-4 space-y-4">
                <section>
                    <label for="cinema" class="block text-sm font-medium text-gray-700">Sala</label>
                    <select id="cinema" v-model="selectedCinema" @change="changeCinema(Number($event.target.value))"
                        class="mt-1 w-full border-gray-500 rounded-md shadow-md focus:ring-primary focus:border-primary">
                        <option v-for="cinema in cinemas" :key="cinema._id" :value="cinema._id">
                            {{ cinema.name }}
                        </option>
                    </select>
                </section>

                <!-- Selezione della sala -->
                <section>
                    <label for="room" class="block text-sm font-medium text-gray-700">Sala</label>
                    <select id="room" v-model="selectedRoom" @change="changeRoom(Number($event.target.value))"
                        class="mt-1 w-full border-gray-500 rounded-md shadow-md focus:ring-primary focus:border-primary">
                        <option v-for="room in rooms" :key="room.id" :value="room.id">
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
                            @click="selectedDate = day">
                            {{ dayjs(day).date() }}
                        </div>
                    </div>
                </section>

                <!-- Proiezioni per la data selezionata -->
                <section v-if="selectedDate">
                    <h5 class="text-lg font-bold">
                        Proiezioni per {{ dayjs(selectedDate).format("DD MMMM YYYY") }}
                    </h5>
                    <ul class="mt-2 space-y-2">
                        <li v-for="projection in projections.filter(p => p.roomId === selectedRoom && p.date === selectedDate)"
                            :key="projection.date + projection.times" class="bg-gray-100 rounded-md px-4 py-2">
                            {{ projection.times.join(", ") }}
                        </li>
                    </ul>

                    <!-- Aggiungi nuova proiezione -->
                    <div class="mt-4 flex items-center gap-2">
                        <label for="hour" class="text-sm">Ora:</label>
                        <select id="hour" v-model="newProjection.hour"
                            class="border-gray-300 rounded-md shadow-sm focus:primary focus:border-primary">
                            <option v-for="hour in 18" :key="hour" :value="hour + 7">{{ hour + 7 }}</option>
                        </select>

                        <label for="minute" class="text-sm">Minuti:</label>
                        <select id="minute" v-model="newProjection.minute"
                            class="border-gray-300 rounded-md shadow-sm focus:primary focus:border-primary">
                            <option v-for="minute in 12" :key="minute" :value="(minute - 1) * 5">{{ (minute - 1) * 5 }}
                            </option>
                        </select>

                        <button @click="addProjection"
                            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
                            Aggiungi
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>
