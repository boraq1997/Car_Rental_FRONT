import auth from '../views/auth/auth.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Users from '../views/users/users.vue';
import Home from '../views/home/home.vue';
import Branches from '../views/branches/branches.vue';
import Vehicles from '../views/vehicles/vehicles.vue';

const routes = [
    {path: '/', name: '/login', component: auth},
    {path: '/home', name: 'home', component: Home},
    {path: '/users', name: 'users', component: Users},
    {path: '/branches', name: 'branches', component: Branches},
    {path: '/vehicles', name: 'vehicles', component: Vehicles},
];

// Create the Vue Router instance
const router = createRouter({
  // Use HTML5 history mode for client-side routing
  history: createWebHistory(),
  // Register the defined routes
  routes,
});

// Navigation guard to handle authentication
router.beforeEach((to, _from, next) => {
  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem('token');

  // Check if the route requires authentication and no token is present
  if (to.meta.requiresAuth && !token) {
    // Redirect to the login page
    next('/login');
  }
  // Check if the user is authenticated and trying to access the login page
  else if ((to.path === '/' || to.path === '/login') && token) {
    // Redirect to the home page
    next('/home');
  }
  // Allow navigation to proceed for all other cases
  else {
    next();
  }
});

// Export the router instance for use in the application
export default router;