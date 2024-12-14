import type { Meta, StoryObj } from '@storybook/vue3'

import BaseInputList from '@/components/BaseInputList.vue'

const meta = {
    title: 'Components/BaseInputList',
    component: BaseInputList,
    tags: ['autodocs'],
    args: {
        layout: "column",
        inputs: Array.from(Array(3).keys()).map((k) => ({
            id: "input" + k,
            label: "Input " + k,
            value: "",
            inputSize: "fit",
        }))
    },
    argTypes: {
        layout: {
            options: ["row", "column"]
        }
    },
} satisfies Meta<typeof BaseInputList>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedIn: Story = {

}

export const LoggedOut: Story = {

}
