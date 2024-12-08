import type { Meta, StoryObj } from '@storybook/vue3'

import SimpleButton from '@/components/SimpleButton.vue'

const meta = {
    title: 'Components/SimpleButton',
    component: SimpleButton,
    tags: ['autodocs'],
    argTypes: {
        color: {
            options: ["red", "green", "primary", "secondary"]
        },
        size: {
            options: ["small", "regular"]
        }
    },
    args: {
        size: "regular",
        outlineOnly: true,
        rounded: true,
        disabled: false,
        bold: false
    }
} satisfies Meta<typeof SimpleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        content: "Bottone",
        color: "red"
    },
}

export const PrimaryDisabled: Story = {
    args: {
        content: "Bottone",
        color: "red",
        disabled: true
    },
}

export const Secondary: Story = {
    args: {
        content: "Bottone",
        outlineOnly: false,
        color: "red"
    },
}

export const SecondaryDisabled: Story = {
    args: {
        content: "Bottone",
        outlineOnly: false,
        color: "red",
        disabled: true
    },
}
