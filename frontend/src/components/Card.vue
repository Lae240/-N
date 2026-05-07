<script setup>
defineProps(["title", "value", "color", "icon"]);
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow flex justify-between items-center">
    <div>
      <p class="text-gray-500 text-sm">{{ title }}</p>
      <h2 class="text-2xl font-bold mt-1">{{ value }}</h2>
    </div>

    <div :class="`p-3 rounded-lg ${color}`">
      <component :is="icon" size="20" />
    </div>
  </div>
</template>