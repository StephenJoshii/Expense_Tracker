import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import App from './App.vue';
import { auth } from './firebase';

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/', component: App, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;