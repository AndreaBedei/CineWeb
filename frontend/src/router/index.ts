import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import PrivacyView from '@/views/privacy/PrivacyView.vue'
import SignOn from '@/views/signOn/SignOn.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: PrivacyView,
        },
        {
            path: '/signon',
            name: 'signon',
            component: SignOn,
        },
    ],
})

export default router
