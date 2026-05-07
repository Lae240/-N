<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import { Pencil, Trash2 } from "lucide-vue-next";

// ===== DATA =====
const list = ref([]);
const keyword = ref("");

const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  name: "",
  description: ""
});

// ===== LOAD =====
const getData = async () => {
  list.value = (await api.get("/categories")).data;
};

// ===== SEARCH =====
const filteredList = computed(() => {
  return list.value.filter(c =>
    c.name.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

// ===== ADD =====
const openAdd = () => {
  isEdit.value = false;
  form.value = { name: "", description: "" };
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
  if (!form.value.name) return alert("Nhập tên danh mục");

  if (isEdit.value) {
    await api.put("/categories/" + editId.value, form.value);
  } else {
    await api.post("/categories", form.value);
  }

  showModal.value = false;
  getData();
};

// ===== DELETE =====
const del = async (id) => {
  if (!confirm("Xoá danh mục?")) return;

  await api.delete("/categories/" + id);
  getData();
};

onMounted(getData);
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý danh mục</h1>

      <button
        @click="openAdd"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        + Thêm danh mục
      </button>
    </div>

    <!-- BOX -->
    <div class="bg-white rounded-xl shadow p-5">

      <!-- SEARCH -->
      <input
        v-model="keyword"
        placeholder="🔍 Tìm kiếm danh mục..."
        class="border p-2 w-full rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- LIST -->
      <div
        v-for="c in filteredList"
        :key="c._id"
        class="flex justify-between items-center border-b py-4 hover:bg-gray-50 px-2 rounded transition"
      >
        <!-- LEFT -->
        <div class="flex gap-4 items-center">
          <div class="bg-purple-100 p-3 rounded-lg text-lg">🏷</div>

          <div>
            <p class="font-semibold text-lg">{{ c.name }}</p>

            <p class="text-gray-500 text-sm">
              {{ c.description || "Không có mô tả" }}
            </p>

            <p class="text-gray-400 text-xs">
              Tạo ngày:
              {{ new Date(c.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="flex gap-4 items-center">
          <Pencil
            @click="openEdit(c)"
            class="text-blue-500 cursor-pointer hover:scale-110 transition"
            size="18"
          />

          <Trash2
            @click="del(c._id)"
            class="text-red-500 cursor-pointer hover:scale-110 transition"
            size="18"
          />
        </div>
      </div>

      <!-- EMPTY -->
      <div
        v-if="filteredList.length === 0"
        class="text-center text-gray-400 py-6"
      >
        Không tìm thấy danh mục
      </div>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white w-96 rounded-xl p-6 shadow-lg">
        <h2 class="text-lg font-bold mb-4">
          {{ isEdit ? "Cập nhật danh mục" : "Thêm danh mục" }}
        </h2>

        <input
          v-model="form.name"
          placeholder="Tên danh mục"
          class="border p-2 w-full rounded mb-3"
        />

        <textarea
          v-model="form.description"
          placeholder="Mô tả"
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