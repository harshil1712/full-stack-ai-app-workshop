# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Getting Started" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Create a new Worker project using the following command

```sh
npm create cloudflare@latest
```

2. Enter project name: `cf-ai-app-workshop`
3. Select `Hello World example`
4. Select `Worker only`
5. Select `TypeScript`
6. Enter `Yes` when asked to use git.
7. Navigate into the project directory

```sh
cd ./cf-ai-app-workshop
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

