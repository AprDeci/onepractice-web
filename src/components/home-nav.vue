<script setup lang="ts">
import { loadRouteLocation, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getUserInfo } from '../request/methods/user';
import { usepaperStore } from '../store/paperStore';
import { types } from '../common/paper';
import { Armchair, LogOut } from 'lucide-vue-next';
import { logout } from '../request/methods/user';
const router = useRouter();
const paperStore = usepaperStore();
const haslogin = localStorage.getItem('token') ? true : false;
const userInfo = ref({
    username: '',
    userType: '',
});
onMounted(async () => {
    if (localStorage.getItem("token")) {
        const data = await getUserInfo()
        userInfo.value.username = data.username;
        userInfo.value.userType = data.userType;
    }
})

const postlogout = async () => {
    await logout();
    paperStore.cleanAll();
    location.reload()
}
</script>

<template>
    <div class="navbar bg-base-100 h-18 border-0">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><a>Item 1</a></li>
                    <li>
                        <a>Parent</a>
                        <ul class="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div class="navbar-start">
                <a class="btn btn-ghost text-xl pl-0 lg:pl-4" @click="router.push('/')">One Practice</a>
            </div>
        </div>
        <!-- 横屏 -->
        <div class="hidden lg:contents">
            <div class="navbar-center">
                <ul class="menu menu-horizontal px-1 gap-6">
                    <li><a @click="router.push('/')" class="text-sm font-medium transition-colors">All Tests</a>
                    </li>
                    <li>
                        <details>
                            <summary class="px-5 text-md font-mediumtransition-colors">
                                Type</summary>
                            <ul class="p-2">
                                <li v-for="type in types" :key="type"><a>{{ type }}</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Difficulty</a></li>
                    <li><a href="" @click="router.push({ name: 'userInfo' })">My progress</a></li>
                </ul>
            </div>
            <div class="theme ml-5">
                <label class=" swap swap-rotate">
                    <!-- this hidden checkbox controls the state -->
                    <input type="checkbox" class="theme-controller" value="night" />

                    <!-- sun icon -->
                    <svg class="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    <!-- moon icon -->
                    <svg class="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
            </div>
        </div>
        <div class="navbar-end flex gap-5" v-if="!haslogin">
            <div class="btn" @click="router.push('/login')">Sign in</div>
            <div class="btn btn-primary" @click="router.push('/register')">Sign Up</div>
        </div>
        <div class="navbar-end" v-else>
            <div
                class="hover:bg-gray-100 mr-10 w-20 flex justify-center items-center h-10 rounded-sm cursor-pointer rounded-lg">
                <details class="dropdown  dropdown-center">
                    <summary class="select-none">{{ userInfo.username }}</summary>
                    <ul class="menu dropdown-content bg-base-100 rounded-box w-32 lg:w-35 z-1 p-2 shadow-sm">
                        <li>
                            <a @click="router.push({ name: 'userInfo' })">
                                <Armchair :size="14" :stroke-width="1.5" />My Space
                            </a>
                        </li>
                        <li><a @click="postlogout" class="text-red-500">
                                <LogOut :size="14" color="#ff2424" />Log Out
                            </a></li>
                    </ul>
                </details>
            </div>
        </div>
    </div>
</template>