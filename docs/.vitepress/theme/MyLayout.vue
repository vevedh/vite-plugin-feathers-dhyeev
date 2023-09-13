<script setup lang="ts">
import { Content, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'


import { nextTick, onMounted, onUpdated, provide } from 'vue'


const { site, frontmatter , isDark, page } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )

  //console.log('Page :',page)
})
/*
onMounted(() => {
  console.log('On load Layout :',page)
})
onUpdated(() => {
  console.log('On update Layout :',page)
})*/
</script>

<template>
  <DefaultTheme.Layout v-if="frontmatter.layout === 'home'" >
    <template #layout-top>
        
    </template>
    <template #nav-bar-title-before>
        <!--<q-icon class="animate-bounce q-px-md" name="home" size="md"></q-icon>-->
    </template>
    <template #nav-bar-title-after>
       
    </template>
    <template #home-hero-before>
      
    </template>
  </DefaultTheme.Layout>
  <DefaultTheme.Layout v-if="page.filePath === 'pages/databases.md'">
   <!--<Content />-->
  </DefaultTheme.Layout>
  <!--<DefaultTheme.Layout v-else-if="page.filePath.includes('pages/col-')">
   <Content />
  </DefaultTheme.Layout>-->
  <DefaultTheme.Layout v-else>
    
    <template #nav-bar-title-before>
        <!--<q-icon name="note" class="q-px-md" size="sm"></q-icon>-->
    </template>
    
  </DefaultTheme.Layout>
  
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>