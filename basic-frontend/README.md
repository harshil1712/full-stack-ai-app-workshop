# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Basic Frontend" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Create a new file `public/index.html`
2. Update the `wrangler.jsonc` to add [assets](https://developers.cloudflare.com/workers/static-assets/) bindings.
   ```json
   {
    "assets": {
		"directory": "./public/",
	},
   }
   ```
3. Add HTML code with a form to take the following input from the user:
   1. Bearer token
   2. City name
4. In the HTML, call the `/api/generate/prompt` endpoint, using the City name and the Bearer token to generate the image prompt.
5. Add a button that calls the `/api/generate/image/:id` endpoint that geneartes image for that prompt.
6. Render the generated image.
7. Create a new endpoint `/api/gallery`. This endpoint will return all the entries from the DB.
8. Create a new HTML file `gallery.html` to display all the generted postcard images. Use the above gallery endpoint.
9. Run the development server

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

- [Static Assets](https://developers.cloudflare.com/workers/static-assets/)
