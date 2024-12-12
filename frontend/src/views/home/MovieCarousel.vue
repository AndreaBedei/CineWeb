<script setup lang="ts">
import { onMounted, onUpdated, ref, useTemplateRef, type Ref } from 'vue';
import MovieCard from './MovieCard.vue';

// Props accettate dal componente
const props = defineProps({
    title: String,
    movies: Array
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
})

onUpdated(() => {
    observer.value!.disconnect()
    if (cards.value!.length > 0) {
        observer.value!.observe(cards.value![0]!.$el);
        observer.value!.observe(cards.value![cards.value!.length - 1]!.$el);
    }
})

// Funzione per spostarsi nel carosello (opzionale)
function scroll(direction: 'left' | 'right') {
    if (direction == "left") {
        currentCardIndex.value = Math.max(0, currentCardIndex.value - 1)
    } else {
        currentCardIndex.value = Math.min(currentCardIndex.value + 1, cards.value!.length - 1)
    }

    cards.value![currentCardIndex.value]?.$el.scrollIntoView({ behavior: 'smooth', inline: "start", block: "end" });
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
                    :title="movie.title" :rating="0" />
            </div>
            <button v-if="showLeftButton"
                class="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
                aria-label="Precedente" @click="scroll('left')">
                ‹
            </button>
            <button v-if="showRightButton"
                class="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
                aria-label="Successivo" @click="scroll('right')">
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
