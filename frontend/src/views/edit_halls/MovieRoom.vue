<script setup lang="ts">
import { ref, type Ref } from 'vue';

const props = withDefaults(
    defineProps<{
        rows: number,
        cols: number,
        interactive?: boolean
        occupied?: { row: number, col: number }[]
    }>(),
    {
        interactive: true
    }
)

export type Spot = { row: number, col: number }

const emit = defineEmits<{
    (e: 'selectedSpots', selectedSpots: Spot[]): void
}>()

const selectedSpotsIds: Ref<Map<string, Spot>> = ref(new Map())

function isSpotOccupied(row: number, col: number) {
    return props.occupied?.find(o => o.row === row && o.col === col) != undefined;
}

function toggleSelection(row: number, col: number) {
    const key = `${row}-${col}`
    if (selectedSpotsIds.value.has(key)) {
        selectedSpotsIds.value.delete(key)
    } else {
        selectedSpotsIds.value.set(key, { row: row, col: col })
    }
    emit('selectedSpots', [...selectedSpotsIds.value.values()])
}

function colors(isSelected: boolean, isOccupied: boolean) {
    if (isOccupied) {
        return props.interactive ? 'bg-red-500 hover:bg-red-700' : 'bg-red-500'
    }
    else if (isSelected) {
        return props.interactive ? 'bg-lime-400 hover:bg-lime-600' : 'bg-lime-400'
    } else {
        return props.interactive ? 'bg-white hover:bg-gray-300' : 'bg-white'
    }
}
</script>

<template>
    <div class="flex justify-center bg-slate-400 rounded-lg px-2 lg:px-14 py-2 lg:py-4">
        <div class="flex-grow flex flex-col gap-1 md:gap-2 rounded-md min-w-[50%] overflow-y-auto overflow-x-auto max-h-[90vh]"
            role="grid" aria-label="Tabella dei posti">
            <div v-for="row in Array.from(Array(rows).keys())" :key="row"
                class="flex flex-shrink-0 gap-1 md:gap-2 pb-2 last:pb-0 md:pb-0" role="row">
                <div v-for="col in Array.from(Array(cols).keys())" :key="`${row}-${col}`"
                    class="rounded-md aspect-[0.66] min-w-8 max-w-10 min-h-10 max-h-full text-gray-800"
                    :class="[colors(selectedSpotsIds.has(`${row}-${col}`), isSpotOccupied(row, col)), { 'ms-auto': col == 0 }, { 'me-auto': col == cols - 1 }]"
                    :aria-selected="selectedSpotsIds.has(`${row}-${col}`)"
                    role="gridcell">
                    <button :disabled="!interactive || isSpotOccupied(row, col)"
                        @click="toggleSelection(Number(row), col)"
                        class="text-center w-full h-full"
                        :title="'Riga ' + Number(row + 1) + ', colonna ' + (col + 1)"
                        :aria-disabled="!interactive || isSpotOccupied(row, col)"
                        type="button"
                        :aria-label="'Riga ' + Number(row + 1) + ', colonna ' + (col + 1)">
                        {{ col + 1 }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
