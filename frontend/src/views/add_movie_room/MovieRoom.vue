<script setup lang="ts">
import { ref, type Ref } from 'vue';


const props = withDefaults(
    defineProps<{
        rows: number[]
        interactive?: boolean
    }>(),
    {
        interactive: true
    }
)

const selected: Ref<Set<string>> = ref(new Set())

function toggleSelection(row: number, col: number) {
    const key = `${row}-${col}`
    if (selected.value.has(key)) {
        selected.value.delete(key)
    } else {
        selected.value.add(key)
    }
}
</script>

<template>
<div v-if="interactive" class="flex flex-col" >
    <div v-for="row in Object.entries(rows)" v-bind:key="row[0]" class="flex gap-2">
        <button v-for="col in Array.from(Array(row[1]).keys())" v-bind:key="row[0] + '-' + col" :disabled="!interactive" @click="toggleSelection(Number(row), col)"></button>
    </div>
</div>
</template>
