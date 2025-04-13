<!-- /src/views/ProgressView.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6 text-center"
    >
      <div class="flex justify-center mb-4">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
          v-if="!done"
        ></div>
        <div class="text-green-500 text-5xl" v-else>✓</div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800">
        <span v-if="!done">⏳ Processing Job:</span>
        <span v-else>✅ Processing Complete!</span>
        <span class="block mt-2 text-blue-600 font-mono">{{ jobId }}</span>
      </h2>

      <div class="py-4">
        <p v-if="!done" class="text-gray-600">
          Generating your temperature records... Please keep this page open.
          <span class="block mt-2 text-sm text-gray-500"
            >This may take a few moments</span
          >
        </p>
        <p v-else class="text-green-600 font-medium">
          Results are ready! Redirecting you to the report...
          <span class="block mt-2 text-sm text-gray-500">Just a second</span>
        </p>
      </div>

      <div v-if="!done" class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-600 h-2.5 rounded-full animate-pulse"
          style="width: 80%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import Pusher from "pusher-js";

const route = useRoute();
const router = useRouter();
const jobId = route.params.jobId;
const done = ref(false);

onMounted(() => {
  const pusher = new Pusher("local", {
    wsHost: "127.0.0.1",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws"],
    cluster: "mt1",
  });

  const channel = pusher.subscribe(`job.${jobId}`);
  channel.bind("JobCompleted", function () {
    done.value = true;
    setTimeout(() => {
      router.push({ name: "Result", params: { jobId } });
    }, 1000);
  });

  setTimeout(pollForResult, 5000);
});

const pollForResult = async () => {
  try {
    const res = await axios.get(`/api/jobs/${jobId}/result`);
    if (res.data.result) {
      router.push({ name: "Result", params: { jobId } });
    } else {
      setTimeout(pollForResult, 3000);
    }
  } catch (err) {
    setTimeout(pollForResult, 3000);
  }
};
</script>

<style scoped>
.progress {
  padding: 2rem;
}
</style>
