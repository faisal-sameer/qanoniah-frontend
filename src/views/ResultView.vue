<!-- /src/views/ResultView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <span class="text-blue-500 mr-2">📊</span>
            Job Results:
            <span class="font-mono text-blue-600 ml-2">{{ jobId }}</span>
          </h2>
          <span
            class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
          >
            Completed
          </span>
        </div>

        <div
          v-if="!result"
          class="flex flex-col items-center justify-center py-12"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
          ></div>
          <p class="text-gray-600">Loading temperature data...</p>
        </div>
      </div>

      <div v-if="result" class="bg-white rounded-xl shadow-md p-6">
        <TemperatureChart :result="result" />

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(cityData, city) in result"
            :key="city"
            class="border rounded-lg p-4 hover:shadow-md transition"
          >
            <h3 class="font-bold text-lg text-gray-800 mb-2">{{ city }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Min Temp:</span>
                <span class="font-medium text-blue-600"
                  >{{ cityData.min }}°C</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Max Temp:</span>
                <span class="font-medium text-red-600"
                  >{{ cityData.max }}°C</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Average:</span>
                <span class="font-medium text-green-600"
                  >{{ cityData.avg }}°C</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/axios";
import TemperatureChart from "@/components/TemperatureChart.vue";

const route = useRoute();
const jobId = route.params.jobId;
const result = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`/api/jobs/${jobId}/result`);
    result.value = res.data.result;
  } catch (err) {
    console.error("❌ Failed to fetch results", err);
  }
});
</script>
