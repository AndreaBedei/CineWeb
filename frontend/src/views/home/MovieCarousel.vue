<script setup lang="ts">
import { onMounted, onUpdated, ref, useTemplateRef, type Ref } from 'vue';
import MovieCard from './MovieCard.vue';
import axios from 'axios';

// Props accettate dal componente
const props = defineProps({
    title: String,
    movies: Array<{ _id: string, title: string, poster: string, rating?: number }>
});

const container = useTemplateRef("carouselRef")
const cards = useTemplateRef("cards")
const currentCardIndex = ref(0)
const observer: Ref<IntersectionObserver | null> = ref(null)
const showLeftButton = ref(false)
const showRightButton = ref(false)

onMounted(() => {
    const options = {
        root: container.value,
        rootMargin: "0px",
        threshold: 1.0,
    }

    observer.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const parent = entry.target.parentNode;

            if (entry.intersectionRatio == 1) {
                if (parent!.firstElementChild === entry.target) {
                    showLeftButton.value = false
                } else {
                    showRightButton.value = false
                }
            } else {
                if (parent!.firstElementChild === entry.target) {
                    showLeftButton.value = true
                } else {
                    showRightButton.value = true
                    // TODO: set currentCardIndex to the first card that is completely visible
                }
            }
        })
    }, options)

    if (cards.value!.length > 0) {
        observer.value.observe(cards.value![0]!.$el);
        observer.value.observe(cards.value![cards.value!.length - 1]!.$el);
    }

    props.movies!.forEach((movie) => {
        axios.get('http://localhost:3001/reviews/average-rating/'+movie._id).then((response) => {
            movie.rating = response.data.averageRating
        });
    })
})

onUpdated(() => {
    observer.value!.disconnect()
    if (cards.value!.length > 0) {
        observer.value!.observe(cards.value![0]!.$el);
        observer.value!.observe(cards.value![cards.value!.length - 1]!.$el);
    }
})

// Funzione per spostarsi nel carosello (opzionale)
function scroll(direction: 'left' | 'right', event?: Event) {
    if (event) {
        event.preventDefault(); // Blocca il comportamento predefinito
    }

    if (direction == 'left') {
        currentCardIndex.value = Math.max(0, currentCardIndex.value - 1);
    } else {
        currentCardIndex.value = Math.min(currentCardIndex.value + 1, cards.value!.length - 1);
    }

    cards.value![currentCardIndex.value]?.$el.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
    });
}

</script>

<template>
    <section class="mb-8">
        <header>
            <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
        </header>
        <div class="relative group">
            <div class="flex overflow-x-auto gap-1 no-scrollbar scroll-smooth" ref="carouselRef">
                <MovieCard v-for="(movie, index) in props.movies" ref="cards" :key="index" :image="movie.poster"
                    :title="movie.title" :rating="movie.rating?.toString()" :movieid="movie._id" />
            </div>
            <button v-if="showLeftButton"
                type="button"
                class="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
                aria-label="Precedente" @click.prevent="scroll('left')">
                ‹
            </button>
            <button v-if="showRightButton"
                type="button"
                class="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
                aria-label="Successivo" @click.prevent="scroll('right')">
                ›
            </button>
        </div>
    </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
