<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

const props = withDefaults(
    defineProps<{
        id: string,
        label: string,
        type?: InputTypeHTMLAttribute,
        modelValue: string | Date,
        require?: boolean,
        read?: boolean,
        placeholder?: string,
        inputSize?: "fit" | "max",
        layout?: "row" | "column",
        range?: { min: number, max: number, step: number }
        

    }>(),
    {
        type: "text",
        require: false,
        placeholder: "",
        inputSize: "max",
        layout: "column"
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

function updateValue(value: string) {
    emit('update:modelValue', value);
}
</script>

<template>
    <div class="flex flex-grow gap-2" :class="layout == 'column' ? 'flex-col' : 'items-center'">
        <label :for="id" class="block text-primary-dark font-semibold">
            {{ label }}
        </label>
        <input :id="id" :type="type" :value="modelValue" @input="updateValue(($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            :class="[inputSize == 'fit' ? 'h-fit p-1 rounded-md' : 'p-3 rounded-lg', props.read ? 'bg-gray-200' : '']"
            class="w-full border border-slate-300 focus:ring-2 focus:ring-primary" :required="props.require"
            :min="type == 'number' ? range?.min : undefined"
            :max="type == 'number' ? range?.max : undefined"
            :step="type == 'number' ? range?.step : undefined"
            :readonly="props.read"
        />
    </div>
</template>

<style scoped></style>
