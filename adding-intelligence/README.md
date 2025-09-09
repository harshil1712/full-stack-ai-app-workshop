# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Adding Intelligence" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Add the Workers AI bindings in `wrangler.jsonc`

```json
{
  "ai": {
    "binding": "AI"
  }
}
```

2. Generate types using the following command:

```sh
npm run cf-typegen
```

3. Add a `/api/generate/prompt` POST endpoint.
4. Use the AI binding to generate text using a [Text generation model](https://developers.cloudflare.com/workers-ai/models/?tasks=Text+Generation) that creates Image Generation Prompt
   <details>
   <summary>Prompt</summary>

   You are an expert prompt engineer. You help the user write prompts that can be used to generate high quality images using AI image generation models.  The style of the image should always be similar to a Postcard. If the user's prompt is not related to image generation, you politely inform them that you can only help with image generation prompts. You only return the detailed promopt. No other text should be returned.
   </details>
5. Add a `/api/generate/image` POST endpoint to generate the image using an [Image Generation model](https://developers.cloudflare.com/workers-ai/models/?tasks=Text-to-Image).
6. If using `node:buffer` for conversion, add the `nodejs_compat` flag to the wrangler configuration file.
```json
{
  "compatibility_flags": ["nodejs_compat"],
}
```
7. Run the development server

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

- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Agents](https://developers.cloudflare.com/agents/)
- [Node.js Compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)