import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

function placeholderSvg(label: string) {
  const safeLabel = label.replaceAll(/[^a-zA-Z0-9._-]/g, " ").trim() || "Image";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
      <rect width="1200" height="630" rx="32" fill="#F4F1EC"/>
      <rect x="48" y="48" width="1104" height="534" rx="24" fill="#E9E2DA" stroke="#D9CFC7"/>
      <text x="600" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#111111">Image not available</text>
      <text x="600" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6B7280">${safeLabel}</text>
    </svg>
  `;

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

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
    return placeholderSvg("Missing image path");
  }

  const safeSegments = segments.filter((segment) =>
    /^[a-zA-Z0-9._-]+$/.test(segment),
  );

  if (safeSegments.length !== segments.length) {
    return placeholderSvg("Invalid image path");
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
    return placeholderSvg(safeSegments.at(-1) || "Missing image");
  }
}
