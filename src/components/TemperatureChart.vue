<!-- /src/components/TemperatureChart.vue -->
<template>
  <div class="chart-container relative h-96 w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  result: Object,
});

const chartCanvas = ref(null);
let chartInstance = null;

function renderChart() {
  const labels = Object.keys(props.result);
  const minData = labels.map((city) => props.result[city].min);
  const maxData = labels.map((city) => props.result[city].max);
  const avgData = labels.map((city) => props.result[city].avg);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Min Temp (°C)",
          data: minData,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
        {
          label: "Max Temp (°C)",
          data: maxData,
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
        },
        {
          label: "Avg Temp (°C)",
          data: avgData,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}°C`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Temperature (°C)",
            font: {
              size: 14,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Cities",
            font: {
              size: 14,
            },
          },
        },
      },
    },
  });
}

watch(() => props.result, renderChart);
onMounted(renderChart);
</script>

<style scoped>
.chart-container {
  min-height: 24rem;
}
</style>
