import { NextRequest, NextResponse } from "next/server";
import { createMedia } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image (JPEG, PNG, WebP, AVIF, GIF, SVG)" }, { status: 400 });
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size exceeds 10MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check Cloudinary environment
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        // @ts-ignore
        const { v2: cloudinary } = await import("cloudinary");
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        const uploadRes: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "axrok" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        const mediaDoc = await createMedia({
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          filename: file.name,
          format: uploadRes.format || file.type.split("/")[1],
          size: uploadRes.bytes || file.size,
          altText,
        });

        return NextResponse.json({ success: true, media: mediaDoc }, { status: 201 });
      } catch (cloudErr) {
        console.warn("[Cloudinary] Upload failed, falling back to local storage:", cloudErr);
      }
    }

    // Local file fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueFilename = `${cleanBase}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    const mediaDoc = await createMedia({
      url: publicUrl,
      publicId: `local-${uniqueFilename}`,
      filename: file.name,
      format: ext.replace(".", "") || "png",
      size: file.size,
      altText,
    });

    return NextResponse.json({ success: true, media: mediaDoc }, { status: 201 });
  } catch (error) {
    console.error("[Media Upload API] Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
