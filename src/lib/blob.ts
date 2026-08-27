import { put, del } from "@vercel/blob";

/**
 * Uploads a file (photo or PDF) to Vercel Blob storage.
 * @param filename Original filename
 * @param data Buffer or ReadableStream or Blob
 * @param contentType MIME type of the file
 */
function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_READ_WRITE_TOKEN") && value) {
      return value;
    }
  }
  return undefined;
}

export async function uploadFileToBlob(
  filename: string,
  data: Buffer | Blob,
  contentType?: string
): Promise<{ url: string; pathname: string }> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const blob = await put(filename, data, {
    access: "public",
    token,
    contentType,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

export async function deleteFileFromBlob(url: string): Promise<void> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await del(url, { token });
}
