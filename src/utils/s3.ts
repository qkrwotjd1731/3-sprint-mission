import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  AWS_S3_REGION,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_KEY_ID,
  AWS_S3_BUCKET,
} from '../lib/constants';
import type { S3UploadResult, S3UploadOptions } from '../types/s3Types';

const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: AWS_S3_SECRET_KEY_ID,
  },
});

export const uploadToS3 = async (
  buffer: Buffer,
  fileName: string,
  options: S3UploadOptions = {},
): Promise<S3UploadResult> => {
  try {
    const timestamp = Date.now();
    const key = options.folder
      ? `${options.folder}/${timestamp}-${fileName}`
      : `${timestamp}-${fileName}`;

    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: options.contentType || 'application/octet-stream',
    };

    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);

    const url = `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;

    return {
      url,
      key,
      bucket: AWS_S3_BUCKET,
    };
  } catch (error) {
    console.error('S3 업로드 실패:', error);
    throw new Error(
      `파일 업로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    );
  }
};
