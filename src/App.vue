<template>
  <Header />
  <div class="container">
    <Balance :total="total" />
    <IncomeExpenses :income="+income" :expenses="+expenses" />
    <TransactionList
      :transactions="transactions"
      @transactionDeleted="handleTransactionDeleted"
    />
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import IncomeExpenses from './components/IncomeExpenses.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const transactions = ref([]);

// Fetch transactions from the backend
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions');
    transactions.value = response.data;
  } catch (error) {
    toast.error('Failed to fetch transactions');
    console.error(error);
  }
});

// Get total
const total = computed(() => {
  return transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
});

// Get income
const income = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

// Get expenses
const expenses = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

// Handle submitting a new transaction
const handleTransactionSubmitted = async (transactionData) => {
  try {
    const response = await axios.post('http://localhost:3000/transactions', {
      text: transactionData.text,
      amount: transactionData.amount,
    });

    transactions.value.push(response.data);
    toast.success('Transaction added.');
  } catch (error) {
    toast.error('Failed to add transaction');
    console.error(error);
  }
};

// Handle deleting a transaction
const handleTransactionDeleted = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/transactions/${id}`);
    transactions.value = transactions.value.filter((transaction) => transaction.id !== id);
    toast.success('Transaction deleted.');
  } catch (error) {
    toast.error('Failed to delete transaction');
    console.error(error);
  }
};
</script>
