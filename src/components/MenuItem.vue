<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sortable from 'sortablejs';
import { MenuItem } from '../types';

const props = defineProps<{
    item: MenuItem;
    onUpdate: (item: MenuItem) => void;
    onRemove: (id: string) => void;
    onAddSubmenu: (parentId: string, name: string, url: string) => void;
}>();

const isExpanded = ref(props.item.isExpanded || false);
const isEditing = ref(false);
const editedName = ref(props.item.name);
const editedUrl = ref(props.item.url || '');
const editedClass = ref(props.item.cssClass || '');

const showAddSubmenuForm = ref(false);
const submenuName = ref('');
const submenuUrl = ref('');

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
    props.onUpdate({ ...props.item, isExpanded: isExpanded.value });
};

const startEditing = () => {
    isEditing.value = true;
    editedName.value = props.item.name;
    editedUrl.value = props.item.url || '';
    editedClass.value = props.item.cssClass || '';
};

const saveEditing = () => {
    props.onUpdate({
        ...props.item,
        name: editedName.value,
        url: editedUrl.value,
        cssClass: editedClass.value,
    });
    isEditing.value = false;
};

const cancelEditing = () => {
    isEditing.value = false;
};

const removeItem = () => {
    if (confirm(`Are you sure you want to remove "${props.item.name}" and all its children?`)) {
        props.onRemove(props.item.id);
    }
};

const moveItem = (direction: 'up' | 'down' | 'out') => {
    props.onUpdate({ ...props.item, moveDirection: direction });
};

const toggleAddSubmenuForm = () => {
    showAddSubmenuForm.value = !showAddSubmenuForm.value;
};

const addSubmenu = () => {
    if (submenuName.value) {
        props.onAddSubmenu(props.item.id, submenuName.value, submenuUrl.value);
        submenuName.value = '';
        submenuUrl.value = '';
        showAddSubmenuForm.value = false;
    }
};

onMounted(() => {
    const childrenContainer = document.getElementById(`children-${props.item.id}`);
    if (childrenContainer) {
        new Sortable(childrenContainer, {
            group: 'nested-sortable',
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onEnd: () => {
                moveItem('out');
            },
        });
    }
});
</script>

<template>
    <div class="nested-sortable-item border rounded-md overflow-hidden mb-2">
        <div class="flex items-center justify-between p-3 bg-gray-50 cursor-move" :class="{ 'bg-blue-50': isExpanded }">
            <div v-if="!isEditing" class="flex items-center">
                <button @click.stop="toggleExpand" class="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    :class="{ 'transform rotate-90': isExpanded }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div>
                    <span class="font-medium text-gray-800">{{ item.name }}</span>
                    <span v-if="item.type === 'subelement'" class="ml-2 text-xs text-gray-500">Subelement</span>
                    <div class="flex items-center">
                        <span class="text-xs text-blue-500 mr-2">Link</span>
                        <span v-if="item.url" class="text-xs text-gray-500">{{ item.url }}</span>
                    </div>
                </div>
            </div>

            <div v-else class="w-full">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input v-model="editedName" type="text" class="border rounded px-2 py-1 w-full"
                            placeholder="Item name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Class CSS (optional)</label>
                        <input v-model="editedClass" type="text" class="border rounded px-2 py-1 w-full"
                            placeholder="CSS class" />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Url</label>
                    <input v-model="editedUrl" type="text" class="border rounded px-2 py-1 w-full" placeholder="URL" />
                </div>
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Move</label>
                    <div class="flex space-x-2">
                        <button @click="moveItem('up')"
                            class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                            Move up
                        </button>
                        <button @click="moveItem('down')"
                            class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                            Move Down
                        </button>
                        <button @click="moveItem('out')"
                            class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                            Out from {{ item.parent ? item.parent : 'Parent' }}
                        </button>
                    </div>
                </div>
                <div class="flex justify-between">
                    <button @click="removeItem"
                        class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                        Delete
                    </button>
                    <div class="flex space-x-2">
                        <button @click="cancelEditing"
                            class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                            Cancel
                        </button>
                        <button @click="saveEditing"
                            class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                            Update item
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isEditing" class="flex items-center space-x-1">
                <button @click.stop="toggleAddSubmenuForm"
                    class="p-1 text-green-500 hover:text-green-700 focus:outline-none" title="Add Submenu">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
                <button @click.stop="startEditing" class="p-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button @click.stop="removeItem" class="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    title="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        <div v-if="showAddSubmenuForm && !isEditing" class="pl-6 py-2 border-t bg-white">
            <div class="border rounded p-4 mb-2">
                <h4 class="font-medium text-gray-700 mb-2">Add Submenu Item</h4>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input v-model="submenuName" type="text" class="border rounded px-2 py-1 w-full"
                        placeholder="Submenu name" />
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input v-model="submenuUrl" type="text" class="border rounded px-2 py-1 w-full"
                        placeholder="http://example.com/submenu" />
                </div>
                <div class="flex justify-end space-x-2">
                    <button @click="toggleAddSubmenuForm"
                        class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                        Cancel
                    </button>
                    <button @click="addSubmenu"
                        class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                        Add Submenu
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isExpanded" :id="`children-${item.id}`" class="pl-6 py-2 border-t bg-white">
            <component :is="$options.components?.MenuItem" v-for="child in item.children" :key="child.id" :item="child"
                :onUpdate="onUpdate" :onRemove="onRemove" :onAddSubmenu="onAddSubmenu" />
        </div>
    </div>
</template>