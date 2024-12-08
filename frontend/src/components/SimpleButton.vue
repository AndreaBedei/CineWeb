<script setup lang="ts">

type Colors = ["red", "green"]
type Color = Colors[number]

const palette : {[key in Color]: {col: string, disabledCol: string}} =
{
    "red": {
        col: "red-500",
        disabledCol: "red-300"
    },
    "green": {
        col: "green-500",
        disabledCol: "green-300"
    }
}

const props = withDefaults(
    defineProps<{
        content: string,
        color: Color,
        primary: boolean,
        rounded: boolean,
        disabled: boolean,
        bold: boolean
    }>(),
    {
        primary: true,
        rounded: true,
        disabled: false,
        bold: false
    }
)

function getCol() {
    return props.disabled ? palette[props.color].disabledCol : palette[props.color].col
}

function getBgCol() {
    return "bg-" + (props.primary ? getCol() : "white")
}

function getBorderCol() {
    return "border-" + getCol()
}

function getFontCol() {
    return props.primary ? 'text-white' : props.disabled ? 'text-slate-600' : 'text-black'
}
</script>

<template>
    <button :disabled="disabled" class="p-3 transition-colors border-solid border-2" :class="[{'rounded-full' : rounded}, getBgCol(), getBorderCol(), getFontCol(), {'font-bold' : bold}]">
        {{ content }}
    </button>
</template>
