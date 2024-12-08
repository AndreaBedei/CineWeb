<script setup lang="ts">

type Colors = ["red", "green", "primary", "secondary"]
type Color = Colors[number]

const palette : {[key in Color]: {bgCol: string, disabledBgCol: string, borderCol: string, disabledBorderCol: string}} =
{
    /*
        "col": {
            full: {
                enabled: {
                    bg: string,
                    border: string,
                    font: string,
                },
                disabled: {
                    bg: string,
                    border: string,
                    font: string,
                }
            },
            outline: {
                enabled: {
                    bg: string,
                    border: string,
                    font: string,
                },
                disabled: {
                    bg: string,
                    border: string,
                    font: string,
                }
            }
        }
    */
    "red": {
        bgCol: "bg-red-500",
        disabledBgCol: "bg-red-300",
        borderCol: "border-red-500",
        disabledBorderCol: "border-red-300"
    },
    "green": {
        bgCol: "bg-green-500",
        disabledBgCol: "bg-green-300",
        borderCol: "border-green-500",
        disabledBorderCol: "border-green-300"
    },
    "primary": {
        bgCol: "bg-primary",
        disabledBgCol: "bg-primary-medium",
        borderCol: "border-primary",
        disabledBorderCol: "border-primary-medium"
    },
    "secondary": {
        bgCol: "bg-secondary",
        disabledBgCol: "bg-secondary-light",
        borderCol: "border-secondary",
        disabledBorderCol: "border-secondary-light"
    }
}

const props = withDefaults(
    defineProps<{
        content: string,
        color: Color,
        size: "small" | "regular",
        outlineOnly: boolean,
        rounded: boolean,
        disabled: boolean,
        bold: boolean
    }>(),
    {
        size: "regular",
        primary: true,
        rounded: true,
        disabled: false,
        bold: false
    }
)

function getSize() {
    switch (props.size) {
        case "regular":
            return "px-5 py-3"
        case "small":
            return "px-2 py-1 text-sm"
    }
}

function getBgCol() {
    return props.outlineOnly ? "bg-white" : (props.disabled ? palette[props.color].disabledBgCol : palette[props.color].bgCol)
}

function getBorderCol() {
    return props.disabled ? palette[props.color].disabledBorderCol : palette[props.color].borderCol
}

function getFontCol() {
    return props.outlineOnly ? props.disabled ? 'text-slate-600' : 'text-black' : 'text-white'
}
</script>

<template>
    <button :disabled="disabled" class="transition-colors border-solid border-2" :class="[getSize() ,{'rounded-full' : rounded}, getBgCol(), getBorderCol(), getFontCol(), {'font-bold' : bold}]">
        {{ content }}
    </button>
</template>
