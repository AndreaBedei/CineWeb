import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import PrivacyView from '@/views/privacy/PrivacyView.vue'
import SignOn from '@/views/signOn/SignOn.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import FilmView from '@/views/film/FilmView.vue'
import NotificationsView from '@/views/notifications/NotificationsView.vue'
import BookingView from '@/views/booking/BookingView.vue'
import EditHallsView from '@/views/edit_halls/EditHallsView.vue'
import AccessDeniedView from '@/views/access_denied/AccessDeniedView.vue'
import NotFoundView from '@/views/not_found/NotFoundView.vue'

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
        {
            path: '/profile/:userId',
            name: 'profileWithId',
            component: ProfileView,
            props: true
        },
        {
            path: '/movie',
            name: 'movie',
            component: FilmView
        },
        {
            path: '/notify',
            name: 'notify',
            component: NotificationsView
        },
        {
            path: '/booking',
            name: 'booking',
            component: BookingView,
            props: true
        },
        {
            path: '/edithalls',
            name: 'edithalls',
            component: EditHallsView,
        },
        {
            path: '/denied',
            name: 'denied',
            component: AccessDeniedView,
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: NotFoundView,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'notfound' }
        }
    ],
})

export default router
