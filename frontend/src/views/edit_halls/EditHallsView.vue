<script setup lang="ts">
import InputList from '@/components/InputList.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import MovieRoom from './MovieRoom.vue';

const router = useRouter()
const user = useUserStore()

if (user.ready && !user.isAdmin) {
    router.push("/denied")
}

watch(() => user.ready, () => {
    if (!user.isAdmin) {
        router.push("/denied")
    }
});

interface Room {
    _id: string;
    name: string;
    numberOfRows: number;
    numberOfColumns: number;
}

const rooms = ref<Map<string, Room>>(new Map());

interface Cinema {
    _id: string;
    name: string;
}

const cinemas = ref<Map<string, Cinema>>(new Map());

const selectedCinema = ref(""); // Sala selezionata
if (selectedCinema.value !== "") {
    getRooms(selectedCinema.value);
}
const selectedRoom = ref(""); // Sala selezionata

async function getCinemas() {
    try {
        const response = await axios.get(`http://localhost:3001/cinemas`);
        if (response.status === 200) {
            // cinemas.value = response.data.map((cinema: { _id: string; name: string }) => ({ _id: cinema._id, name: cinema.name }));
            for (const c of response.data) {
                const cinema: Cinema = { _id: c._id, name: c.name };
                cinemas.value.set(cinema.name, cinema);
            }
        } else {
            console.error("Errore durante il recupero dei cinema.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

async function getRooms(newCinemaName: string) {
    try {
        const response = await axios.get(`http://localhost:3001/cinemaHalls/cinema/${newCinemaName}`);
        if (response.status === 200) {
            rooms.value.clear();
            for (const r of response.data) {
                const room = r as Room;
                rooms.value.set(room.name, room);
            }
        } else {
            console.error("Errore durante il recupero delle sale.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
    }
}

function changeRoom(id: string) {
    selectedRoom.value = id;
}

function changeCinema(name: string) {
    selectedCinema.value = name;
}

watch(selectedCinema, async (newCinemaName) => {
    selectedRoom.value = "";
    getRooms(newCinemaName);
});

// watch(selectedRoom, async (newRoom) => {

// });

const name = ref("");
const rows = ref("1");
const cols = ref("1");

function addMovieRoom() {
    if (editorMode.value == "add") {
        axios.post("http://localhost:3001/cinemaHalls/", {
            name: name.value,
            cinema: selectedCinema.value,
            numberOfRows: rows.value,
            numberOfColumns: cols.value
        })
        .then(() => {
            getRooms(selectedCinema.value);
            hideEditor();
            alert(`Nuova sala '${name.value}' aggiunta!`) // TODO: (also backend should double-check that the user is an admin)
        }, () => {
            alert("Aggiunta della sala fallita.");
        });
    } else {
        axios.put(`http://localhost:3001/cinemaHalls/${rooms.value.get(selectedRoom.value)?._id}`, {
            name: name.value,
            cinema: selectedCinema.value,
            numberOfRows: rows.value,
            numberOfColumns: cols.value
        })
        .then(() => {
            getRooms(selectedCinema.value);
            alert(`Nuova sala '${name.value}' aggiunta!`) // TODO: (also backend should double-check that the user is an admin)
        }, () => {
            alert("Aggiunta della sala fallita.");
        });
    }
}

function deleteMovieRoom() {
    axios.get(`http://localhost:3001/screenings/cinemaHall/${rooms.value.get(selectedRoom.value)?._id}/future-screenings`)
    .then((res) => {
        if (res.data.length == 0) {
            axios.delete(`http://localhost:3001/cinemaHalls/${rooms.value.get(selectedRoom.value)?._id}`)
            .then(() => {
                const roomName = selectedRoom.value;
                getRooms(selectedCinema.value);
                alert(`Sala '${roomName}' eliminata!`);
            }, () => {
                alert("Eliminazione della sala fallita.");
            });
        } else {
            alert("Impossibile eliminare la sala, ci sono proiezioni attive.");
        }
    }, () => {
        alert("Eliminazione della sala fallita.");
    });
}

function resetValues() {
    if (editorMode.value == 'add') {
        name.value = "";
        rows.value = "1";
        cols.value = "1";
    } else {
        const room = rooms.value.get(selectedRoom.value)!;

        name.value = room.name;
        rows.value = room.numberOfRows.toString();
        cols.value = room.numberOfColumns.toString();
    }
}

function handleInputUpdate(index: number, value: string) {
    switch (index) {
        case 0:
            name.value = value;
            break;
        case 1:
            rows.value = value;
            break;
        case 2:
            cols.value = value;
            break;
        default:
            break;
    }
}

type EditorMode = "add" | "update";

const displayEditor = ref(false)
const editorMode = ref<EditorMode>("add")

function showEditor(mode: EditorMode) {
    displayEditor.value = true;
    editorMode.value = mode;

    if (mode == 'update') {
        const room = rooms.value.get(selectedRoom.value)!;
        name.value = room.name;
        cols.value = room.numberOfColumns.toString();
        rows.value = room.numberOfRows.toString();
    } else {
        name.value = "";
        cols.value = "1";
        rows.value = "1";
        selectedRoom.value = ""
    }

    setTimeout(() => {
        document.getElementById("room-view")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 25);
}

function hideEditor() {
    displayEditor.value = false;
}

onMounted(() => {
    console.log("PAGE MOUNTED")
    getCinemas();
});
</script>

<template>
    <div class="w-full flex flex-col gap-2 mx-auto">
        <div class="flex flex-col gap-2 mx-auto">
            <section>
                <label for="cinema" class="block text-sm font-medium text-gray-700">Cinema</label>
                <select id="cinema" v-model="selectedCinema" required
                    @change="changeCinema(($event.target as HTMLSelectElement).value)"
                    class="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-700">
                    <option v-for="cinema in cinemas" :key="cinema[0]" :value="cinema[1].name"
                        class="text-gray-700 hover:bg-gray-100">
                        {{ cinema[1].name }}
                    </option>
                </select>
            </section>

            <!-- Selezione della sala -->
            <section>
                <label for="room" class="block text-sm font-medium text-gray-700">Sala</label>
                <select id="room" v-model="selectedRoom" required
                    @change="changeRoom(($event.target as HTMLSelectElement).value)"
                    class="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                    :disabled="selectedCinema === ''"
                    :class="selectedCinema === '' ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-white text-gray-700'">
                    <option v-for="room in rooms" :key="room[0]" :value="room[1].name">
                        {{ room[1].name }}
                    </option>
                </select>
            </section>

            <div class="flex gap-2">
                <SimpleButton color="primary" size="small" :disabled="selectedCinema == ''" :handle-click="() => showEditor('add')">
                    Aggiungi nuova sala
                </SimpleButton>
                <SimpleButton color="primary" size="small" :disabled="selectedRoom == ''" :handle-click="() => showEditor('update')">
                    Modifica sala
                </SimpleButton>
                <SimpleButton color="red" size="small" :disabled="selectedRoom == ''" :handle-click="deleteMovieRoom">
                    Elimina sala
                </SimpleButton>
            </div>
        </div>

        <div v-show="displayEditor" class="flex flex-col mb-8">
            <div class="my-4">
                <h1 class="text-2xl font-bold text-center">{{ editorMode == 'add' ? 'Aggiungi nuova sala' : 'Modifica sala' }}</h1>
            </div>
            <div id="room-view" class="flex flex-grow justify-center gap-2">
                <div
                    class="flex flex-col gap-2 bg-gray-50 border-1, border-solid border-slate-500 rounded-lg w-4/5 max-w-[800px] p-5 self-center">
                    <form class="flex flex-col gap-2" @submit.prevent="addMovieRoom" @reset="resetValues">
                        <InputList :inputs="[
                            {
                                id: 'room_name',
                                label: 'Nome sala:',
                                placeholder: 'Nome sala',
                                required: true,
                                inputSize: 'fit',
                                value: name,
                            },
                            {
                                id: 'room_rows',
                                label: 'Righe:',
                                placeholder: 'Numero righe',
                                inputType: 'number',
                                required: true,
                                inputSize: 'fit',
                                value: rows,
                                range: { min: 1, max: 30 }
                            },
                            {
                                id: 'room_seats',
                                label: 'Posti per riga:',
                                placeholder: 'Numero posti per riga',
                                inputType: 'number',
                                required: true,
                                inputSize: 'fit',
                                value: cols,
                                range: { min: 1, max: 50 }
                            },
                        ]" @update:value="handleInputUpdate" />
                        <MovieRoom :rows="Number(rows)" :cols="Number(cols)" :interactive="false" class="h-[50vh]" />
                        <div class="flex justify-end gap-2">
                            <SimpleButton id="hide" type="button" color="secondary" size="small" rounding="small" :handle-click="hideEditor">Annulla</SimpleButton>
                            <SimpleButton id="reset" type="reset" color="red" size="small" rounding="small" >Reset</SimpleButton>
                            <SimpleButton id="submit" type="submit" color="green" size="small" rounding="small">{{ editorMode == 'add' ? 'Aggiungi' : 'Modifica' }}</SimpleButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
