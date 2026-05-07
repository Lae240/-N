<script setup>
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const register = async () => {
  await api.post("/auth/register", {
    username: username.value,
    password: password.value,
  });

  alert("Đăng ký thành công");
  router.push("/");
};
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow w-80">
    <h2 class="font-bold mb-4 text-lg">Đăng ký</h2>

    <input v-model="username" class="border p-2 w-full mb-3 rounded" placeholder="Username"/>
    <input v-model="password" type="password" class="border p-2 w-full mb-3 rounded" placeholder="Password"/>

    <button @click="register" class="bg-green-500 text-white w-full p-2 rounded">
      Register
    </button>

    <p class="mt-3 text-sm">
      Đã có tài khoản?
      <router-link to="/" class="text-blue-500">Đăng nhập</router-link>
    </p>
  </div>
</template>