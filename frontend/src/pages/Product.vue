<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import { Pencil, Trash2 } from "lucide-vue-next";
import { formatMoney } from "../utils/format";

// ===== DATA =====
const list = ref([]);
const categories = ref([]);

const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const keyword = ref("");

const form = ref({
  name: "",
  category: "",
  price: 0,
  stock: 0
});

// ===== LOAD DATA =====
const getData = async () => {
  list.value = (await api.get("/products")).data;
};

const getCategory = async () => {
  categories.value = (await api.get("/categories")).data;
};

// ===== SEARCH =====
const filteredList = computed(() => {
  return list.value.filter(p =>
    p.name.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

// ===== ADD =====
const openAdd = () => {
  isEdit.value = false;
  form.value = {
    name: "",
    category: "",
    price: 0,
    stock: 0
  };
  showModal.value = true;
};

// ===== EDIT =====
const openEdit = (item) => {
  isEdit.value = true;
  editId.value = item._id;

  form.value = { ...item };

  showModal.value = true;
};

// ===== SAVE =====
const save = async () => {
  if (!form.value.name) return alert("Nhập tên sản phẩm");

  if (isEdit.value) {
    await api.put("/products/" + editId.value, form.value);
  } else {
    await api.post("/products", form.value);
  }

  showModal.value = false;
  getData();
};

// ===== DELETE =====
const del = async (id) => {
  if (!confirm("Xoá sản phẩm?")) return;

  await api.delete("/products/" + id);
  getData();
};

onMounted(() => {
  getData();
  getCategory();
});
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý sản phẩm</h1>

      <button
        @click="openAdd"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        + Thêm sản phẩm
      </button>
    </div>

    <!-- BOX -->
    <div class="bg-white rounded-xl shadow p-5">

      <!-- SEARCH -->
      <input
        v-model="keyword"
        placeholder="🔍 Tìm kiếm sản phẩm..."
        class="border p-2 w-full rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- TABLE -->
      <table class="w-full text-left border-collapse">
        <thead class="text-gray-500 border-b">
          <tr>
            <th class="p-3">TÊN SẢN PHẨM</th>
            <th>DANH MỤC</th>
            <th>GIÁ</th>
            <th>TỒN KHO</th>
            <th class="text-center">HÀNH ĐỘNG</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in filteredList"
            :key="p._id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-3 font-semibold">{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td class="text-blue-600 font-medium">
              {{ formatMoney(p.price) }}
            </td>
            <td>
              <span
                :class="p.stock === 0 ? 'text-red-500 font-bold' : ''"
              >
                {{ p.stock }}
              </span>
            </td>

            <!-- ACTION -->
            <td>
              <div class="flex justify-center gap-3 items-center">
                <Pencil
                  @click="openEdit(p)"
                  class="text-blue-500 cursor-pointer hover:scale-110"
                  size="18"
                />
                <Trash2
                  @click="del(p._id)"
                  class="text-red-500 cursor-pointer hover:scale-110"
                  size="18"
                />
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredList.length === 0">
            <td colspan="5" class="text-center p-4 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white w-96 rounded-xl p-6 shadow-lg">
        <h2 class="text-lg font-bold mb-4">
          {{ isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm" }}
        </h2>

        <input
          v-model="form.name"
          placeholder="Tên sản phẩm"
          class="border p-2 w-full rounded mb-3"
        />

        <!-- CATEGORY -->
        <select
          v-model="form.category"
          class="border p-2 w-full rounded mb-3"
        >
          <option value="">Chọn danh mục</option>
          <option
            v-for="c in categories"
            :key="c._id"
            :value="c.name"
          >
            {{ c.name }}
          </option>
        </select>

        <input
          v-model="form.price"
          type="number"
          placeholder="Giá"
          class="border p-2 w-full rounded mb-3"
        />

        <input
          v-model="form.stock"
          type="number"
          placeholder="Tồn kho"
          class="border p-2 w-full rounded mb-3"
        />

        <div class="flex justify-end gap-2">
          <button
            @click="showModal = false"
            class="px-4 py-2 border rounded"
          >
            Huỷ
          </button>

          <button
            @click="save"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {{ isEdit ? "Cập nhật" : "Lưu" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>