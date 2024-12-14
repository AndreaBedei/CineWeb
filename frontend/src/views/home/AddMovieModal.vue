    <script setup lang="ts">
    import UploadInput from '@/components/UploadInput.vue';
    import { ref } from 'vue';
    import BaseInput from '@/components/BaseInput.vue';
    import SimpleButton from '@/components/SimpleButton.vue';


    // Props ricevute
    const props = defineProps({
        name: {
            type: String,
            default: ''
        },
        poster: {
            type: String,
            default: ''
        },
        trailer: {
            type: String,
            default: ''
        },
        categories: {
            type: Array<string>,
            default: () => []
        },
        duration: {
            type: String,
            default: ''
        },
    });

    const categories = ref(props.categories);
    const name = ref(props.name);
    const trailer = ref(props.trailer);
    const duration = ref(props.duration);

    function handleSubmit(){
        console.log('Salvataggio film');
        emit('close');
    }
    // Eventi emessi
    const emit = defineEmits(['close', 'save']);

    // Chiudi il modale
    function closeModal() {
        emit('close');
    }

</script>
<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" role="dialog"
        aria-labelledby="modal-title" aria-modal="true">
        <div class="bg-white rounded-lg shadow-lg  max-w-lg p-6">
            <header>
                <h2 id="modal-title" class="text-2xl font-semibold text-primary-dark mb-4">
                    Schermata aggiunta film
                </h2>
            </header>
            <form>
                <!-- Nome -->
                <BaseInput id="nome-film" label="Nome del film" v-model="name" :require="true" />

                <!-- Durata -->
                <BaseInput id="durata-film" label="Durata (minuti)" v-model="duration" :require="true" />

                <!-- Poster -->
                <UploadInput />

                <section>
                    <BaseInput id="trailer-film" label="Trailer (Video Key)" v-model="trailer" :require="true" />
                    <p class="text-sm text-gray-500 mt-1">Esempio: v=<strong>dQw4w9WgXcQ</strong></p>
                </section>

                <!-- Categorie -->
                <div class="mb-4">
                    <label for="categorie-film" class="block text-primary-dark font-semibold mb-2">
                        Categorie
                    </label>
                    <select id="categorie-film" v-model="categories"
                        class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" multiple>
                        <option v-for="categoria in categories" :key="categoria" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>
                </div>
                <!-- Bottoni -->
            </form>
            <div class="flex justify-end space-x-4">
                <SimpleButton content="Annulla" color="red" :handleClick="handleSubmit" rounding="small" />
                <SimpleButton content="Salva" color="green" rounding="small" :handleClick="handleSubmit"  />
            </div>
        </div>
    </div>
</template>