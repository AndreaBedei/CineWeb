import type { Meta, StoryObj } from '@storybook/vue3'

import InputList from '@/components/InputList.vue'

const meta = {
    title: 'Components/InputList',
    component: InputList,
    tags: ['autodocs'],
    args: {
        inputs: [
            {
                id: "input1",
                label: "Input 1",
                value: "",
                inputSize: "fit",
                inputType: "text"
            },
            {
                id: "input2",
                label: "Input 2",
                value: "",
                inputSize: "fit",
                inputType: "number",
                range: {
                    min: 0,
                    max: 10,
                    step: 1
                }
            },
            {
                id: "input3",
                label: "Input 3",
                value: "",
                inputSize: "fit",
                inputType: "date"
            },
        ]
    }
} satisfies Meta<typeof InputList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {

}

