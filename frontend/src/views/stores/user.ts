import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js';

interface Interest {
    _id: string;
    name: string;
}

async function loadData(userId: string) {
    const user = useUserStore()

    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    const data = response.data;
    if (data) {
        user.email = data.email;
        user.name = data.name;
        user.surname = data.surname;
        user.interests = data.favoriteGenres;
        user.profileImg = data.profilePicture;
    }
}

function hashPassword(password: string, salt: string): string {
    const saltedPassword = password + salt;
    return CryptoJS.SHA512(saltedPassword).toString(CryptoJS.enc.Hex);
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: "",
            username: "",
            email: "",
            name: "",
            surname: "",
            profileImg: "",
            interests: [] as Interest[]
        }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        async login(email: string, password: string): Promise<{ success: true } | { success: false, errorNum: number, error: AxiosError | undefined }> {
            try {

                const emailCheck = await axios.get('http://localhost:3001/users/email?email=' + email);
                if (emailCheck.data.length === 0) {
                    return { success: false, errorNum: 0, error: undefined };
                }
                const salt = emailCheck.data[0].salt;
                const hashPassw = hashPassword(password, salt);
                const ret = await axios.post('http://localhost:3001/users/email?email=' + email, { password: hashPassw });

                loadData(ret.data);
                this.userId = ret.data;
            }
            catch (error) {
                console.error(error);
                return { success: false, errorNum: 1, error: error as AxiosError };
            }
            return { success: true };
        },
        logout() {
            this.userId = "";
            this.username = "";
            this.email = "";
            this.name = "";
            this.surname = "";
            this.profileImg = "";
            this.interests = [];
        },
        async refresh() {
            await loadData(this.userId);
        }
    },
})
