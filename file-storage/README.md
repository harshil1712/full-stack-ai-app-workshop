# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "File Stroage" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Create a new R2 bucket
```sh
npx wrangler r2 bucket create ai-app-bucket
```

2. When prompted with the question - "Would you like Wrangler to add it on your behalf?", select "Yes, but let me choose the binding name".
3. Enter `BUCKET` as the binding name. This will add the required binding to your `wrangler.jsonc` file.
4. Execute the following command to generate the types:
```sh
npm run cf-typegen
```
5. Update the `/api/generate/image/:id` endpoint to save the generated image in the R2 bucket.
6. Update the `postcards` table to add an `image_key` column.
   1. Create a new migration using the following command.
    ```sh
    npx wrangler d1 migrations create DB image-key
    ```
   2. Add the following SQL statement in the new migration file.
    ```sql
    ALTER TABLE postcards ADD COLUMN image_key TEXT;
    ```
   3. Apply the migration using the following command:
    ```sh
    npx wrangler d1 migrations apply DB
    ```
   4.  Verify the table was created using the following command:
    ```sh
    npx wrangler d1 execute DB --command="PRAGMA table_info(postcards)"
    ```
7.  Update the `/api/generate/image/:id` endpoint to store the file name in the db.
8.  Create a GET endpoint to get the generated image for a specific ID - `/api/image/:id`.
9.  Run the development server

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

- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [R2 Pricing Calculator](https://r2-calculator.cloudflare.com/)
- [How R2 works](https://developers.cloudflare.com/r2/how-r2-works/)