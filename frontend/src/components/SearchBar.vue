<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';

// Props
const props = defineProps<{ placeholder?: string }>();
const router = useRouter();

// Stato della ricerca e dei risultati
const searchTerm = ref("");
const searchResults = ref<{ _id: string; title: string; poster: string; genres: Array<{ _id: string; name: string }> }[]>([]);

// Navigazione con tastiera
const activeIndex = ref(-1);

// Riferimento al contenitore della barra di ricerca
const searchContainer = ref<HTMLDivElement | null>(null);

// Simulazione di un fetch API per ottenere i film
async function fetchMovies(query: string) {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await axios.get(`http://localhost:3001/movies/search/${query}`);
    searchResults.value = response.data;
  } catch (error) {
    console.error("Errore nella ricerca dei film:", error);
    searchResults.value = [];
  }
}

// Gestione dei tasti nella barra di ricerca
function handleKeydown(event: KeyboardEvent) {
  const resultsCount = searchResults.value.length;

  switch (event.key) {
    case "ArrowDown":
      activeIndex.value = (activeIndex.value + 1) % resultsCount;
      break;
    case "ArrowUp":
      activeIndex.value = (activeIndex.value - 1 + resultsCount) % resultsCount;
      break;
    case "Enter":
      if (activeIndex.value >= 0 && activeIndex.value < resultsCount) {
        selectMovie(searchResults.value[activeIndex.value]);
      }
      break;
    case "Escape":
      searchResults.value = [];
      break;
  }
}

// Funzione per selezionare un film
function selectMovie(movie: { _id: string; title: string }) {
  searchTerm.value = movie.title;
  searchResults.value = [];
  searchTerm.value = "";
  router.push('/movie?id='+movie._id);
}

// Chiude la tendina se clicca al di fuori del componente
function handleClickOutside(event: MouseEvent) {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    searchResults.value = [];
    searchTerm.value = "";
  }
}

// Assegna e rimuove l'evento globale
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Guarda il termine di ricerca e aggiorna i risultati
watch(searchTerm, (newTerm) => {
  fetchMovies(newTerm);
});
</script>

<template>
  <div ref="searchContainer" class="relative w-full max-w-lg mx-auto my-2">
    <!-- Input di ricerca -->
    <label for="search" class="sr-only">Cerca un film</label>
    <input id="search" type="text" :placeholder="props.placeholder || 'Cerca un film...'" v-model="searchTerm"
      @keydown="handleKeydown"
      class="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:outline-none text-gray-500"
      role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-autocomplete="list" />

    <!-- Tendina con i risultati -->
    <ul v-if="searchResults.length > 0"
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-100 overflow-y-auto"
      role="listbox">
      <li v-for="(movie, index) in searchResults" :key="movie._id" @click="selectMovie(movie)" @mousedown.prevent :class="[
        'flex items-center gap-4 px-4 py-2 cursor-pointer',
        activeIndex === index ? 'bg-primary-light' : 'hover:bg-gray-200',
      ]" role="option" :aria-selected="activeIndex === index">
        <!-- Immagine del poster -->
        <img :src="`http://localhost:3001/img/poster/${movie.poster}`" :alt="`Poster di ${movie.title}`"
          class="w-12 h-16 rounded-md object-cover" />
        <!-- Dettagli del film -->
        <div class="flex flex-col">
          <span class="text-black font-semibold">{{ movie.title }}</span>
          <span class="text-sm text-gray-500">
            {{ movie.genres.map((genre) => genre.name).join(', ') }}
          </span>
        </div>
      </li>
    </ul>

    <!-- Nessun risultato -->
    <ul v-else-if="searchTerm.trim() && searchResults.length === 0"
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1" role="listbox">
      <li class="px-4 py-2 text-gray-500">Nessun risultato</li>
    </ul>
  </div>
</template>
