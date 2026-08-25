import { put, del } from "@vercel/blob";

/**
 * Uploads a file (photo or PDF) to Vercel Blob storage.
 * @param filename Original filename
 * @param data Buffer or ReadableStream or Blob
 * @param contentType MIME type of the file
 */
export async function uploadFileToBlob(
  filename: string,
  data: Buffer | Blob,
  contentType?: string
): Promise<{ url: string; pathname: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
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

/**
 * Deletes a file from Vercel Blob by URL.
 */
export async function deleteFileFromBlob(url: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await del(url, { token });
}
