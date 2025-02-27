<script setup lang="ts">
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { PageItem } from '../types';

const props = defineProps<{
    onAddToMenu: (page: PageItem) => void;
}>();

const pages = ref<PageItem[]>([
    { id: '1', name: 'Home', url: '/' },
    { id: '2', name: 'About', url: '/about' },
    { id: '3', name: 'Products', url: '/products' },
]);

const customLinkLabel = ref('');
const customLinkUrl = ref('');

const addCustomLink = () => {
    if (!customLinkLabel.value.trim() || !customLinkUrl.value.trim()) return;

    const page: PageItem = {
        id: uuidv4(),
        name: customLinkLabel.value.trim(),
        url: customLinkUrl.value.trim(),
    };

    props.onAddToMenu(page);
    customLinkLabel.value = '';
    customLinkUrl.value = '';
};
</script>

<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Custom Link</h2>
        <details class="space-y-2">
            <summary class="font-medium text-gray-700 py-2 px-4 rounded cursor-pointer">Add Custom Link</summary>
            <form @submit.prevent="addCustomLink" class="p-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input v-model="customLinkUrl" type="text" class="border rounded px-2 py-1 w-full"
                    placeholder="http://example.com/custom-link">

                <label class="block text-sm font-medium text-gray-700 mb-1 mt-2">Label</label>
                <input v-model="customLinkLabel" type="text" class="border rounded px-2 py-1 w-full"
                    placeholder="Custom Link">

                <div class="p-2 flex justify-end">
                    <button type="submit"
                        class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Menu Item
                    </button>
                </div>
            </form>
        </details>
    </div>
</template>
