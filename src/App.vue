<script setup lang="ts">
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem, PageItem } from './types';
import PageList from './components/PageList.vue';
import MenuBuilder from './components/MenuBuilder.vue';
import CustomLink from './components/CustomLink.vue';

const menuItems = ref<MenuItem[]>([]);
const selectedMenu = ref('Main Menu');
const showCreateMenu = ref(false);
const newMenuName = ref('');

const addPageToMenu = (page: PageItem) => {
  const newItem: MenuItem = {
    id: uuidv4(),
    name: page.name,
    url: page.url,
    children: [],
    isExpanded: false,
    type: 'page'
  };

  menuItems.value.push(newItem);
};

const updateMenuItems = (items: MenuItem[]) => {
  menuItems.value = items;
};

const createNewMenu = () => {
  if (newMenuName.value) {
    selectedMenu.value = newMenuName.value;
    menuItems.value = [];
    showCreateMenu.value = false;
    newMenuName.value = '';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Menu Builder</h1>

      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center">
          <span class="mr-2">Select the menu you want to edit:</span>
          <select v-model="selectedMenu" class="border rounded px-2 py-1 mr-2">
            <option>Main Menu</option>
          </select>
          <span class="mr-2">or</span>
          <button @click="showCreateMenu = true" class="text-blue-500 hover:underline">
            Create new menu
          </button>
          <div v-if="showCreateMenu" class="ml-4 flex items-center">
            <input v-model="newMenuName" type="text" class="border rounded px-2 py-1 mr-2"
              placeholder="New Menu Name" />
            <button @click="createNewMenu" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              Choose
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
          <CustomLink :onAddToMenu="addPageToMenu" />
        </div>

        <div class="md:col-span-2">
          <MenuBuilder :menuItems="menuItems" :onUpdate="updateMenuItems" />
        </div>

        <div class="md:col-span-1">
          <PageList :onAddToMenu="addPageToMenu" />
        </div>
      </div>

      <div class="mt-8 bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Menu Preview (JSON)</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-auto text-xs">{{ JSON.stringify(menuItems, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>