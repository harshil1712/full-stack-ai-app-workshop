# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Framework Enhancement" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Install `hono`

```sh
npm i hono
```

2. Import `hono` and initialize a new app.

```ts
import { Hono } from 'hono';

const app = new Hono<{Bindings:Env}>();

export default app;
```

3. Migrate the endpoints to Hono.
4. Add and configure the [Bearer Auth Middleware](). You will use this to protect your `/api/generate` endpoints.
5. Create a `.dev.vars` file to store secrets securely.
6. Add `BEARER_TOKEN` to your `.dev.vars` file. You will use this token to make authenticated request to your API endpoints.
7. Run the typegen command to generate types.
```sh
npm run cf-typegen
```
8. Run the development server

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

- [Hono](https://hono.dev)
- [The story of web framework Hono, from the creator of Hono](https://blog.cloudflare.com/the-story-of-web-framework-hono-from-the-creator-of-hono/)