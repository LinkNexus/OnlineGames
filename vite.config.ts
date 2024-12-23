import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import path from "path"

/* if you're using React */
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        reactPlugin(), // if you're using React
        symfonyPlugin({
            stimulus: true
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.ts"
            },
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./assets"),
        },
    },
});