export const MAX_IMAGE_SIZE_MB = 1

// S3 Configuration
export const S3_BUCKET_NAME = "land-in-one"
export const S3_REGION = "us-east-1"
export const S3_BASE_DOMAIN = `land-in-one.s3.${S3_REGION}.amazonaws.com`
export const S3_BASE_URL = `https://${S3_BASE_DOMAIN}`
export const S3_BASE_URL_TEMP_DOMAIN = `land-in-one-temp.s3.${S3_REGION}}.amazonaws.com`
export const S3_BASE_URL_TEMP = `https://${S3_BASE_URL_TEMP_DOMAIN}`
export const S3_IMAGES_FOLDER = "images"
