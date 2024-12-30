<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

const props = defineProps<{
    inputs: {
        id: string,
        label: string,
        inputType?: InputTypeHTMLAttribute,
        value: string,
        required?: boolean,
        placeholder?: string,
        inputSize?: "fit" | "max",
        range?: { min?: number, max?: number, step?: number }
    }[]
}>()

const emit = defineEmits<{
    (e: 'update:value', inputIdx: number, value: string): void
}>()

function updateValue(index: number, value: string) {
    const input = props.inputs[index]
    if (input.inputType != "number") {
        emit('update:value', index, value)
    } else {
        let val = Number(value)
        val = Math.max(input.range?.min ?? -Infinity, Math.min(input.range?.max ?? Infinity, val))

        emit('update:value', index, val + "")
    }

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
    return input.inputSize ?? "max"
}
</script>

<template>
    <div class="inline-grid grid-template gap-x-3 gap-y-2 md:gap-x-8 grid-flow-col text-nowrap w-full items-center">
        <label v-for="input in inputs" v-bind:key="input.id" :for="input.id" class="block text-primary-dark font-semibold">
            {{ input.label }}
        </label>
        <input v-for="(input, n) in inputs" v-bind:key="input.id" :id="input.id" :type="getInputType(input)" :value="input.value" @input="updateValue(n, ($event.target as HTMLInputElement).value)" :placeholder="getInputPlaceholder(input)"
            class="border border-slate-300 focus:ring-2 focus:ring-primary col-start-2 col-end-2 min-w-0"
            :class="getInputSize(input) == 'fit' ? 'h-fit p-1 rounded-md' : 'p-3 rounded-lg'"
            :required="getInputRequired(input)"
            :min="input.inputType == 'number' ? input.range?.min : undefined"
            :max="input.inputType == 'number' ? input.range?.max : undefined"
            :step="input.inputType == 'number' ? input.range?.step : undefined"/>
    </div>
</template>


<style lang="css" scoped>
.grid-template {
    grid-template-columns: min-content auto;
}
</style>
