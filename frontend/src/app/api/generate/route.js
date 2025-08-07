// // // // // frontend/src/app/api/generate/route.
import { InferenceClient } from "@huggingface/inference";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req) {
  const { prompt } = await req.json();
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;
  const {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  if (!HF_TOKEN) return new Response(JSON.stringify({ error: "HF token missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return new Response(JSON.stringify({ error: "Cloudinary mis‑configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new InferenceClient(HF_TOKEN);
  let imageBlob;
  try {
    imageBlob = await client.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      provider: "fal-ai", // explicit provider improves reliability :contentReference[oaicite:0]{index=0}
      inputs: prompt,
    });
  } catch (err) {
    console.error("Inference error:", err);
    return new Response(JSON.stringify({ error: "Image generation failed", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffer = Buffer.from(await imageBlob.arrayBuffer());
  // fs.writeFileSync("debug_flux.png", buffer); // optional debug write
  fs.writeFileSync("/tmp/debug_flux.png", buffer);

  // Upload to Cloudinary
  cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  let uploadRes;
  try {
    const base64 = buffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;
    uploadRes = await cloudinary.uploader.upload(dataUri, {
      folder: "flux-generations",
      public_id: `flux-${Date.now()}`,
      context: { prompt, model: "FLUX.1-dev", generated_at: new Date().toISOString() },
    });
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
    return new Response(JSON.stringify({ error: "Upload to Cloudinary failed", details: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ imageUrl: uploadRes.secure_url, publicId: uploadRes.public_id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
