import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js';
import { ref } from 'vue';

interface Interest {
    _id: string;
    name: string;
}

export const useUserStore = defineStore('user', () => {
    const userId = ref("");
    const username = ref("");
    const email = ref("");
    const name = ref("");
    const surname = ref("");
    const profileImg = ref("");
    const interests = ref([] as Interest[]);
    const ready = ref(false);

    async function _loadData(userId: string) {
        const response = await axios.get(`http://localhost:3001/users/${userId}`);
        const data = response.data;
        if (data) {
            email.value = data.email;
            name.value = data.name;
            surname.value = data.surname;
            interests.value = data.favoriteGenres;
            profileImg.value = data.profilePicture;
            ready.value = true;
        }
    }

    function _hashPassword(password: string, salt: string): string {
        const saltedPassword = password + salt;
        return CryptoJS.SHA512(saltedPassword).toString(CryptoJS.enc.Hex);
    }

    async function login(email: string, password: string): Promise<{ success: true } | { success: false, errorNum: number, error: AxiosError | undefined }> {
        try {

            const emailCheck = await axios.get('http://localhost:3001/users/email?email=' + email);
            if (emailCheck.data.length === 0) {
                return { success: false, errorNum: 0, error: undefined };
            }
            const salt = emailCheck.data[0].salt;
            const hashPassw = _hashPassword(password, salt);
            const ret = await axios.post('http://localhost:3001/users/email?email=' + email, { password: hashPassw });

            await _loadData(ret.data);
            userId.value = ret.data;
            localStorage.setItem('userId', ret.data);
        }
        catch (error) {
            console.error(error);
            return { success: false, errorNum: 1, error: error as AxiosError };
        }
        return { success: true };
    }

    function logout() {
        userId.value = "";
        username.value = "";
        email.value = "";
        name.value = "";
        surname.value = "";
        profileImg.value = "";
        interests.value = [];
        ready.value = false;

        localStorage.removeItem('userId');
    }

    async function refresh() {
        if (userId.value !== "") {
            await _loadData(userId.value);
        }
    }

    async function tryLogin() {
        if (userId.value === "") {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                return false;
            } else {
                userId.value = storedUserId;
                await _loadData(userId.value);
            }
        }
        return true;
    } 

    return { userId, username, email, name, surname, profileImg, interests, ready, login, logout, refresh, tryLogin }
})
