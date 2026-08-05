import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import Viewer from 'viewerjs';
import { useRoute } from 'vitepress';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';
import { h, nextTick, onMounted, watch } from 'vue';
import HomePreview from './components/HomePreview.vue';
import './style.css';

let viewer = null;

const defaultBaseOption = {
  navbar: false,
  title: false,
  toolbar: {
    zoomIn: 4,
    zoomOut: 4,
    prev: 4,
    next: 4,
    reset: 4,
    oneToOne: 4,
  },
};

function setViewer(el = '.vp-doc', option?) {
  viewer?.destroy();
  const container = document.querySelector(el);
  if (container) {
    viewer = new Viewer(container, { ...defaultBaseOption, ...option });
  }
}

function refreshViewer() {
  setViewer(document.querySelector('.VPHome') ? '.VPHome' : '.vp-doc');
}

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-features-before': () => h(HomePreview),
    }),
  enhanceApp({ app }) {
    enhanceAppWithTabs(app);
  },
  setup() {
    const route = useRoute();

    onMounted(() => {
      refreshViewer();

      const container = document.querySelector('.vp-doc');
      if (container) {
        let debounceTimer = null;
        const observer = new MutationObserver(() => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => refreshViewer(), 200);
        });
        observer.observe(container, { childList: true, subtree: true });
      }
    });

    watch(
      () => route.path,
      () => nextTick(() => refreshViewer()),
    );
  },
};
