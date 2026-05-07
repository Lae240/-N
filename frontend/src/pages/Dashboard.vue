<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { formatMoney } from "../utils/format";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const orders = ref([]);
const products = ref([]);

const totalRevenue = ref(0);
const totalOrders = ref(0);
const totalProducts = ref(0);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Doanh thu",
      data: [],
      backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
      borderRadius: 8
    }
  ]
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    },
    tooltip: {
      callbacks: {
        label: (ctx) => formatMoney(ctx.raw)
      }
    }
  }
};

const loadData = async () => {
  const orderRes = await api.get("/orders");
  const productRes = await api.get("/products");

  orders.value = orderRes.data;
  products.value = productRes.data;

  totalProducts.value = products.value.length;
  totalOrders.value = orders.value.length;

  totalRevenue.value = orders.value.reduce((sum, o) => sum + o.total, 0);

  // FIX CHART
  const labels = [];
  const data = [];

  orders.value.forEach(o => {
    if (!o.productId) return;

    const name = o.productId.name;
    const total = o.total || 0;

    const index = labels.indexOf(name);

    if (index === -1) {
      labels.push(name);
      data.push(total);
    } else {
      data[index] += total;
    }
  });

  chartData.value = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data,
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
        borderRadius: 8
      }
    ]
  };
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    <!-- CARDS -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500">Tổng doanh thu</p>
        <h2 class="text-xl font-bold">
          {{ formatMoney(totalRevenue) }}
        </h2>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500">Tổng bán ra</p>
        <h2 class="text-xl font-bold">{{ totalOrders }}</h2>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500">Sản phẩm</p>
        <h2 class="text-xl font-bold">{{ totalProducts }}</h2>
      </div>
    </div>

    <!-- CHART -->
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="mb-4 font-bold text-lg">
        Doanh thu theo sản phẩm
      </h2>

      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>