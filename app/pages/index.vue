<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "landing",
});

// References for animation elements
const logoElement = ref(null);
const taglineElement = ref(null);
const buttonElement = ref(null);

onMounted(() => {
  const masterTimeline = gsap.timeline();

  if (logoElement.value) {
    masterTimeline.fromTo(
      logoElement.value,
      {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=0.4"
    );
  }

  if (taglineElement.value && buttonElement.value) {
    const elementsToAnimate = [
      taglineElement.value,
      buttonElement.value,
    ].filter((el: any) => el instanceof HTMLElement);

    if (elementsToAnimate.length > 0) {
      elementsToAnimate.forEach((el) => {
        console.log(
          `Before animation: ${el.className} opacity:`,
          getComputedStyle(el).opacity
        );
      });
      masterTimeline.fromTo(
        elementsToAnimate,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2 },
        "+=0.2"
      );
    }
  }
});
</script>

<template>
  <div class="landing-container">
    <div ref="container" class="content-wrapper">
      <!-- Logo with reveal animation -->
      <div class="logo-container">
        <div class="logo-reveal-wrapper">
          <img
            ref="logoElement"
            src="/images/firetrack-logo.png"
            alt="FireTrack Logo"
            class="logo"
          />
        </div>
      </div>

      <p ref="taglineElement" class="tagline">
        Track your fire, track your life
      </p>

      <button
        ref="buttonElement"
        class="get-started-btn rounded-xl drop-shadow-lg"
      >
        <NuxtLink to="/login" class="flex items-center py-3 px-8 font-medium">
          Get started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="arrow-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background-color: #8b0000; /* Dark red background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.content-wrapper {
  width: 100%;
  max-width: 64rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Roboto, sans-serif;
}

/* Initial state for animated elements */
.tagline,
.get-started-btn {
  opacity: 0;
}

.logo-container {
  width: 100%;
  max-width: 28rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.logo-reveal-wrapper {
  width: 100%;
  overflow: hidden;
}

.logo {
  width: 100%;
  height: auto;
}

.tagline {
  color: white;
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}

.get-started-btn {
  background: linear-gradient(to bottom, #ffcc00, #ff5e00);
  color: white;
  font-weight: 500;
  transition: transform 0.2s;
  text-decoration: none;
}

.get-started-btn:hover {
  transform: scale(1.05);
}

.arrow-icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-left: 0.5rem;
}

@media (min-width: 768px) {
  .landing-container {
    padding: 2rem;
  }
}
</style>
