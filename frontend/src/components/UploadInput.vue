<script setup lang="ts">
import { ref } from 'vue';
import SimpleButton from '@/components/SimpleButton.vue';
import LoadingAlert from './LoadingAlert.vue';

// Stato per gestire il file selezionato
const selectedFile = ref<File | null>(null);
const uploadStatus = ref<{ success: boolean; message: string } | null>(null);

const emit = defineEmits(["fileUploaded"]);
const loading = ref(false);

// Gestisce il file selezionato dall'utente
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  } else {
    selectedFile.value = null;
  }
}

// Carica il file al server
async function uploadImage() {
  if (!selectedFile.value) return;
  loading.value = true;
  const formData = new FormData();
  formData.append('image', selectedFile.value);

  try {
    const response = await fetch('http://localhost:3001/image/uploadposter', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      uploadStatus.value = { success: true, message: data.message };
      emit("fileUploaded", data.imagePath);
    } else {
      const error = await response.json();
      uploadStatus.value = { success: false, message: error.message || 'Errore durante il caricamento.' };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    uploadStatus.value = { success: false, message: 'Errore di connessione al server.' };
  }
  loading.value = false;
}


</script>

<template>
  <div class="space-y-2">
    <label for="imgUpload" class="block text-primary-dark font-semibold">Carica un'immagine</label>
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
      <input id="imgUpload" type="file" @change="handleFileChange" accept="image/*"
      class="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary" />
      <SimpleButton id="uploadButton" label="Carica poster" type="button" :modelValue="''" @click="uploadImage"
      :disabled="!selectedFile" rounding="small" size="small" content="Carica poster" color="primary" />
    </div>
    <LoadingAlert v-if="loading" />
    <div v-if="uploadStatus" class="mt-4">
      <p v-if="uploadStatus.success" class="text-green-500">
        {{ uploadStatus.message }}
      </p>
      <p v-else class="text-red-500">
        {{ uploadStatus.message }}
      </p>
    </div>
  </div>
</template>



<style scoped>
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>