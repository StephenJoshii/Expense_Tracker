<template>
  <div v-if="user">
    <button id="logout-button" @click="logout" class="btn">Logout</button>
    <Header />
    <div class="container">
      <Balance :total="total" />
      <div class="chatbot-container">
      <Chatbot />
    </div>
      <IncomeExpenses :income="+income" :expenses="+expenses" />
      <TransactionList
        :transactions="transactions"
        @transactionDeleted="handleTransactionDeleted"
      />
      <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script setup>
import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import Chatbot from './components/Chatbot.vue'; 
import IncomeExpenses from './components/IncomeExpenses.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const toast = useToast();

const transactions = ref([]);
const user = ref(null);
const router = useRouter();

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions', {
      headers: {
        authorization: auth.currentUser.uid,
      },
    });
    transactions.value = response.data;
  } catch (error) {
    toast.error('Failed to fetch transactions');
    console.error(error);
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (authUser) => {
    user.value = authUser;
    if (authUser) {
      fetchTransactions();
    }
  });
});

const total = computed(() => {
  return transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
});

const income = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

const expenses = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

const handleTransactionSubmitted = async (transactionData) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/transactions',
      {
        text: transactionData.text,
        amount: transactionData.amount,
      },
      {
        headers: {
          authorization: auth.currentUser.uid,
        },
      }
    );
    fetchTransactions();
    toast.success('Transaction added.');
  } catch (error) {
    toast.error('Failed to add transaction');
    console.error(error);
  }
};

const handleTransactionDeleted = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/transactions/${id}`, {
      headers: {
        authorization: auth.currentUser.uid,
      },
    });
    fetchTransactions();
    toast.success('Transaction deleted.');
  } catch (error) {
    toast.error('Failed to delete transaction');
    console.error(error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success('Logout successful!');
    router.push('/login');
  } catch (error) {
    toast.error(error.message);
  }
};
</script>