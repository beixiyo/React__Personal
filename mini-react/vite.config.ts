import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'


export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@myReact': resolve(__dirname, 'src/lib/react')
        }
    }
})
