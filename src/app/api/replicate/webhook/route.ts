// import { email } from "https://esm.town/v/std/email";

export default async function POST(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const jsonBody = await request.json();
    console.log(jsonBody);
    // await email({
    //   to: "zeke@replicate.com",
    //   subject: "Replicate Webhook Received",
    //   text: JSON.stringify(jsonBody, null, 2), // Pretty-print the JSON for better readability
    //   html: `<pre>${JSON.stringify(jsonBody, null, 2)}</pre>`, // HTML version with pre-formatted text
    // });
    return new Response("Webhook received and email sent", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 400 });
  }
}
