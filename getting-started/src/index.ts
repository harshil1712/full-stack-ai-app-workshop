/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/api/hello') {
			const region = request.cf?.country || 'unknown';
			return new Response(JSON.stringify({ message: 'Hello from Zurich.js API!', from: region }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		if (url.pathname === '/api/message' && request.method === 'POST') {
			const { message } = (await request.json()) as { message: string };
			return new Response(JSON.stringify({ message: `You said: ${message}` }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		return new Response('Not Found', { status: 404 });
	},

	// You can define other event handlers like scheduled, queue, email.

	// Scheduled Event (Cron Job)
	// async scheduled(controller, env, ctx) {
	//   console.log('Scheduled event triggered at', new Date().toISOString());
	// },

	// Queue Consumer
	// async queue(controller, env, ctx) {
	//   const { message } = controller.payload as { message: string };
	//   console.log('Processing queue message:', message);
	// },

	// Email Worker
	// async email(controller, env, ctx) {
	//   const email = controller.payload as Email;
	//   console.log('Received email from:', email.from);
	//   console.log('Subject:', email.subject);
	// }
} satisfies ExportedHandler<Env>;
