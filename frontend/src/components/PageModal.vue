<script lang="ts" setup>

const props = defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits(['closeModal']);
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
        <button
          @click="emit('closeModal')"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="Chiudi modale"
        >
          Chiudi
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
body.modal-open {
  overflow: hidden;
}
</style>
