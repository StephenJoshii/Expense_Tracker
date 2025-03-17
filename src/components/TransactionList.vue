<template>
  <h3>History</h3>
  <ul id="list" class="list">
    <li
      v-for="(transaction, index) in displayedTransactions"
      :key="transaction.id"
      :class="transaction.amount < 0 ? 'minus' : 'plus'"
    >
      {{ transaction.text }} <span>${{ transaction.amount }}</span>
      <button class="delete-btn" @click="deleteTransaction(transaction.id)">
        x
      </button>
    </li>
  </ul>
  <button v-if="props.transactions.length > 2" class="see-all-btn" @click="toggleShowAll">
    {{ showAll ? 'See Less' : 'See All' }}
  </button>
</template>

<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['transactionDeleted']);
const showAll = ref(false);

const deleteTransaction = (id) => {
  emit('transactionDeleted', id);
};

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const displayedTransactions = computed(() => {
  if (showAll.value) {
    return props.transactions;
  } else {
    return props.transactions.slice(-2);
  }
});
</script>

