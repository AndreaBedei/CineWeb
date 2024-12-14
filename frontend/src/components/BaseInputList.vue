<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

// defineProps({
//   id: { type: String, required: true },
//   label: { type: String, required: true },
//   type: { type: String, default: 'text' },
//   modelValue: { type: [String, Date], required: true },
//   require: { type: Boolean, default: false },
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
    defineProps<{
        layout?: "row" | "column",
        inputs: {
            id: string,
            label: string,
            inputType?: InputTypeHTMLAttribute,
            value: string,
            required?: boolean,
            placeholder?: string,
            inputSize?: "fit" | "max",
            range?: { min: number, max: number, step: number }
        }[]
    }>(),
    {
        layout: "column"
    }
)

const emit = defineEmits<{
    (e: 'update:value', value: string): void
}>()

function updateValue(value: string) {
    emit('update:value', value);
}

function getInputType(input: typeof props.inputs[0]) {
    return input.inputType ?? "text"
}

function getInputRequired(input: typeof props.inputs[0]) {
    return input.required ?? false
}

function getInputPlaceholder(input: typeof props.inputs[0]) {
    return input.placeholder ?? ""
}

function getInputSize(input: typeof props.inputs[0]) {
    return input.inputSize?? "max"
}

// FIXME: label e input a gruppi di 2 (forse è meglio fare una tabella)
</script>

<template>
    <div class="grid gap-2" :class="layout == 'column' ? 'grid-cols-2 grid-flow-row' : 'grid-rows-2 grid-flow-col'">
        <label v-for="input in inputs" v-bind:key="input.id" :for="input.id" class="block text-primary-dark font-semibold">
            {{ input.label }}
        </label>
        <input v-for="input in inputs" v-bind:key="input.id" :id="input.id" :type="getInputType(input)" :value="input.value" @input="updateValue(($event.target as HTMLInputElement).value)" :placeholder="getInputPlaceholder(input)"
            :class="getInputSize(input) == 'fit' ? 'h-fit p-1 rounded-md' : 'p-3 rounded-lg'"
            class="w-full border border-slate-300 focus:ring-2 focus:ring-primary" :required="getInputRequired(input)"
            :min="input.inputType == 'number' ? input.range?.min : undefined"
            :max="input.inputType == 'number' ? input.range?.max : undefined"
            :step="input.inputType == 'number' ? input.range?.step : undefined"/>
    </div>
</template>

<style scoped></style>
