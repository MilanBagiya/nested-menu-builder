<script setup lang="ts">
import { ref } from 'vue';
import { PageItem } from '../types';

const props = defineProps<{
    onAddToMenu: (page: PageItem) => void;
}>();

const pages = ref<PageItem[]>([
    { id: '1', name: 'Home', url: '/' },
    { id: '2', name: 'About', url: '/about' },
    { id: '3', name: 'Products', url: '/products' },
]);

const addToMenu = (page: PageItem) => {
    props.onAddToMenu(page);
};
</script>

<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Available Pages</h2>
        <div class="space-y-2">
            <div v-for="page in pages" :key="page.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                    <span class="font-medium text-gray-700">{{ page.name }}</span>
                    <span class="text-xs text-gray-500 block">{{ page.url }}</span>
                </div>
                <button @click="addToMenu(page)"
                    class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>
        </div>
    </div>
</template>