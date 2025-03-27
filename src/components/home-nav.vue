<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
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
                <a class="btn btn-ghost text-xl pl-0 lg:pl-4">One Practice</a>
            </div>
        </div>
        <!-- 横屏 -->
        <div class="hidden lg:contents">
            <div class="navbar-center">
                <ul class="menu menu-horizontal px-1 gap-6">
                    <li><a class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">All Tests</a>
                    </li>
                    <li>
                        <details>
                            <summary class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                                Categoray</summary>
                            <ul class="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Difficulty</a></li>
                    <li><a href="">My progress</a></li>
                </ul>
            </div>
        </div>
        <div class="navbar-end gap-2 ">
            <div class="btn" @click="router.push('/login')">Sign in</div>
            <div class="btn btn-primary" @click="router.push('/login')">Sign Up</div>
        </div>
    </div>
</template>