import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const resolvedParams = await params;
  const segments = resolvedParams.path || [];

  if (segments.length === 0) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const safeSegments = segments.filter((segment) =>
    /^[a-zA-Z0-9._-]+$/.test(segment),
  );

  if (safeSegments.length !== segments.length) {
    return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
  }

  const filePath = join(process.cwd(), "public", "images", ...safeSegments);

  try {
    const file = await readFile(filePath);
    const extension =
      safeSegments.at(-1)?.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
