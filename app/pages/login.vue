<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleLogin = () => {
  // Handle login logic here
  console.log("Login with:", {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="w-full max-w-lg p-8 bg-white border border-gray-200 shadow-sm">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">
        Welcome Back
      </h1>
      <p class="text-center text-gray-600 mb-6">Please log in to continue</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 bg-gray-100 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="mb-2">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2 bg-gray-100 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            placeholder="********"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </p>
        </div>

        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700"
              >Remember me</label
            >
          </div>

          <div>
            <a
              href="#"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
              >Forgot Password?</a
            >
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
        >
          Log In
        </button>
      </form>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-500">
          Don't have an account?
          <NuxtLink
            to="/signup"
            class="font-medium text-primary-600 hover:text-blue-500"
            >Sign Up</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
}
</style>
