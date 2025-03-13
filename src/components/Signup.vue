<template>
    <div class="auth-container">
      <h2>Signup</h2>
      <form @submit.prevent="signup" class="auth-form">
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter password" />
        </div>
        <button type="submit" class="btn">Signup</button>
      </form>
      <p class="auth-text">Already have an account? <button @click="goToLogin" class="link-btn">Login</button></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  const toast = useToast();
  
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      toast.success('Signup successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const goToLogin = () => {
    router.push('/login');
  };
  </script>