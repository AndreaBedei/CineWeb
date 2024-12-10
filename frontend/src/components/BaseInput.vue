<script lang="ts" setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Date], required: true },
  require: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

function updateValue(value: string | Date) {
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="mb-4">
    <label :for="id" class="block text-primary-dark font-semibold mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="updateValue($event.target.value)"
      class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
      required
    />
  </div>
</template>

<style scoped></style>
