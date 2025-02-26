<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-1/4 bg-white p-4 border-r border-gray-200">
      <h2 class="font-bold text-lg mb-4">Pages</h2>
      <ul>
        <li v-for="page in pages" :key="page.id" @click="addMenuItem(page)"
          class="cursor-pointer p-2 hover:bg-gray-100 rounded">
          {{ page.label }}
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="w-3/4 p-4">
      <h2 class="font-bold text-lg mb-4">Menu Structure</h2>
      <ul ref="menuList" class="space-y-2">
        <li v-for="(item, index) in menuItems" :key="item.id" class="p-2 bg-white rounded shadow">
          <div class="flex justify-between items-center">
            <span>{{ item.label }}</span>
            <button @click="removeMenuItem(index)" class="text-red-500 hover:text-red-700">Remove</button>
          </div>
          <ul v-if="item.children.length" ref="nestedList" class="pl-4 mt-2 space-y-2">
            <li v-for="(child, childIndex) in item.children" :key="child.id" class="p-2 bg-gray-50 rounded">
              <div class="flex justify-between items-center">
                <span>{{ child.label }}</span>
                <button @click="removeChildItem(index, childIndex)"
                  class="text-red-500 hover:text-red-700">Remove</button>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <button @click="saveMenu" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save
        Menu</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Sortable from 'sortablejs';

export default defineComponent({
  name: 'MenuBuilder',
  setup() {
    const pages = ref([
      { id: 1, label: 'Home', url: '/' },
      { id: 2, label: 'Products', url: '/products' },
      { id: 3, label: 'Clothes', url: '/clothes' },
    ]);

    const menuItems = ref<any[]>([]);
    const menuList = ref<HTMLElement | null>(null);
    const nestedList = ref<HTMLElement | null>(null);

    const addMenuItem = (page: any) => {
      menuItems.value.push({ ...page, children: [] });
    };

    const removeMenuItem = (index: number) => {
      menuItems.value.splice(index, 1);
    };

    const removeChildItem = (parentIndex: number, childIndex: number) => {
      menuItems.value[parentIndex].children.splice(childIndex, 1);
    };

    const saveMenu = () => {
      console.log('Menu saved:', menuItems.value);
      // Implement your save logic here, e.g., send to an API
    };

    onMounted(() => {
      if (menuList.value) {
        Sortable.create(menuList.value, {
          group: 'menu',
          animation: 150,
          onEnd: (evt) => {
            const item = menuItems.value.splice(evt.oldIndex!, 1)[0];
            menuItems.value.splice(evt.newIndex!, 0, item);
          },
        });
      }

      if (nestedList.value) {
        Sortable.create(nestedList.value, {
          group: 'nested',
          animation: 150,
          onEnd: (evt) => {
            const parentIndex = Array.from(menuList.value!.children).indexOf(evt.from);
            const item = menuItems.value[parentIndex].children.splice(evt.oldIndex!, 1)[0];
            menuItems.value[parentIndex].children.splice(evt.newIndex!, 0, item);
          },
        });
      }
    });

    return {
      pages,
      menuItems,
      menuList,
      nestedList,
      addMenuItem,
      removeMenuItem,
      removeChildItem,
      saveMenu,
    };
  },
});
</script>
