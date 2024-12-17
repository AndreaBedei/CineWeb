<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios"; // Per simulare il fetch dei dati
import { useRouter } from 'vue-router';

// Props
const props = defineProps<{ placeholder?: string }>();

// Stato della ricerca e dei risultati
const searchTerm = ref("");
const searchResults = ref<{ id: string; name: string; trailerLink: string; genres: string[] }[]>([]);

// Navigazione con tastiera
const activeIndex = ref(-1); // Elemento attualmente selezionato con le frecce

// Simulazione di un fetch API per ottenere i film
async function fetchMovies(query: string) {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3001/movies/search/${query}`
    );
    console.log("Risultati della ricerca:", response.data);
    searchResults.value = response.data;
  } catch (error) {
    console.error("Errore nella ricerca dei film:", error);
    searchResults.value = [];
  }
}

// Funzione chiamata quando l'utente preme un tasto
function handleKeydown(event: KeyboardEvent) {
  const resultsCount = searchResults.value.length;

  switch (event.key) {
    case "ArrowDown":
      activeIndex.value = (activeIndex.value + 1) % resultsCount;
      break;
    case "ArrowUp":
      activeIndex.value =
        (activeIndex.value - 1 + resultsCount) % resultsCount;
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
function selectMovie(movie: { id: string; name: string }) {
  searchTerm.value = movie.name;
  searchResults.value = []; // Chiude la tendina
  const router = useRouter();
  router.push({ name: 'movie', params: { id: movie.id } });
}

function handleBlur() {
  window.setTimeout(() => {
    searchResults.value = [];
  }, 200);
}


// Guarda il termine di ricerca e fetcha i film
watch(searchTerm, (newTerm) => {
  fetchMovies(newTerm);
});
</script>

<template>
  <div class="relative w-full max-w-md">
    <!-- Input di ricerca -->
    <input type="search" :placeholder="props.placeholder || 'Cerca un film...'" v-model="searchTerm"
      @keydown="handleKeydown" @blur="handleBlur"
      class="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:outline-none text-gray-500"
      role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-autocomplete="list" />

    <!-- Tendina con i risultati -->
    <ul v-if="searchResults.length > 0"
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto"
      role="listbox">
      <li v-for="(movie, index) in searchResults" :key="movie.id" @click="selectMovie(movie)" @mousedown.prevent :class="[
        'flex items-center gap-4 px-4 py-2 cursor-pointer',
        activeIndex === index
          ? 'bg-primary-light'
          : 'hover:bg-gray-200',
      ]" role="option" :aria-selected="activeIndex === index">
        <!-- Immagine del poster -->
        <img :src="movie.trailerLink" :alt="`Poster di ${movie.name}`" class="w-12 h-16 rounded-md object-cover" />
        <!-- Dettagli del film -->
        <div class="flex flex-col">
          <span class="font-semibold">{{ movie.name }}</span>
          <span class="text-sm text-gray-500">{{ movie.genres.join(', ') }}</span>
        </div>
      </li>
    </ul>

    <!-- Nessun risultato -->
    <ul v-else class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1" role="listbox">
      <li class="px-4 py-2 text-gray-500">Nessun risultato</li>
    </ul>
  </div>
</template>
