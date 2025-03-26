import { createWebHashHistory,createRouter } from "vue-router";

const routes = [
    {
        path: '/home',component: () => import("@/components/loginPage.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory( ),
    routes,
})