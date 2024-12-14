import type { Meta, StoryObj } from '@storybook/vue3'

import PageHeader from '@/components/PageHeader.vue'

const meta = {
    title: 'Components/PageHeader',
    component: PageHeader,
    tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedIn: Story = {

}

export const LoggedOut: Story = {

}
