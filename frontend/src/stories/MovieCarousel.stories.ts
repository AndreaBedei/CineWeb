import type { Meta, StoryObj } from '@storybook/vue3'
import MovieCarousel from '@/views/home/MovieCarousel.vue'

const meta = {
    title: 'Components/MovieCarousel',
    component: MovieCarousel,
    tags: ['autodocs'],
    args: {
        title: "Titolo carosello"
    }
} satisfies Meta<typeof MovieCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {
    args: {
        movies: Array.from(Array(10).keys()).map(() => ({ image: "./assets/context.png", title: "Film", rating: 5 }))
    }
}
