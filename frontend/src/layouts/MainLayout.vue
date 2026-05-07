<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div>
    <!-- Sidebar fixed -->
    <Sidebar />

    <!-- Content -->
    <div class="ml-[240px] p-6 bg-gray-100 min-h-screen">
      <router-view />
    </div>
  </div>
</template>