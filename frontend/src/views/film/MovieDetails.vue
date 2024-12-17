<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import SimpleButton from "@/components/SimpleButton.vue";
import { useUserStore } from "../stores/user";
import ModifyMovieModal from "../home/AddMovieModal.vue";
import PageModal from "@/components/PageModal.vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

interface MovieDetails {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Language: string;
  Plot: string;
  Ratings: { Source: string; Value: string }[];
}

const updateOk = ref(false);
const movieDetails = ref<MovieDetails | null>(null);
const isLoading = ref(true); // Variabile per tracciare lo stato del caricamento
const modalFilm = ref(false);
const genres = ref<{ _id: string; name: string }[]>(props.movie.genres);
const title = ref(props.movie.title);
const poster = ref(props.movie.poster);
const trailerLink = ref(props.movie.trailerLink);
const duration = ref(props.movie.duration);
const user = useUserStore();

onMounted(() => {
  fetchMovieDetails(props.movie.title);
});

async function fetchMovieDetails(title: string) {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=e2b4e2eb`
    );
    const translate = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=it&dt=t&q=${encodeURIComponent(
        response.data.Plot
      )}`
    );
    movieDetails.value = response.data;
    if (movieDetails.value) {
      movieDetails.value.Plot = translate.data[0][0][0];
    }
  } catch (error) {
    console.error("Errore nel recupero dei dettagli del film:", error);
  } finally {
    isLoading.value = false; // Imposta a false quando il caricamento è completato
  }
}

function openModalModifyMovie() {
  modalFilm.value = true;
}

function closeModal(update: boolean) {
  if (update) {
    fetchMovieDetails(props.movie.title);
  }
  modalFilm.value = false;
}

function updateValue(titleN: string, posterN: string, durationN: string, genresN: { _id: string; name: string }[], trailer: string) {
  title.value = titleN;
  poster.value = posterN;
  duration.value = durationN;
  genres.value = genresN;
  trailerLink.value = trailer;
  modalFilm.value = false;
  updateOk.value = true;
}

</script>

<template>
  <PageModal v-if="updateOk" title="Modifica completata" message="Il film è stato modificato con successo" @closeModal="updateOk = false" />
  <section v-if="isLoading" class="flex items-center justify-center min-h-screen bg-gray-100">
    <p class="text-lg text-gray-700 font-medium">Caricamento...</p>
  </section>

  <section v-else class="flex flex-col md:flex-row gap-8 items-start bg-gray-50 p-6 rounded-lg shadow-lg">
    <!-- Poster -->
    <div class="flex-shrink-0 w-48 mx-auto">
      <img :src="`http://localhost:3001/img/poster/${poster}`" alt="Copertina di {{ title }}"
        class="w-full rounded-lg shadow-md" />
    </div>

    <!-- Dettagli del film -->
    <div class="flex-1 space-y-6">
      <!-- Titolo -->
      <h1 class="text-4xl font-bold text-primary-dark border-b pb-2">
        {{ title }}
      </h1>

      <!-- Caratteristiche -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Informazioni principali -->
        <div class="space-y-2">
          <p class="text-gray-600">
            <span class="font-semibold">Anno:</span> {{ movieDetails?.Year }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Durata:</span> {{ duration }} minuti
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Genere:</span>
            <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 mx-1 rounded-lg"
              v-for="genre in genres" :key="genre._id">
              {{ genre.name }}
            </span>
          </p>
        </div>

        <!-- Staff e lingua -->
        <div class="space-y-2">
          <p class="text-gray-600">
            <span class="font-semibold">Regista:</span> {{ movieDetails?.Director }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Scrittore:</span> {{ movieDetails?.Writer }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Lingua:</span> {{ movieDetails?.Language }}
          </p>
        </div>
      </div>

      <!-- Trama -->
      <div>
        <h2 class="text-lg font-semibold text-primary-dark mb-2">Trama</h2>
        <p class="text-gray-700">{{ movieDetails?.Plot }}</p>
      </div>

      <!-- Valutazioni -->
      <div>
        <h2 class="text-lg font-semibold text-primary-dark mb-2">Valutazioni</h2>
        <ul class="flex flex-wrap gap-2">
          <li v-for="rating in movieDetails?.Ratings" :key="rating.Source"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
            {{ rating.Source }}: {{ rating.Value }}
          </li>
        </ul>
        <div class="flex justify-end w-full mt-4">
          <SimpleButton v-if="user.isAdmin" content="Aggiorna dati" color="primary" rounding="small" :handle-click="openModalModifyMovie" />
        </div>
      </div>
    </div>
  </section>
  <ModifyMovieModal v-if="user.isAdmin && modalFilm" :movieId="movie._id" :update="true" modal-title="Modifica film" :name="title" :poster="poster" :trailerLink="trailerLink" :duration="duration" :genresO="genres" @close="closeModal" @update="updateValue" />
</template>
