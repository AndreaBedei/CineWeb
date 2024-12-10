<script lang="ts" setup>
    import { ref } from 'vue';
    
    // Stato per gestire il file selezionato
    const selectedFile = ref<File | null>(null);
    const uploadStatus = ref<{ success: boolean; message: string } | null>(null);
    
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
    
        const formData = new FormData();
        formData.append('image', selectedFile.value);
    
        try {
        const response = await fetch('http://localhost:3001/image/uploadposter', {
            method: 'POST',
            body: formData,
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            uploadStatus.value = { success: true, message: data.message };
        } else {
            const error = await response.json();
            uploadStatus.value = { success: false, message: error.message || 'Errore durante il caricamento.' };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            uploadStatus.value = { success: false, message: 'Errore di connessione al server.' };
        }
    }
</script>

<template>
    <div>
      <input
        type="file"
        @change="handleFileChange"
        accept="image/*"
        class="border p-2 rounded mb-4"
      />
      <button
        @click="uploadImage"
        :disabled="!selectedFile"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Carica Immagine
      </button>
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
  