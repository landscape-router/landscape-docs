import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import { useRoute } from 'vitepress';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app);
  },
  setup() {
    const route = useRoute();
    imageViewer(route);
  },
};
