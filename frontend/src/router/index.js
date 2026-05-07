import { createRouter, createWebHistory } from "vue-router";

// Pages
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import Category from "../pages/Category.vue";
import Product from "../pages/Product.vue";
import Order from "../pages/Order.vue";

// Layout
import MainLayout from "../layouts/MainLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const routes = [
  {
    path: "/",
    component: AuthLayout,
    children: [
      { path: "", component: Login },
      { path: "register", component: Register }
    ]
  },

  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "category", component: Category },
      { path: "product", component: Product },
      { path: "order", component: Order }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem("isLogin");

  if (!isLogin && to.path !== "/" && to.path !== "/register") {
    return next("/");
  }

  next();
});

export default router;