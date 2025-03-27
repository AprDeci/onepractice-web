import { createWebHashHistory,createRouter } from "vue-router";

const routes = [
    {
        path: '/login',component: () => import("@/page/loginPage.vue")
    },
    {
        path: '/',component: () => import("@/page/homePage.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory( ),
    routes,
})