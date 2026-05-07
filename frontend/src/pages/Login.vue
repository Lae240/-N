<script setup>
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const login = async () => {
  try {
    await api.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem("isLogin", "true");
    router.push("/dashboard");
  } catch {
    alert("Sai tài khoản");
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow w-80">
    <h2 class="font-bold mb-4 text-lg">Đăng nhập</h2>

    <input v-model="username" placeholder="Username" class="border p-2 w-full mb-3 rounded"/>
    <input v-model="password" type="password" placeholder="Password" class="border p-2 w-full mb-3 rounded"/>

    <button @click="login" class="bg-blue-600 text-white w-full p-2 rounded">
      Login
    </button>

    <p class="mt-3 text-sm">
      Chưa có tài khoản?
      <router-link to="/register" class="text-blue-500">Đăng ký</router-link>
    </p>
  </div>
</template>