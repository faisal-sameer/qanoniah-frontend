<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-4">
          <router-link
            to="/"
            v-if="!hideButtons"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-100 transition-colors"
            active-class="bg-blue-50 text-blue-600"
          >
            <span class="mr-2">🏠</span> Home
          </router-link>

          <router-link
            to="/dashboard"
            v-if="!hideButtons"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-100 transition-colors"
            active-class="bg-blue-50 text-blue-600"
          >
            <span class="mr-2">📋</span> Dashboard
          </router-link>
        </div>

        <div class="flex items-center">
          <button
            v-if="!hideButtons"
            @click="logout"
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <span class="mr-2">🚪</span> Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

const jobId = route.params.jobId || localStorage.getItem("lastJobId");

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push({ name: "Login" });
}
const hideButtons = computed(() => {
  return ["Login", "Register"].includes(route.name);
});
</script>
