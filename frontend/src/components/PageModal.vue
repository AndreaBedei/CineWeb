<script lang="ts" setup>
import SimpleButton from './SimpleButton.vue';


const props = defineProps<{
  title: string,
  message: string,
  confirm: boolean,
}>();

const emit = defineEmits(['closeModal', 'confirm']);
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
      role="document"
    >
      <h3
        id="modal-title"
        class="text-lg font-semibold text-primary-dark mb-4"
      >
        {{ props.title }}
      </h3>

      <p class="text-sm text-neutral-dark mb-6">
        {{ props.message }}
      </p>

      <div class="flex justify-end">
        <SimpleButton :handle-click="() => emit('closeModal')" class="mr-2" color="primary" size="small" rounding="small" content="Chiudi"/>
        <SimpleButton v-if="props.confirm" :handle-click="() => emit('confirm')" color="red" size="small" rounding="small" content="Elimina"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
body.modal-open {
  overflow: hidden;
}
</style>
