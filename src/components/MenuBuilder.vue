<script setup lang="ts">
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref, watch } from 'vue';
import { MenuItem } from '../types';
import MenuItemComponent from './MenuItem.vue';

const props = defineProps<{
  menuItems: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
}>();

const emit = defineEmits(['update']);

const menuName = ref('Main Menu');
const showCustomLinkForm = ref(false);
const customLinkUrl = ref('');
const customLinkLabel = ref('');
const localMenuItems = ref<MenuItem[]>([...props.menuItems]);

watch(() => props.menuItems, (newItems) => {
  localMenuItems.value = JSON.parse(JSON.stringify(newItems));
}, { deep: true });

onMounted(() => {
  const menuContainer = document.getElementById('menu-container');
  if (menuContainer) {
    new Sortable(menuContainer, {
      group: 'nested-sortable',
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: () => {
        emit('update', localMenuItems.value);
      }
    });
  }
});

const saveMenu = () => {
  emit('update', localMenuItems.value);
  alert('Menu saved successfully!');
};

const deleteMenu = () => {
  if (confirm('Are you sure you want to delete this menu?')) {
    localMenuItems.value = [];
    emit('update', localMenuItems.value);
  }
};

const updateMenuItem = (updatedItem: MenuItem) => {
  const updateItemInTree = (items: MenuItem[], item: MenuItem): boolean | { removed: boolean; item: MenuItem } => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        if (item.moveDirection) {
          if (item.moveDirection === 'up' && i > 0) {
            [items[i - 1], items[i]] = [items[i], items[i - 1]];
          } else if (item.moveDirection === 'down' && i < items.length - 1) {
            [items[i + 1], items[i]] = [items[i], items[i + 1]];
          } else if (item.moveDirection === 'out') {
            const itemToMove = { ...items[i] };
            delete itemToMove.moveDirection;
            items.splice(i, 1);
            return { removed: true, item: itemToMove };
          }
          delete item.moveDirection;
        } else {
          items[i] = { ...item };
        }
        return true;
      }
      if (items[i].children.length > 0) {
        const result = updateItemInTree(items[i].children, item);
        if (result === true) {
          return true;
        } else if (result && typeof result === 'object' && result.removed) {
          items.push(result.item);
          return true;
        }
      }
    }
    return false;
  };

  const newItems = JSON.parse(JSON.stringify(localMenuItems.value));
  updateItemInTree(newItems, updatedItem);
  localMenuItems.value = newItems;
  emit('update', localMenuItems.value);
};

const removeMenuItem = (itemId: string) => {
  const removeItemFromTree = (items: MenuItem[], id: string): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].children.length > 0) {
        if (removeItemFromTree(items[i].children, id)) {
          return true;
        }
      }
    }
    return false;
  };

  const newItems = JSON.parse(JSON.stringify(localMenuItems.value));
  removeItemFromTree(newItems, itemId);
  localMenuItems.value = newItems;
  emit('update', localMenuItems.value);
};

const addCustomLink = () => {
  if (customLinkLabel.value && customLinkUrl.value) {
    const newItem: MenuItem = {
      id: uuidv4(),
      name: customLinkLabel.value,
      url: customLinkUrl.value,
      children: [],
      isExpanded: false,
      type: 'custom'
    };

    localMenuItems.value.push(newItem);
    emit('update', localMenuItems.value);

    customLinkUrl.value = '';
    customLinkLabel.value = '';
    showCustomLinkForm.value = false;
  }
};

const addSubmenuItem = (parentId: string, name: string, url: string) => {
  const addSubmenuToParent = (items: MenuItem[], id: string, newSubmenu: MenuItem): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].children.push(newSubmenu);
        items[i].isExpanded = true;
        return true;
      }
      if (items[i].children.length > 0) {
        if (addSubmenuToParent(items[i].children, id, newSubmenu)) {
          return true;
        }
      }
    }
    return false;
  };

  const newSubmenuItem: MenuItem = {
    id: uuidv4(),
    name: name,
    url: url,
    children: [],
    isExpanded: false,
    type: 'subelement',
    parent: parentId
  };

  const newItems = JSON.parse(JSON.stringify(localMenuItems.value));
  addSubmenuToParent(newItems, parentId, newSubmenuItem);
  localMenuItems.value = newItems;
  emit('update', localMenuItems.value);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <h2 class="text-lg font-semibold text-gray-800 mr-4">Menu Structure</h2>
        <div class="flex items-center">
          <span class="text-sm text-gray-600 mr-2">Name</span>
          <input v-model="menuName" type="text" class="border rounded px-2 py-1 text-sm" placeholder="Menu Name" />
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="saveMenu" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
          Save menu
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div v-if="showCustomLinkForm" class="border rounded p-4 mb-4">
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input v-model="customLinkUrl" type="text" class="border rounded px-2 py-1 w-full"
            placeholder="http://example.com/blog" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input v-model="customLinkLabel" type="text" class="border rounded px-2 py-1 w-full" placeholder="Blog" />
        </div>
        <button @click="addCustomLink" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
          Add menu item
        </button>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="font-medium text-gray-700 mb-2">Menu Structure</h3>
      <p class="text-sm text-gray-600 mb-4">
        Place each item in the order you prefer. Click on the arrow to the right of the item to display more
        configuration options.
      </p>
    </div>

    <div id="menu-container" class="space-y-2">
      <template v-if="localMenuItems.length > 0">
        <MenuItemComponent v-for="item in localMenuItems" :key="item.id" :item="item" :onUpdate="updateMenuItem"
          :onRemove="removeMenuItem" :onAddSubmenu="addSubmenuItem" />
      </template>
      <div v-else class="p-4 border border-dashed rounded text-center text-gray-500">
        Your menu is empty. Add items from the available pages list or create a custom link.
      </div>
    </div>

    <div class="mt-4 flex justify-between">
      <button @click="deleteMenu" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
        Delete menu
      </button>
      <button @click="saveMenu" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
        Save menu
      </button>
    </div>
  </div>
</template>