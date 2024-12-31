<script lang="ts" setup>
import { ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import axios from 'axios';
import ErrorAlert from "@/components/ErrorAlert.vue";
import { useUserStore } from '@/stores/user';
import SimpleButton from '@/components/SimpleButton.vue';

const props = defineProps<{
    title: string;
    name: string;
    surname: string;
    interests: { _id: string; name: string }[];
}>();

const newName = ref(props.name);
const newSurname = ref(props.surname);
const msgUser = ref('');
const selectedFile = ref<File | null>(null);
const selectedInterests = ref<{ _id: string; name: string }[]>(props.interests.map((interest) => ({ _id: interest._id, name: interest.name })));
const availableInterests = ref<{ _id: string; name: string }[]>([]);
const user = useUserStore();

const emit = defineEmits(['closeModal', 'submitForm']);


async function getInterests() {
    try {
        const response = await axios.get(`http://localhost:3001/genres/`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

getInterests().then((data) => {
    if (data) {
        availableInterests.value = data.map((interest: { _id: string; name: string }) => ({ _id: interest._id, name: interest.name }));
    }
});
const newInterest = ref();
const maxInterests = 5;

function addInterest() {
    if (newInterest.value && selectedInterests.value.length < maxInterests) {
        selectedInterests.value.push(newInterest.value);
        newInterest.value = '';
    }
}

function removeInterest(index: number) {
    selectedInterests.value.splice(index, 1);
}

function handleSubmit() {
    if (selectedFile.value) {
        const form = ref({
            name: newName.value,
            surname: newSurname.value,
            favoriteGenres: JSON.stringify(selectedInterests.value.map((interest) => interest._id)),
            profilePicture: ''
        });
        uploadImage().then(async (data) => {
            form.value.profilePicture = data;
            emit('submitForm', form);
            emit('closeModal');
        });
    } else {
        const form = ref({
            name: newName.value,
            surname: newSurname.value,
            favoriteGenres: JSON.stringify(selectedInterests.value.map((interest) => interest._id)),
        });
        emit('submitForm', form);
        emit('closeModal');
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    } else {
        selectedFile.value = null;
    }
}

// Carica il file al server
async function uploadImage() {

    // Creazione del FormData
    const formData = new FormData();
    if (selectedFile.value) {
        formData.append('image', selectedFile.value);
    }

    try {
        const response = await fetch('http://localhost:3001/image/uploadprofile', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            return data.imagePath; // Restituisce i dati dalla risposta se necessario
        } else {
            const error = await response.text();
            console.error('Errore dal server:', error);
        }
    } catch (error) {
        console.error('Errore durante il caricamento:', error);
    }
}
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6" role="document">
            <h4 id="modal-title" class="text-lg font-semibold text-primary-dark mb-4">
                {{ props.title }}
            </h4>

            <ErrorAlert v-if="msgUser" :message="msgUser" @clear="msgUser = ''" />

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <BaseInput id="nome" label="Nome*" v-model="newName" require />

                <BaseInput id="cognome" label="Cognome*" v-model="newSurname" require />

                <div class="mb-4">
                    <label for="immagine" class="block text-primary-dark font-semibold mb-2">
                        Immagine profilo
                    </label>
                    <input id="immagine" type="file" accept="image/*" @change="handleFileChange"
                        class="w-full p-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary" />
                </div>


                <section v-if="!user.isAdmin">
                    <p class="block text-primary-dark font-semibold mb-2">
                        I tuoi interessi (max {{ maxInterests }})
                    </p>

                    <div class="space-y-2" role="list" aria-label="Lista degli interessi selezionati">
                        <div v-for="(interest, index) in selectedInterests" :key="index"
                            class="flex items-center justify-between bg-primary-light text-primary-dark p-2 rounded-lg"
                            role="listitem">
                            <span>{{ interest.name }}</span>
                            <button type="button" @click="removeInterest(index)"
                                class="text-red-500 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                aria-label="Rimuovi interesse {{ interest.name }}">
                                ✕
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2 mt-4">
                        <label for="newInterest" class="sr-only">Seleziona un interesse</label>
                        <select id="newInterest" v-model="newInterest"
                            class="w-full p-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary"
                            aria-describedby="interest-help">
                            <option value="" disabled>Seleziona un interesse</option>
                            <option v-for="interest in availableInterests" :key="interest._id" :value="interest"
                                :disabled="selectedInterests.some(selected => selected._id === interest._id)">
                                {{ interest.name }}
                            </option>
                        </select>

                        <SimpleButton :handle-click="addInterest" color="primary" size="regular" rounding="small"
                            content="Aggiungi" :disabled="!newInterest || selectedInterests.length >= maxInterests" aria-describedby="interest-help"/>
                    </div>

                    <p id="interest-help" class="text-sm text-neutral-dark mt-2">
                        Puoi aggiungere fino a {{ maxInterests }} interessi. Al momento ne hai
                        {{ selectedInterests.length }}.
                    </p>
                </section>

                <div class="flex justify-end space-x-2">
                    <SimpleButton :handle-click="() => emit('closeModal')" color="secondary" size="small" rounding="small"
                        content="Annulla" />

                    <SimpleButton color="green" type="submit" size="small" rounding="small" content="Salva" />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
body.modal-open {
    overflow: hidden;
}
</style>