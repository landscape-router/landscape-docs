import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import { useRoute } from 'vitepress';

export default {
    ...DefaultTheme,
    setup() {
        // Get route
        const route = useRoute();
        // Using
        imageViewer(route);
    }
};
