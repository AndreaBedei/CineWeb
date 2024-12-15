<script setup lang="ts">
    import UploadInput from '@/components/UploadInput.vue';
    import { onMounted, ref } from 'vue';
    import BaseInput from '@/components/BaseInput.vue';
    import SimpleButton from '@/components/SimpleButton.vue';
    import ErrorAlert from "@/components/ErrorAlert.vue";
    import axios from 'axios';
import LoadingAlert from '@/components/LoadingAlert.vue';


    // Props ricevute
    const props = defineProps({
        name: {
            type: String,
            default: ''
        },
        poster: {
            type: String,
            default: ''
        },
        trailer: {
            type: String,
            default: ''
        },
        categories: {
            type: Array<string>,
            default: () => []
        },
        duration: {
            type: String,
            default: ''
        },
    });

    const name = ref(props.name);
    const trailer = ref(props.trailer);
    const duration = ref(props.duration);
    const genres = ref<{ _id: number; name: string }[]>([]);
    const selectedGenres = ref<string[]>([]);
    const image = ref("");
    const msgUser = ref("");
    const upload = ref(false);
    const check = ref(false);

    // Effettua la richiesta GET per recuperare i generi
    async function fetchGenres() {
        try {
            const response = await fetch('http://localhost:3001/genres');
            if (response.ok) {
                genres.value = await response.json();
            } else {
                console.error('Errore nel recupero dei generi.');
            }
        } catch (error) {
            console.error('Errore di connessione:', error);
        }
    }

    // Recupera i generi al montaggio del componente
    onMounted(() => {
        fetchGenres();
    });

    async function handleSubmit() {
        check.value = true;
        if (upload.value === false) {
            msgUser.value = "Devi prima caricare il poster per il film.";
            check.value = false;
            return;
        }
        const response = await axios.get(
            `http://www.omdbapi.com/?t=${encodeURIComponent(name.value)}&apikey=e2b4e2eb`
        );
        if (response.data.Response === 'False') {
            msgUser.value = "Il nome del film non è stato trovato nell'archivio di OMDB, inserire il titolo corretto.";
            check.value = false;
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/movies', {
                title: name.value,
                trailerLink: trailer.value,
                duration: duration.value.toString(),
                genres: selectedGenres.value,
                poster: image.value,
            });

            if (response.status === 201) {
                msgUser.value = "Film aggiunto con successo!";
                emit('save');
            } else {
                msgUser.value = "Errore durante l'aggiunta del film.";
            }
        } catch (error) {
            console.error('Errore di connessione:', error);
            msgUser.value = "Errore di connessione durante l'aggiunta del film.";
        }

        emit('close', true);
    }

    const emit = defineEmits(['close', 'save']);

    function handleFileUploaded(name: string) {
        image.value = name;
        upload.value = true;
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
                    Schermata aggiunta film
                </h2>
            </header>
            <ErrorAlert v-if="msgUser" :message="msgUser" @clear="msgUser = ''" />
            <LoadingAlert v-if="check" />
            <form @submit.prevent="handleSubmit">
                <!-- Nome -->
                <BaseInput id="nome-film" label="Nome del film" v-model="name" :require="true" />

                <!-- Durata -->
                <BaseInput id="durata-film" label="Durata (minuti)" type="number" v-model="duration" :require="true"
                    :range="{ min: 1, max: 500, step: 1 }" />

                <!-- Poster -->
                <UploadInput @fileUploaded="handleFileUploaded" />

                <section>
                    <BaseInput id="trailer-film" label="Trailer (Video Key)" v-model="trailer" :require="true" />
                    <p class="text-sm text-gray-500 mt-1">Esempio: v=<strong>dQw4w9WgXcQ</strong></p>
                </section>

                <!-- Categorie -->
                <section class="mb-4">
                    <h3 class="block text-primary-dark font-semibold mb-2 mt-2">Categorie</h3>
                    <div class="grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        <div v-for="genre in genres" :key="genre._id" class="flex items-center space-x-2">
                            <input type="checkbox" :id="'genre-' + genre._id" :value="genre._id"
                                v-model="selectedGenres"
                                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                            <label :for="'genre-' + genre._id" class="text-sm font-medium text-gray-700">
                                {{ genre.name }}
                            </label>
                        </div>
                    </div>
                </section>
                <!-- Bottoni -->
                <div class="flex justify-end space-x-4">
                    <SimpleButton content="Annulla" color="red" :handleClick="closeModal" rounding="small" />
                    <SimpleButton content="Salva" color="green" rounding="small" type="submit" />
                </div>
            </form>
        </div>
    </div>
</template>