import MovieRoom from '@/views/add_movie_room/MovieRoom.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
    title: 'Components/MovieRoom',
    component: MovieRoom,
    tags: ['autodocs'],
    args: {
        rows: 5,
        cols: 20
    },
} satisfies Meta<typeof MovieRoom>

export default meta
type Story = StoryObj<typeof meta>

export const InteractiveView: Story = {
    args: {
        interactive: true
    },
}

export const StaticView: Story = {
    args: {
        interactive: false
    },
}
