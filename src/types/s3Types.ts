export interface S3UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface S3UploadOptions {
  folder?: string;
  contentType?: string;
}
