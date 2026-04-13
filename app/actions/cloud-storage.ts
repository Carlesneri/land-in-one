"use server"

import {
  MAX_IMAGE_SIZE_MB,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_BASE_URL,
  S3_BASE_URL_TEMP,
  S3_IMAGES_FOLDER,
} from "@/CONSTANTS"
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3"
import sharp from "sharp"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    // biome-ignore lint: Environment variables are guaranteed in production
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    // biome-ignore lint: Environment variables are guaranteed in production
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToCloud(
  image: File,
  destinationPath: string,
  params: { ContentType?: string } = {},
) {
  const imageKey = crypto.randomUUID()

  // Convert File to Buffer for S3 upload
  const buffer = await image.arrayBuffer()

  const optimized = await sharp(buffer).resize({ width: 800 }).avif().toBuffer()

  const s3params: PutObjectCommandInput = {
    Bucket: S3_BUCKET_NAME,
    Body: new Uint8Array(optimized),
    Key: `${destinationPath}/${imageKey}.avif`,
    ACL: "public-read",
    ...(params.ContentType ? { ContentType: params.ContentType } : {}),
  }

  try {
    await s3Client.send(new PutObjectCommand(s3params))

    return `${S3_BASE_URL}/${destinationPath}/${imageKey}`
  } catch (error) {
    console.error(error)
  }
}

export async function deleteImageInCloud(image: string) {
  const key = image.split(`${S3_BASE_URL}/`)[1]

  const s3params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  }

  try {
    const res = await s3Client.send(new DeleteObjectCommand(s3params))

    const statusCode = res.$metadata.httpStatusCode

    return { statusCode }
  } catch (err) {
    console.log("Error", err)
  }
}

export async function uploadImageFile(formData: FormData) {
  try {
    const file = formData.get("file") as File | null

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      }
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return {
        success: false,
        error: `Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`,
      }
    }

    // Validate MIME type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "File must be an image",
      }
    }

    // Upload to cloud storage
    const cloudUrl = await uploadToCloud(file, S3_IMAGES_FOLDER, {
      ContentType: file.type,
    })

    if (!cloudUrl) {
      return {
        success: false,
        error: "Failed to upload image to cloud",
      }
    }

    return {
      success: true,
      url: cloudUrl,
    }
  } catch (error) {
    console.error("Error uploading image file:", error)

    return {
      success: false,
      error: "Failed to upload image",
    }
  }
}

export async function createPresignedUrl({
  // key,
  ContentType,
  // ContentEncoding,
}: {
  // key: string
  ContentType: string
  // ContentEncoding: string
}) {
  const imageKey = `${S3_IMAGES_FOLDER}/${crypto.randomUUID()}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: imageKey,
    ACL: "public-read",
    ContentType,
    // ContentEncoding,
  })

  const preSignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  })

  return {
    url: preSignedUrl,
    imageKey,
  }
}
