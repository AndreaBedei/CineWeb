<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import SimpleButton from '@/components/SimpleButton.vue'
import Modal from './ModifyModal.vue'
import PasswordModal from './PasswordModal.vue'
import ModalOk from '@/components/PageModal.vue'
import axios from 'axios';
import { useUserStore } from '../../stores/user';
import router from '@/router';
import { TrashIcon } from '@heroicons/vue/16/solid';
import { useRoute } from 'vue-router';

interface Interest {
    _id: string;
    name: string;
}

const props = defineProps<{
    userId: string;
}>()

const user = useUserStore();
const userCurrentId = ref(user.userId);
const id = ref(props.userId);
const route = useRoute();

async function getUserData() {
    try {
        const response = await axios.get(`http://localhost:3001/users/${id.value}`);
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
        console.log(error);
        router.push('/NotFound');
    }
}


// Props o dati passati per il controllo
const userData = ref(null);
const isCurrentUser = ref(userCurrentId.value === id.value);
const confirmDelete = ref(false);
const mail = ref("");
const name = ref("");
const surname = ref("");
const image = ref("profile.webp");
const interests = ref<Interest[]>([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
interface Ticket {
    _id: string;
    screening: {
        _doc: {
            screeningDate: string | number | Date;
            cinemaHall: {
                cinema: string;
                name: string;
            };
            movie: string;
            movieTitle: string;
        };
    };
    seats: string[];
}

interface TicketFuture {
    _id: string;
    screening: {
        _doc: {
            screeningDate: string | number | Date;
            cinemaHall: {
                cinema: string;
                name: string;
            };
            movie: {
                title: string;
                _id: string;
            };
            movieTitle: string;
        };
    };
    seats: string[];
}

const pastReservation = ref<Ticket[]>([]);
const futureReservation = ref<TicketFuture[]>([]);

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
async function handleFormSubmit(form: { value: { email: string; name: string; surname: string; favoriteGenres: Interest[]; profilePicture: string } }) {
    try {
        await axios.put(`http://localhost:3001/users/${id.value}`, form.value);
        showCheckModal('Conferma', "I dati sono stati aggiornati come richiesto!");
        closeModalProfile();
        closeModalPassword();
        await user.refresh()
    } catch (error) {
        showCheckModal('Errore', "I dati non sono stati aggiornati! Contattare l'assistenza col seguente errore: " + error);
    }
    getUserData();
}

onMounted(async () => {
    getUserData();
    getReservations();
});

async function getReservations(){
    pastReservation.value = (await axios.get(`http://localhost:3001/reservations/user/${id.value}/past`)).data;
    futureReservation.value = (await axios.get(`http://localhost:3001/reservations/user/${id.value}/future`)).data;
}


const formatDate = (date: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
};

function goToNotifications() {
    router.push('/notify');
}

watch(() => route.params.userId, (newId) => {
    id.value = Array.isArray(newId) ? newId[0] : newId;
    isCurrentUser.value = userCurrentId.value === id.value;
    getUserData();
    getReservations();
});

async function goToMovie(ticket: Ticket) {
    const response = await axios.get(`http://localhost:3001/movies/movie/${ticket.screening._doc.movie}`);
    if (response.data) {
        router.push({ path: `/movie`, query: { id: ticket.screening._doc.movie } });
    } else {
        showCheckModal('Spiecenti', "Purtroppo il film non è più presente nella piattaforma!");
    }
}

const idToDelete = ref('');

function openDeleteModal(id: string) {
    confirmDelete.value = true;
    showCheckModal('Conferma', "Sei sicuro di voler eliminare la prenotazione?");
    idToDelete.value = id;
}

function deleteBooking() {
    axios.delete(`http://localhost:3001/reservations/${idToDelete.value}`)
        .then(() => {
            showCheckModal('Conferma', "La prenotazione è stata eliminata con successo!");
            getReservations();
        })
        .catch(() => {
            showCheckModal('Errore', "La prenotazione non è stata eliminata! Contattare l'assistenza");
        })
        .finally(() => {
            confirmDelete.value = false;
            idToDelete.value = '';
        });
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
                <p v-if="!user.isAdmin" class="text-gray-600">
                    Interessi: <span v-for="(interest, index) in interests" :key="index">{{ interest.name + " "
                        }}</span>
                </p>
            </div>
            <div v-if="isCurrentUser" class="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                <SimpleButton content="Modifica informazioni" color="primary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" :handle-click="openModalProfile" />

                <SimpleButton content="Modifica password" color="primary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" :handle-click="openModalPassword" />


                <SimpleButton content="Vedi Notifiche" color="secondary" :outlineOnly="false" :rounded="true"
                    size="small" bold :disabled="false" :handle-click="goToNotifications" />
            </div>
        </div>

        <div v-if="!user.isAdmin || (user.isAdmin && !isCurrentUser)" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section v-if="isCurrentUser" class="bg-gray-100 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">I tuoi biglietti</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th id="film" class="border-b p-2">Film</th>
                                <th id="time" class="border-b p-2">Orario</th>
                                <th id="cinema" class="border-b p-2">Cinema</th>
                                <th id="hall" class="border-b p-2">Sala</th>
                                <th id="seat" class="border-b p-2">Posto</th>
                                <th id="actions" class="border-b p-2">Azioni</th>
                            </tr>
                        </thead>
                        <tbody v-if="Object.keys(futureReservation).length !== 0">
                            <tr v-for="ticket in futureReservation" :key="ticket._id">
                                <td headers="film" class="border-b p-2">{{ ticket.screening._doc.movie.title }}</td>
                                <td headers="time" class="border-b p-2">{{
                                    formatDate(ticket.screening._doc.screeningDate)
                                }}</td>
                                <td headers="cinema" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.cinema }}
                                </td>
                                <td headers="hall" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.name }}</td>
                                <td headers="seat" class="border-b p-2">{{ ticket.seats.join(', ') }}</td>
                                <td headers="actions" class="border-b p-2">
                                    <SimpleButton title="Elimina prenotazione" color="red" rounding="full"
                                        :handle-click="() => openDeleteModal(ticket._id)" size="small"
                                        class="aspect-square m-1">
                                        <TrashIcon class="w-4 h-4 cursor-pointer" />
                                    </SimpleButton>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td headers="film time cinema action" class="border-b p-2 text-center" colspan="5">
                                    Nessuna
                                    prenotazione futura</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section :class="{ 'col-span-2': !isCurrentUser, 'col-span-1': isCurrentUser }"
                class="bg-gray-100 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Ultimi film visti</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th id="film" class="border-b p-2">Film</th>
                                <th id="time" class="border-b p-2">Orario</th>
                                <th id="cinema" class="border-b p-2">Cinema</th>
                                <th v-if="isCurrentUser" id="action" class="border-b p-2">Recensione</th>
                            </tr>
                        </thead>
                        <tbody v-if="Object.keys(pastReservation).length !== 0">
                            <tr v-for="ticket in pastReservation" :key="ticket._id">
                                <td headers="film" class="border-b p-2">{{ ticket.screening._doc.movieTitle }}</td>
                                <td headers="time" class="border-b p-2">{{
                                    formatDate(ticket.screening._doc.screeningDate)
                                }}</td>
                                <td headers="cinema" class="border-b p-2">{{ ticket.screening._doc.cinemaHall.cinema }}
                                </td>
                                <td v-if="isCurrentUser" headers="action" class="border-b p-2">
                                    <SimpleButton :content="user.isAdmin ? 'Controlla Recensioni' : 'Recensisci'"
                                        color="green" :outlineOnly="false" :rounded="true" size="small" bold
                                        :disabled="false" :handle-click="() => goToMovie(ticket)" />
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td headers="film time cinema action" class="border-b p-2 text-center" colspan="4">
                                    Nessun
                                    film visto in passato</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
    <Modal v-if="isModalVisibleProfile" title="Modifica Profilo" :name="name" :surname="surname" :interests="interests"
        @closeModal="closeModalProfile" @submitForm="handleFormSubmit" />
    <PasswordModal v-if="isModalVisiblePassword" title="Modifica Password" :id="id" @closeModal="closeModalPassword"
        @submitForm="handleFormSubmit" />
    <ModalOk v-if="showModal" :confirm="confirmDelete" :title="modalTitle" :message="modalMessage" @closeModal="closeModal" @confirm="deleteBooking" />
</template>
