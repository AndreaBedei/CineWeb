import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import PrivacyView from '@/views/privacy/PrivacyView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: PrivacyView,
        }
    ],
})

export default router
