<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import englishPreview from '../../../intro/index/main.png';
import chinesePreview from '../../../zh/intro/index/main.zh.png';

const { lang } = useData();
const isChinese = computed(() => lang.value.startsWith('zh'));
const label = computed(() => (isChinese.value ? '界面预览' : 'Interface preview'));
const alt = computed(() =>
  isChinese.value ? 'Landscape Router 管理界面' : 'Landscape Router dashboard',
);
const image = computed(() => (isChinese.value ? chinesePreview : englishPreview));
</script>

<template>
  <section class="home-preview" :aria-label="label">
    <div class="home-preview__container">
      <img :src="image" :alt="alt" />
    </div>
  </section>
</template>

<style scoped>
.home-preview {
  padding: 0 24px 48px;
}

.home-preview__container {
  margin: 0 auto;
  max-width: 1152px;
}

img {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  width: 100%;
  height: auto;
  cursor: zoom-in;
}

@media (min-width: 640px) {
  .home-preview {
    padding: 0 48px 64px;
  }
}

@media (min-width: 960px) {
  .home-preview {
    padding: 0 64px 64px;
  }
}
</style>
