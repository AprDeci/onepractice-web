<script setup lang="ts">
import { Github } from 'lucide-vue-next';
</script>

<template>
    <footer className="bg-base-200 border-t border-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-base-content">
                        © {{ new Date().getFullYear() }} OnePractice English. All rights reserved.
                    </p>
                </div>
                <div className="flex gap-8">
                    <div class="flex gap-2">
                        <Github :size="18" /><a href="https://github.com/AprDeci/onepractice">项目地址</a>
                    </div>
                    <a href="/terms" className="text-sm text-base-content hover:text-gray-900">
                        Terms
                    </a>
                    <a href="/privacy" className="text-sm text-base-content hover:text-gray-900">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-base-content hover:text-gray-900">
                        Help
                    </a>
                    <a href="#" className="text-sm text-base-content hover:text-gray-900">
                        Contact
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>