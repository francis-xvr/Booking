import { createRouter, createWebHistory } from 'vue-router'
// import BookingLandingPage from '•/components/BookingLandingPage-vue'
import HomeComponent from './components/HomeComponent.vue'

const routes = [
    { path: '/', component: HomeComponent },
    // { path: '/booking', component: BookingLandingPage }
]

const router = createRouter ({
history: createWebHistory(),
routes,
})

export default router