import { createWebHashHistory, createRouter } from "vue-router";
import { usepaperStore } from "../store/paperStore";

const hasLogin = () => {
  return localStorage.getItem("token") !== null;
};

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/page/loginPage.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/page/registerPage.vue")
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: () => import("@/page/resetPasswordPage.vue")
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/page/homePage.vue")
  },
  {
    path: "/exam",
    children: [
      {
        path: "introduce/:id",
        props: true,
        name: "examintro",
        component: () => import("@/page/examIntroducePage.vue")
      },
      {
        path: "page/:id/:mode",
        props: true,
        name: "examPage",
        component: () => import("@/page/examPage.vue")
      },
      {
        path: "page/:id/:mode/:recordId",
        props: true,
        name: "examPageContinue",
        component: () => import("@/page/examPage.vue")
      },
      {
        path: "result",
        name: "examResult",
        component: () => import("@/page/examResultPage.vue")
      }
    ]
  },
  {
    path: "/userInfo",
    name: "userInfo",
    component: () => import("@/page/userInfoPage.vue"),
    meta: {
      requiredAuth: true
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/page/404.vue")
  },
  {
    path: "/test",
    component: () => import("@/page/examResultPage.vue")
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404"
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由守卫
router.beforeEach(async (to, from) => {
  const paperStore = usepaperStore();
  // 清理过期数据
  paperStore.cleanupOldData();
  if (to.meta.requiredAuth && !hasLogin()) {
    return {
      path: "/login"
    };
  }
  return true;
});
