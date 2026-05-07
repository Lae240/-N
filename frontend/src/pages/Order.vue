<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api/axios";
import Modal from "../components/Modal.vue";
import { formatMoney } from "../utils/format";

// ===== DATA =====
const list = ref([]);
const products = ref([]);
const showModal = ref(false);

const form = ref({
  productId: "",
  quantity: 1
});

// ===== LOAD DATA =====
const getData = async () => {
  const res = await api.get("/orders");
  list.value = res.data;
};

const getProducts = async () => {
  const res = await api.get("/products");
  products.value = res.data;
};

// ===== TÍNH TIỀN =====
const selectedProduct = computed(() => {
  return products.value.find(p => p._id === form.value.productId);
});

const totalPreview = computed(() => {
  if (!selectedProduct.value) return 0;
  return selectedProduct.value.price * form.value.quantity;
});

// ===== MỞ MODAL =====
const openModal = () => {
  form.value = {
    productId: "",
    quantity: 1
  };
  showModal.value = true;
};

// ===== TẠO ĐƠN =====
const save = async () => {
  if (!form.value.productId) {
    return alert("Vui lòng chọn sản phẩm");
  }

  if (form.value.quantity <= 0) {
    return alert("Số lượng phải > 0");
  }

  try {
    await api.post("/orders", form.value);

    alert("Tạo đơn thành công");

    showModal.value = false;
    getData();
  } catch (err) {
    alert(err.response?.data || "Có lỗi xảy ra");
  }
};

// ===== XOÁ =====
const del = async (id) => {
  if (!confirm("Bạn có chắc muốn xoá?")) return;

  await api.delete("/orders/" + id);
  alert("Đã xoá");
  getData();
};

// ===== UPDATE STATUS =====
const updateStatus = async (order) => {
  try {
    await api.put("/orders/" + order._id, {
      status: order.status
    });
  } catch (err) {
    alert("Lỗi cập nhật");
  }
};

// ===== INIT =====
onMounted(() => {
  getData();
  getProducts();
});
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between mb-4">
      <h1 class="text-xl font-bold">Quản lý đơn hàng</h1>

      <button
        @click="openModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Thêm đơn hàng
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl shadow p-4">
      <table class="w-full text-center">
        <thead class="text-gray-500">
          <tr>
            <th>MÃ</th>
            <th>SẢN PHẨM</th>
            <th>SỐ LƯỢNG</th>
            <th>TỔNG TIỀN</th>
            <th>TRẠNG THÁI</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in list" :key="o._id" class="border-t">
            <td>#{{ o._id.slice(-2) }}</td>
            <td>{{ o.productId?.name }}</td>
            <td>{{ o.quantity }}</td>

            <!-- TIỀN -->
            <td class="font-semibold">
              {{ formatMoney(o.total) }}
            </td>

            <!-- STATUS -->
            <td>
              <select
                v-model="o.status"
                @change="updateStatus(o)"
                class="border rounded px-2 py-1"
              >
                <option>Đang xử lý</option>
                <option>Đã giao</option>
              </select>
            </td>

            <!-- DELETE -->
            <td>
              <button
                @click="del(o._id)"
                class="text-red-500"
              >
                Xoá
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- EMPTY -->
      <div v-if="list.length === 0" class="text-center py-4 text-gray-400">
        Không có đơn hàng
      </div>
    </div>

    <!-- MODAL -->
    <Modal v-if="showModal" @close="showModal = false">
      <h2 class="font-bold mb-4">Thêm đơn hàng</h2>

      <!-- CHỌN SẢN PHẨM -->
      <select v-model="form.productId" class="border p-2 w-full mb-3">
        <option value="">Chọn sản phẩm</option>

        <option
          v-for="p in products"
          :key="p._id"
          :value="p._id"
          :disabled="p.stock === 0"
        >
          {{ p.name }} - {{ formatMoney(p.price) }} (Kho: {{ p.stock }})
        </option>
      </select>

      <!-- SỐ LƯỢNG -->
      <input
        type="number"
        v-model.number="form.quantity"
        class="border p-2 w-full mb-3"
        placeholder="Số lượng"
      />

      <!-- TỔNG -->
      <p class="mb-3 font-semibold">
        Tổng tiền: {{ formatMoney(totalPreview) }}
      </p>

      <div class="flex justify-end gap-2">
        <button
          @click="showModal = false"
          class="border px-4 py-2"
        >
          Huỷ
        </button>

        <button
          @click="save"
          class="bg-blue-600 text-white px-4 py-2"
        >
          Lưu
        </button>
      </div>
    </Modal>
  </div>
</template>