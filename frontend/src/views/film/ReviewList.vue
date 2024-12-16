<script setup lang="ts">
const props = defineProps<{
  reviews: {
    _id: number;
    user: {
      name: string;
      profilePicture: string;
      surname: string;
    };
    rating: number;
    text: string;
    reviewDate: string;
  }[];
}>();
</script>

<template>
  <section class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <header>
      <h2 class="text-3xl font-bold text-primary-dark border-b pb-2 mb-4">Recensioni</h2>
    </header>
    <section v-if="Object.keys(props.reviews).length === 0">
      <p class="text-lg text-gray-700 font-medium">
        Non ci sono recensioni disponibili per questo film
      </p>
    </section>

    <section v-else>
      <ul class="divide-y divide-gray-300">
        <li v-for="review in props.reviews" :key="review._id" class="py-4 flex gap-4">
          <img :src="`http://localhost:3001/img/profile/${review.user.profilePicture}`" alt="Immagine utente"
            class="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 class="font-semibold">{{ review.user.name }} {{ review.user.surname }}</h3>
            <p class="text-sm text-gray-500">Voto: {{ review.rating }}</p>
            <p>{{ review.text }}</p>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>
