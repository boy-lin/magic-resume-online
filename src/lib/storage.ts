import { generateUUID } from "@/utils/uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

interface StorageConfig {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

type FileBody = string | Uint8Array | Buffer | Readable | File;

export function newStorage(config?: StorageConfig) {
  return new Storage(config);
}

export class Storage {
  private s3: S3Client;

  constructor(config?: StorageConfig) {
    const accessKeyId = config?.accessKey || process.env.STORAGE_ACCESS_KEY;
    const secretAccessKey = config?.secretKey || process.env.STORAGE_SECRET_KEY;
    const endpoint = config?.endpoint || process.env.STORAGE_ENDPOINT;

    if (!accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error("Storage configuration is missing");
    }

    this.s3 = new S3Client({
      endpoint,
      region: config?.region || process.env.STORAGE_REGION || "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile({
    body,
    key,
    contentType,
    bucket,
    onProgress,
    disposition = "inline",
  }: {
    body: FileBody;
    key: string;
    contentType?: string;
    bucket?: string;
    onProgress?: (progress: number) => void;
    disposition?: "inline" | "attachment";
  }) {
    if (!bucket) {
      bucket = process.env.STORAGE_BUCKET || "";
    }

    if (!bucket) {
      throw new Error("Bucket is required");
    }

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentDisposition: disposition,
        ...(contentType && { ContentType: contentType }),
      },
    });

    if (onProgress) {
      upload.on("httpUploadProgress", (progress) => {
        const percentage =
          ((progress.loaded || 0) / (progress.total || 1)) * 100;
        onProgress(percentage);
      });
    }

    const res = await upload.done();
    // console.log("upload res", res);
    return {
      location: res.Location,
      bucket: res.Bucket,
      key: res.Key,
      filename: res.Key?.split("/").pop(),
      url: process.env.STORAGE_DOMAIN
        ? `${process.env.STORAGE_DOMAIN}/${res.Key}`
        : res.Location,
    };
  }

  async downloadAndUpload({
    url,
    key,
    bucket,
    contentType,
    disposition = "inline",
  }: {
    url: string;
    key: string;
    bucket?: string;
    contentType?: string;
    disposition?: "inline" | "attachment";
  }) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No body in response");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return this.uploadFile({
      body: buffer,
      key,
      bucket,
      contentType,
      disposition,
    });
  }

  async uploadImage(file: FileBody, opts = {}) {
    const filename = `temp_${generateUUID()}.png`;
    const uploadResult = await this.uploadFile({
      body: file,
      key: `output/${filename}`,
      contentType: "image/png",
      disposition: "inline",
      ...opts,
    });
    return uploadResult.url;
  }

  async uploadAudio(file: FileBody, opts = {}) {
    const filename = `temp_${generateUUID()}.mp3`;
    const uploadResult = await this.uploadFile({
      body: file,
      key: `output/${filename}`,
      contentType: "audio/mpeg",
      disposition: "inline",
      ...opts,
    });
    return uploadResult.url;
  }
}
