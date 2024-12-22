<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import SimpleButton from '@/components/SimpleButton.vue';
import axios from 'axios';

const user = useUserStore();
interface CustomNotification {
    _id: string;
    title: string;
    text: string;
    timestamp: string;
    resource: string;
}

const notifications = ref<CustomNotification[]>([]);

// Mock delle notifiche (da sostituire con una chiamata API reale)
const fetchNotifications = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/notifications/user/${user.userId}`);
        notifications.value = response.data;
    } catch (error) {
        console.error('Errore nel caricamento del film', error);
    }
};

// Formatta la data per una migliore leggibilità
const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const deleteNotification = async (id: string) => {
    try {
        await axios.delete(`http://localhost:3001/notifications/${id}`);
        fetchNotifications();
    } catch (error) {
        console.error('Errore nel caricamento del film', error);
    }
};

// Carica le notifiche all'avvio
onMounted(fetchNotifications);
</script>

<template>
    <section class="p-4 w-full max-w-7xl mx-auto">
        <header class="text-center mb-6">
            <h1 id="notifications-title" class="text-3xl font-bold text-primary-dark">Notifiche</h1>
        </header>

        <!-- Lista notifiche -->
        <ul v-if="notifications.length > 0" class="space-y-4">
            <li v-for="notification in notifications" :key="notification._id"
                class="bg-gray-50 rounded-lg shadow-md p-4 border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                :aria-label="'Notifica ' + notification._id">
                <router-link :to="{ name: 'movie', query: { id: notification.resource } }"
                    class="block text-gray-700 hover:text-blue-600" role="link">
                    <p class="text-sm text-gray-600">
                        <span class="font-bold"></span>
                    </p>
                    <p class="text-sm text-gray-500 mt-2">
                        <span class="font-bold">Messaggio:</span> {{ notification.text }}
                    </p>
                    <p class="text-sm text-gray-400 mt-2">
                        <span class="font-bold">Ricevuto il:</span> {{ formatDate(notification.timestamp) }}
                    </p>
                </router-link>
                    <!-- Azioni amministratore -->
                    <div v-if="user.isAdmin"
                        class="flex flex-col sm:flex-row mt-4 sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <SimpleButton :handle-click="() => deleteNotification(notification._id)" color="red"
                            rounding="small" content="Elimina" size="small" />
                    </div>
            </li>
        </ul>
        <!-- Nessuna notifica -->
        <p v-else class="text-gray-500 text-center bg-gray-50 rounded-lg shadow-md p-4 border border-gray-200">Non ci
            sono notifiche da visualizzare.</p>
    </section>
</template>