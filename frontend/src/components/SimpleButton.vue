<script setup lang="ts">

type Colors = ["red", "green", "primary", "secondary"]
type Color = Colors[number]

type ColorStructure = { bg: string, border: string, font: string, bgHover: string, borderHover: string }
type EnabledStructure = { enabled: ColorStructure, disabled: ColorStructure }

const palette : {[key in Color]: { full: EnabledStructure, outline: EnabledStructure }} =
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
        full: {
            enabled: {
                bg: "bg-red-500",
                bgHover: "hover:bg-red-950",
                font: "text-white",
                border: "border-red-500",
                borderHover: "hover:border-red-950"
            },
            disabled: {
                bg: "bg-red-300",
                bgHover: "hover:bg-red-300",
                font: "text-white",
                border: "border-red-300",
                borderHover: "hover:border-red-300"
            }
        },
        outline: {
            enabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-black",
                border: "border-red-500",
                borderHover: "hover:border-red-950"
            },
            disabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-slate-600",
                border: "border-red-300",
                borderHover: "hover:border-red-300"
            }
        }
    },
    "green": {
        full: {
            enabled: {
                bg: "bg-green-500",
                bgHover: "hover:bg-green-950",
                font: "text-white",
                border: "border-green-500",
                borderHover: "hover:border-green-950"
            },
            disabled: {
                bg: "bg-green-300",
                bgHover: "hover:bg-green-300",
                font: "text-white",
                border: "bg-green-300",
                borderHover: "hover:border-v-300"
            }
        },
        outline: {
            enabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-black",
                border: "border-green-500",
                borderHover: "hover:border-green-950"
            },
            disabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-slate-600",
                border: "border-green-300",
                borderHover: "hover:border-green-300"
            }
        }
    },
    "primary": {
        full: {
            enabled: {
                bg: "bg-primary",
                bgHover: "hover:bg-primary-dark",
                font: "text-white",
                border: "border-primary",
                borderHover: "hover:border-primary-dark"
            },
            disabled: {
                bg: "bg-primary-medium",
                bgHover: "hover:bg-primary-medium",
                font: "text-white",
                border: "border-primary-medium",
                borderHover: "hover:border-primary-medium"
            }
        },
        outline: {
            enabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-black",
                border: "border-primary",
                borderHover: "hover:border-primary-dark"
            },
            disabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-slate-600",
                border: "border-primary-medium",
                borderHover: "hover:border-primary-medium"
            }
        }
    },
    "secondary": {
        full: {
            enabled: {
                bg: "bg-secondary",
                bgHover: "hover:bg-secondary-dark",
                font: "text-white",
                border: "border-secondary",
                borderHover: "hover:border-secondary-dark"
            },
            disabled: {
                bg: "bg-secondary-light",
                bgHover: "hover:bg-secondary-light",
                font: "text-white",
                border: "border-secondary-light",
                borderHover: "hover:border-secondary-light"
            }
        },
        outline: {
            enabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-black",
                border: "border-secondary",
                borderHover: "hover:border-secondary-dark"
            },
            disabled: {
                bg: "bg-white",
                bgHover: "hover:bg-white",
                font: "text-slate-600",
                border: "border-secondary-light",
                borderHover: "hover:border-secondary-light"
            }
        }
    }
}

const props = withDefaults(
    defineProps<{
        content: string,
        color: Color,
        size?: "small" | "regular",
        outlineOnly?: boolean,
        rounding?: "none" | "small" | "full",
        disabled?: boolean,
        bold?: boolean
        handleClick?: () => void
    }>(),
    {
        size: "regular",
        outlineOnly: false,
        rounding: "none",
        disabled: false,
        bold: false,
        handleClick: () => {}
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

function getRounding() {
    switch (props.rounding) {
        case 'none':
            return null;
        case 'small':
            return "rounded-lg"
        case 'full':
            return "rounded-full"
    }
}

function getRightPalette() {
    return palette[props.color][props.outlineOnly ? "outline" : "full"][props.disabled ? "disabled" : "enabled"]
}

</script>

<template>
    <button :disabled="disabled" :onclick="handleClick" class="transition-colors border-solid border-2" :class="[getSize(), getRounding(), getRightPalette().bg, getRightPalette().bgHover, getRightPalette().border, getRightPalette().borderHover, getRightPalette().font, {'font-bold' : bold}]">
        <!-- <slot></slot> -->
        <!-- FIXME: uncomment and remove content -->
        {{ content }}
    </button>
</template>
