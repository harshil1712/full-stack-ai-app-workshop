# Building a Full-Stack AI Application on the Edge - Workshop

This repository contains the "Data Persistence" code and the instructions for the workshop - **Building a Full-Stack AI Application on the Edge**

## Instructions

1. Create a new D1 database
```sh
npx wrangler d1 create ai-app-db
```

2. When prompted with the question - "Would you like Wrangler to add it on your behalf?", select "Yes, but let me choose the binding name".
3. Enter `DB` as the binding name. This will add the required binding to your `wrangler.jsonc` file.
4. Execute the following command to generate the types:
```sh
npm run cf-typegen
```
5. Create a new file `db/schema.sql`.
6. Add the following statement to the file to create a new table called `postcards`
```sql
CREATE TABLE postcards (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    image_prompt TEXT NOT NULL
);
```
7. Create the new table with the following command:
```sh
npx wrangler d1 execute DB --file="db/schema.sql"
```
8. Verify the table was created using the following command:
```sh
npx wrangler d1 execute DB --command="PRAGMA table_list"
```
9. Use this table to store the city, and the generated image prompt in the `/api/generate/prompt` endpoint.
10.  Update the `/api/generate/image` endpoint to be dynamic such that it generates image for a given ID - `/api/generate/image/:id`
11.  Run the development server

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

- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [D1 - Global Read Replication](https://developers.cloudflare.com/d1/best-practices/read-replication/)
- [D1 Wrangler Commands](https://developers.cloudflare.com/d1/wrangler-commands/)