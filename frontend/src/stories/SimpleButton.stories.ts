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
        },
        rounding: {
            options: ["none", "small", "full"]
        }
    },
    args: {
        rounding: "small",
    }
} satisfies Meta<typeof SimpleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        content: "Bottone",
        color: "primary"
    },
}

export const PrimaryDisabled: Story = {
    args: {
        content: "Bottone",
        color: "primary",
        disabled: true
    },
}

export const Secondary: Story = {
    args: {
        content: "Bottone",
        outlineOnly: false,
        color: "secondary"
    },
}

export const SecondaryDisabled: Story = {
    args: {
        content: "Bottone",
        outlineOnly: false,
        color: "secondary",
        disabled: true
    },
}
