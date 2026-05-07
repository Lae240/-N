<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const logout = () => {
  if (!confirm("Bạn có chắc muốn đăng xuất?")) return;

  localStorage.removeItem("isLogin");
  router.push("/");
};

// check active
const isActive = (path) => route.path === path;
</script>

<template>
  <div class="sidebar">
    
    <!-- TOP -->
    <div>
      <h1 class="logo">Quản lý đơn hàng</h1>

      <ul>
        <li
          @click="router.push('/dashboard')"
          :class="['menu-item', isActive('/dashboard') && 'active']"
        >
          Dashboard
        </li>

        <li
          @click="router.push('/category')"
          :class="['menu-item', isActive('/category') && 'active']"
        >
          Danh mục
        </li>

        <li
          @click="router.push('/product')"
          :class="['menu-item', isActive('/product') && 'active']"
        >
          Sản phẩm
        </li>

        <li
          @click="router.push('/order')"
          :class="['menu-item', isActive('/order') && 'active']"
        >
          Đơn hàng
        </li>
      </ul>
    </div>

    <!-- BOTTOM -->
    <div class="p-4">
      <button @click="logout" class="logout-btn">
        Đăng xuất
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  background: white;
  border-right: 1px solid #eee;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  padding: 16px;
  font-weight: bold;
  font-size: 18px;
}

/* MENU */
.menu-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: 0.2s;
}

.menu-item:hover {
  background: #f3f4f6;
}

/* ACTIVE */
.menu-item.active {
  background: #e0e7ff;
  color: #3b82f6;
  font-weight: 600;
  border-left: 4px solid #3b82f6;
}

/* LOGOUT */
.logout-btn {
  width: 100%;
  background: #ef4444;
  color: white;
  padding: 10px;
  border-radius: 8px;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>