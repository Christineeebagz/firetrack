<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "auth",
});

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeToTerms = ref(false);

const handleSignup = () => {
  // Handle signup logic here
  console.log("Signup with:", {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="w-full max-w-lg p-8 bg-white border border-gray-200 shadow-sm">
      <h1 class="text-3xl font-bold text-center text-gray-800">
        Create Account
      </h1>
      <p class="text-center text-gray-600 mb-4">
        Please fill in your information
      </p>

      <form @submit.prevent="handleSignup">
        <div class="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >First Name</label
            >
            <input
              id="first-name"
              v-model="firstName"
              type="text"
              class="w-full px-3 py-2 bg-gray-100 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              placeholder="First Name"
              required
            />
          </div>

          <div>
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Last Name</label
            >
            <input
              id="last-name"
              v-model="lastName"
              type="text"
              class="w-full px-3 py-2 bg-gray-100 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        <div class="mb-2">
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
            placeholder="Create a password"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </p>
        </div>

        <div class="mb-4">
          <label
            for="confirm-password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Confirm Password</label
          >
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            class="w-full px-3 py-2 bg-gray-100 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
        >
          Create Account
        </button>
      </form>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-500">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-blue-500"
            >Log In</NuxtLink
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
