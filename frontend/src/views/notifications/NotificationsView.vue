<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import SimpleButton from '@/components/SimpleButton.vue';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string; // ISO string
}

const user = useUserStore();


const notifications = ref<Notification[]>([]);

// Mock delle notifiche (da sostituire con una chiamata API reale)
const fetchNotifications = async () => {
    notifications.value = [
        {
            id: '1',
            title: 'Benvenuto!',
            message: 'Grazie per esserti iscritto.',
            timestamp: '2024-12-21T10:00:00.000Z',
        },
        {
            id: '2',
            title: 'Manutenzione prevista',
            message: 'Il servizio sarà interrotto il 23 dicembre dalle 2 alle 4.',
            timestamp: '2024-12-20T15:30:00.000Z',
        },
    ];
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

// Funzioni per modificare o eliminare notifiche
const editNotification = (id: string) => {
    alert(`Modifica la notifica con ID: ${id}`);
};

const deleteNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
    alert(`Notifica con ID: ${id} eliminata.`);
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
            <li v-for="notification in notifications" :key="notification.id"
                class="bg-gray-50 rounded-lg shadow-md p-4 border border-gray-200"
                :aria-label="'Notifica ' + notification.id">
                <p class="text-sm text-gray-600">
                    <span class="font-bold">Titolo:</span> {{ notification.title }}
                </p>
                <p class="text-sm text-gray-500 mt-2">
                    <span class="font-bold">Messaggio:</span> {{ notification.message }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    <span class="font-bold">Ricevuto il:</span> {{ formatDate(notification.timestamp) }}
                </p>

                <!-- Azioni amministratore -->
                <div v-if="user.isAdmin" class="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                    <SimpleButton :handle-click="() => editNotification(notification.id)" color="primary" rounding="small" content="Modifica" size="small"/>
                    <SimpleButton :handle-click="() => deleteNotification(notification.id)" color="red" rounding="small" content="Elimina" size="small"/>
                </div>
            </li>
        </ul>

        <!-- Nessuna notifica -->
        <p v-else class="text-gray-500 text-center">Non ci sono notifiche da visualizzare.</p>
    </section>
</template>