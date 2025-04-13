import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProgressView from '@/views/ProgressView.vue'
import ResultView from '@/views/ResultView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView   
    , meta: { requiresAuth: true },
},
  { path: '/progress/:jobId', name: 'Progress', component: ProgressView,meta: { requiresAuth: true },
},
  { path: '/result/:jobId', name: 'Result', component: ResultView,   
     meta: { requiresAuth: true },
},
{ path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },

  { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false, hideNavbar: true }
},
  { path: '/register', name: 'Register', component: RegisterView ,meta: { requiresAuth: false, hideNavbar: true }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// ✅ Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
