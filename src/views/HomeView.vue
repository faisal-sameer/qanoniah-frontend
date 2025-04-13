<!-- /src/views/HomeView.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800">
          Generate Temperature Records
        </h2>
        <p class="text-gray-600 mt-2">
          Enter the number of records to generate
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label
            for="record-count"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Record Count
          </label>
          <input
            id="record-count"
            v-model="count"
            type="number"
            min="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter count"
          />
        </div>

        <button
          @click="submitJob"
          :disabled="!count"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out transform hover:scale-[1.02] disabled:transform-none"
        >
          Start Generation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/axios";
import { useRouter } from "vue-router";

const count = ref(100);
const router = useRouter();

async function submitJob() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.post(
      "/api/jobs",
      { rows: count.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jobId = response.data.job_id;
    router.push({ name: "Progress", params: { jobId } });
  } catch (error) {
    alert("❌ Failed to start job");
    console.error(error);
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
}
</style>
