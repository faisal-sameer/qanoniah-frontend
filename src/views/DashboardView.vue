<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1
            class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center"
          >
            <span class="text-blue-500 mr-3">📊</span>
            Job Dashboard
          </h1>
          <p class="text-gray-600 mt-1">
            Overview of all generated temperature records
          </p>
        </div>
        <div class="mt-4 md:mt-0">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
          >
            Total Jobs: {{ jobs.length }}
          </span>
        </div>
      </div>

      <div class="bg-white shadow-sm rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rows Generated
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>

                <th class="...">Exec Time</th>
                <th class="...">Memory</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="job in jobs"
                :key="job.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-blue-600">
                    {{ job.job_id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ job.rows.toLocaleString() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ formatDate(job.created_at) }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ timeSince(job.created_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    Completed
                  </span>
                </td>

                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ job.metrics?.execution_time ?? "-" }}s
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ job.metrics?.memory_usage?.toLocaleString() ?? "-" }} KB
                </td>

                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    @click="viewJob(job.job_id)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    @click="downloadJob(job.job_id)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="jobs.length === 0" class="text-center py-12">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">No jobs found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by generating some temperature records.
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing <span class="font-medium">1</span> to
          <span class="font-medium">{{ jobs.length }}</span> of
          <span class="font-medium">{{ jobs.length }}</span> results
        </div>
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button
            class="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "@/axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const jobs = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  jobs.value = res.data;
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minute${interval === 1 ? "" : "s"} ago`;
  return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
}

function viewJob(jobId) {
  router.push({ name: "Result", params: { jobId } });
}

function downloadJob(jobId) {
  window.open(`http://127.0.0.1:8000/api/jobs/${jobId}/download`, "_blank");
}
</script>
