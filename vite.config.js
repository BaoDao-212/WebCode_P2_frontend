import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    optimizeDeps: {
        include: ['@vue/runtime-core'],
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: `import { h } from 'vue';`,
    },
    server: {
        port: 3000,
    },
    build: {
        outDir: 'dist',
        assetsDir: '',
    },
});
