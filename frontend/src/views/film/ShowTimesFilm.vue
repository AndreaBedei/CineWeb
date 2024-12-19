<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import AddShowTimesModal from './AddShowTimesModal.vue';
import SimpleButton from '@/components/SimpleButton.vue';

const props = defineProps({
  showtimes: {
    type: Object,
    required: true,
  },
  movie: {
    type: Object,
    required: true,
  },
});


const user = useUserStore();
const modalShowTime = ref(false);

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function isFutureDate(date: string): boolean {
  const screeningDate = new Date(date);
  const currentDate = new Date();
  return screeningDate > currentDate;
}

function closeModalAddShowTimes() {
  modalShowTime.value = false;
}

function openModalAddShowTimes() {
  modalShowTime.value = true;
}
</script>

<template>
  <section class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <header>
      <h2 class="text-3xl font-bold text-primary-dark border-b pb-2 mb-4">Orari</h2>
    </header>

    <section v-if="Object.keys(props.showtimes).length === 0">
      <p class="text-lg text-gray-700 font-medium">
        Non ci sono orari disponibili per questo film
      </p>
    </section>

    <section v-else>
      <section v-for="(screenings, cinema) in props.showtimes" :key="cinema" class="p-4">
        <header>
          <h3 class="text-2xl font-bold text-primary-dark border-b pb-2 mb-4">
            {{ cinema }}
          </h3>
        </header>

        <!-- Tabella -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-700 border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th :id="'room' + cinema" scope="col" class="py-2 px-4 font-semibold">
                  Sala
                </th>
                <th :id="'price' + cinema" scope="col" class="py-2 px-4 font-semibold">
                  Prezzo (€)
                </th>
                <th :id="'date' + cinema" scope="col" class="py-2 px-4 font-semibold">
                  Orario
                </th>
                <th :id="'action' + cinema" scope="col" class="py-2 px-4 font-semibold text-center">
                  Prenota
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="screening in screenings" :key="screening.screeningId"
                class="odd:bg-white even:bg-gray-50 hover:bg-gray-200">
                <td :headers="'room' + cinema" class="py-2 px-4">
                  {{ screening.cinemaHallName }}
                </td>
                <td :headers="'price' + cinema" class="py-2 px-4">
                  {{ screening.ticketPrice.toFixed(2) }}
                </td>
                <td :headers="'date' + cinema" class="py-2 px-4">
                  {{ formatDate(screening.screeningDate) }}
                </td>
                <td :headers="'action' + cinema" class="py-2 px-4 text-center">
                  <button v-if="isFutureDate(screening.screeningDate)"
                    class="px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:px-4 md:py-2 md:text-sm">
                    Prenota
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
    <div class="flex justify-end">
      <SimpleButton v-if="user.isAdmin" content="Aggiungi proiezione" color="primary" rounding="small" :handle-click="openModalAddShowTimes" />
    </div>
  </section>
  <AddShowTimesModal v-if="modalShowTime" :movie="movie"  @close="closeModalAddShowTimes" />
</template>