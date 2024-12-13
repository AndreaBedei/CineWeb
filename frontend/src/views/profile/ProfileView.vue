<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SimpleButton from '@/components/SimpleButton.vue'
import Modal from './ModifyModal.vue'
import PasswordModal from './PasswordModal.vue'
import ModalOk from '@/components/PageModal.vue'
import axios from 'axios';
import { useUserStore } from '../stores/user';

interface Interest {
    _id: string;
    name: string;
}

const id = "6759566a35d32d551c8bb5e5";
const userStore = useUserStore();

async function getUserData() {
    try {
        const response = await axios.get(`http://localhost:3001/users/${id}`);
        const data = response.data;
        if (data) {
            userData.value = data;
            mail.value = data.email;
            name.value = data.name;
            surname.value = data.surname;
            interests.value = data.favoriteGenres;
            image.value = data.profilePicture;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


// Props o dati passati per il controllo
const userData = ref(null);
const isCurrentUser = ref(true); // Simula se l'utente visualizzato è quello loggato
const mail = ref("");
const name = ref("");
const surname = ref("");
const image = ref("profile.webp");
const interests = ref<Interest[]>([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const pastReservation = ref([]);
const futureReservation = ref([]);

function showCheckModal(title: string, message: string) {
    modalTitle.value = title;
    modalMessage.value = message;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

// Stato per gestire la visibilità del modale
const isModalVisibleProfile = ref(false);
const isModalVisiblePassword = ref(false);

// Funzione per aprire il modale
function openModalProfile() {
    isModalVisibleProfile.value = true;
}

// Funzione per aprire il modale
function openModalPassword() {
    isModalVisiblePassword.value = true;
}

// Funzione per chiudere il modale
function closeModalProfile() {
    isModalVisibleProfile.value = false;
}

function closeModalPassword() {
    isModalVisiblePassword.value = false;
}

// Funzione per gestire l'invio del modulo
async function handleFormSubmit(form: unknown) {
    try {
        await axios.put(`http://localhost:3001/users/${id}`, form.value);
        showCheckModal('Conferma', "I dati sono stati aggiornati come richiesto!");
        closeModalProfile();
        closeModalPassword();
        await userStore.refresh()
    } catch (error) {
        showCheckModal('Errore', "I dati non sono stati aggiornati! Contattare l'assistenza col seguente errore: " + error);
    }
    getUserData();
}

onMounted(async () => {
    getUserData();
    pastReservation.value = (await axios.get(`http://localhost:3001/reservations/user/${id}/past`)).data;
    futureReservation.value = (await axios.get(`http://localhost:3001/reservations/user/${id}/future`)).data;
});


const formatDate = (date: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
};

function goToFilm() {
    
}
</script>

<template>
    <div class="p-4 space-y-6 w-screen">
        <h1 class="text-2xl font-bold text-center">Profilo Utente</h1>
        <div class="bg-gray-100 p-4 rounded-lg shadow flex flex-col lg:flex-row items-center lg:items-start">
            <img :src="`http://localhost:3001/img/profile/${image}`" alt="Foto Utente"
                class="w-24 h-24 rounded-full object-cover mb-4 lg:mb-0 lg:mr-4" />
            <div class="flex-1">
                <h2 class="text-xl font-semibold">{{ name }} {{ surname }}</h2>
                <p class="text-gray-600">
                    Mail: {{ mail }}
                </p>
                <p class="text-gray-600">
                    Interessi: <span v-for="(interest, index) in interests" :key="index">{{ interest.name + " "
                        }}</span>
                </p>
            </div>
            <div v-if="isCurrentUser" class="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                <SimpleButton content="Modifica informazioni" color="primary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" @click="openModalProfile" />

                <SimpleButton content="Modifica password" color="primary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" @click="openModalPassword" />

                <SimpleButton content="Vedi Notifiche" color="secondary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-if="isCurrentUser" class="bg-gray-100 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">I tuoi biglietti</h3>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th id="film" class="border-b p-2">Film</th>
                            <th id="time" class="border-b p-2">Orario</th>
                            <th id="cinema" class="border-b p-2">Cinema</th>
                            <th id="hall" class="border-b p-2">Sala</th>
                            <th id="seat" class="border-b p-2">Posto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ticket in futureReservation" :key="ticket._id">
                            <td headers="film" class="border-b p-2">{{ ticket.screening._doc.movie.title }}</td>
                            <td headers="time" class="border-b p-2">{{ formatDate(ticket.screening._doc.screeningDate) }}</td>
                            <td headers="cinema" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.cinema }}</td>
                            <td headers="hall" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.name }}</td>
                            <td headers="seat" class="border-b p-2">{{ ticket.seats.join(', ') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div :class="{ 'col-span-2': !isCurrentUser, 'col-span-1': isCurrentUser }"
                class="bg-gray-100 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Film visti in passato</h3>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th id="film" class="border-b p-2">Film</th>
                            <th id="time" class="border-b p-2">Orario</th>
                            <th id="cinema" class="border-b p-2">Cinema</th>
                            <th v-if="isCurrentUser" id="action" class="border-b p-2">Recensione</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ticket in pastReservation" :key="ticket._id">
                            <td headers="film" class="border-b p-2">{{ ticket.screening._doc.movie.title }}</td>
                            <td headers="time" class="border-b p-2">{{ formatDate(ticket.screening._doc.screeningDate) }}</td>
                            <td headers="cinema" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.cinema }}</td>
                            <td v-if="isCurrentUser" headers="action" class="border-b p-2">
                                <router-link :to="{ path: `/movie`, query: { id: ticket.screening._doc.movie._id} }" class="block">
                                    <SimpleButton content="Recensisci" color="green" :outlineOnly="false" :rounded="true"
                                        size="small" bold :disabled="false" />
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Modal v-if="isModalVisibleProfile" title="Modifica Profilo" :name="name" :surname="surname" :interests="interests"
        @closeModal="closeModalProfile" @submitForm="handleFormSubmit" />
    <PasswordModal v-if="isModalVisiblePassword" title="Modifica Password" :id="id" @closeModal="closeModalPassword"
        @submitForm="handleFormSubmit" />
    <ModalOk v-if="showModal" :title="modalTitle" :message="modalMessage" @closeModal="closeModal" />
</template>
