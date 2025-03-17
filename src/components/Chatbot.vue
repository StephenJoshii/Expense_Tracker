<template>
  <div class="financial-insight">
    <div class="insight-content">
      <p class="insight-text" :class="{ loading: isLoading }">
        {{ insight }}
      </p>
      <button class="generate-btn" @click="fetchInsight">New Insight</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      insight: 'Loading financial insight...',
      isLoading: true,
    };
  },
  mounted() {
    this.fetchInsight();
  },
  methods: {
    async fetchInsight() {
      this.isLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/quote');
        this.insight = response.data.quote;
        this.isLoading = false;
      } catch (error) {
        console.error('Failed to fetch insight:', error);
        this.insight = 'Failed to load insight.';
        this.isLoading = false;
      }
    },
  },
};
</script>
