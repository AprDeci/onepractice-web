<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
    <div class="navbar bg-base-100 h-18 border-0">
        <div class="navbar-start">
            <a class="btn btn-ghost text-xl ">One Practice</a>
        </div>
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
        <div class="navbar-end gap-2">
            <div class="btn" @click="router.push('/login')">Sign in</div>
            <div class="btn btn-primary" @click="router.push('/login')">Sign Up</div>
        </div>
    </div>
</template>