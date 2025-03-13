<template>
    <div class="auth-container">
      <h2>Login</h2>
      <form @submit.prevent="login" class="auth-form">
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter password" />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <button @click="googleSignIn" class="btn google-btn">Sign in with Google</button>
      <p class="auth-text">Don't have an account? <button @click="goToSignup" class="link-btn">Signup</button></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  const toast = useToast();
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const goToSignup = () => {
    router.push('/signup');
  };
  
  const provider = new GoogleAuthProvider();
  
  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success('Google Sign-in successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };
  </script>