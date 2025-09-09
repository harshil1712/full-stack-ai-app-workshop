# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Modern Frontend" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Install the following dependencies.
```sh
npm i -D @cloudflare/vite-plugin @vitejs/plugin-react
npm i react react-dom
```
2. Create a `vite.config.ts` file.
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
});
```
3. Update `assets` bindings in the `wrangler.jsonc` file.
   ```json
   {
    "assets": {
		"not_found_handling": "single-page-application"
	},
   }
   ```
4. Update the scripts in `package.json`
   ```json
   {
      "scripts": {
         "deploy": "npm run build && wrangler deploy",
         "dev": "vite",
         "build": "tsc -b && vite build",
         "preview": "npm run build && vite preview",
      },
   }
   ```
5. Move the `src/index.ts` file to `worker/index.ts`.
6. Update the `main` attribute in the `wrangler.jsonc` file.
7. Create `App.tsx` and `main.ts` in the `src/` directory.
   <details>
      <summary>App.tsx</summary>
      ```tsx
      function App() {
         return (
            <>
               <h1>Hello world!</h1>
            </>
         );
      }

      export default App;
      ```
   </details>

   <details>
      <summary>main.tsx</summary>
      ```tsx
      import { StrictMode } from 'react';
      import { createRoot } from 'react-dom/client';
      import App from './App.tsx';

      createRoot(document.getElementById('root')!).render(
         <StrictMode>
            <App />
         </StrictMode>
      );
      ```
   </details>

8. Add an `index.html` file in the root.
   <details>
      <summary>index.html</summary>
      ```html
      <!DOCTYPE html>
      <html lang="en">
         <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>World Postcards</title>
         </head>
         <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
         </body>
      </html>
      ```
   </details>
9. Empty the `public` directory.
10. Add the UI code.
11. Run the development server

```sh
npm run dev
```

## Deploy

To deploy your Worker:

```sh
npm run deploy
```

**NOTE**: If not logged-in, you will be asked to login to your Cloudflare account. If you are a part of multiple Cloudflare organization, you can select the organization you want to deploy this to.

## Resources

- [Cloudflare Vite Plugin](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)