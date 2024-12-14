<script setup lang="ts">
import { ref, type Ref } from 'vue';


const props = withDefaults(
    defineProps<{
        rows: number
        cols: number
        interactive?: boolean
    }>(),
    {
        interactive: true
    }
)

type Spot = { row: number, col: number }

const emit = defineEmits<{
    (e: 'selectedSpots', selectedSpots: Spot[]): void
}>()

const selectedSpotsIds: Ref<Map<string, Spot>> = ref(new Map())

function toggleSelection(row: number, col: number) {
    const key = `${row}-${col}`
    if (selectedSpotsIds.value.has(key)) {
        selectedSpotsIds.value.delete(key)
    } else {
        selectedSpotsIds.value.set(key, { row: row, col: col })
    }
    emit('selectedSpots', [...selectedSpotsIds.value.values()])
}

function colors(isSelected: boolean) {
    if (isSelected) {
        return props.interactive ? 'bg-lime-400 hover:bg-lime-600' : 'bg-lime-400'
    } else {
        return props.interactive ? 'bg-white hover:bg-gray-300' : 'bg-white'
    }
}
</script>

<template>
    <div class="flex justify-center bg-slate-400 rounded-lg px-2 lg:px-14 py-2 lg:py-4">
        <div class="flex-grow flex flex-col gap-1 md:gap-2 rounded-md min-w-[50%] overflow-y-scroll">
            <div class="min-h-3 h-3 rounded-full bg-white mx-10 mb-4"></div>
            <div v-for="row in Array.from(Array(rows).keys())" v-bind:key="row" class="flex flex-shrink-0 overflow-x-scroll w-full gap-1 md:gap-2 pb-2 last:pb-0 md:pb-0">
                <button v-for="col in Array.from(Array(cols).keys())" v-bind:key="`${row}-${col}`" :disabled="!interactive" @click="toggleSelection(Number(row), col)"
                    class="rounded-md aspect-[0.66] min-w-8 md:min-w-4 max-w-10 min-h-10 max-h-full text-gray-800"
                    :class="[colors(selectedSpotsIds.has(`${row}-${col}`)), {'ms-auto' : col == 0}, {'me-auto' : col == cols - 1}]" :title="'Riga ' + (Number(row) + 1) + ', colonna ' + (col + 1)">{{ col }}</button>
            </div>
        </div>
    </div>
    <!-- <div class="flex m-auto justify-center">
        <div class="grid grid-flow-col gap-2 px-14 py-2 rounded-lg bg-slate-400">
            <button
                v-for="pos in Object.entries(rows).flatMap(row => Array.from(Array(row[1]).keys()).map(col => ({ row: Number(row[0]), col: col })))"
                v-bind:key="`${pos.row}-${pos.col}`" :disabled="!interactive" @click="toggleSelection(pos.row, pos.col)"
                class="rounded-md h-10"
                :style="{ 'grid-row': (pos.row + 1), 'grid-column-start': getRowStart(pos.col + 1, rows[pos.row]), 'grid-column-end': getRowEnd(pos.col + 1, rows[pos.row]) }"
                :class="colors(selectedSpotsIds.has(`${pos.row}-${pos.col}`))"
                :title="'Row ' + (pos.row + 1) + ', column ' + (pos.col + 1)"></button>
        </div>
    </div> -->
</template>
