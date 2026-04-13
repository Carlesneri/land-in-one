# S3 CORS Configuration Guide

To enable browser-based uploads to your S3 bucket using presigned URLs, you need to configure CORS (Cross-Origin Resource Sharing) on your S3 bucket.

## AWS Console Method

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com)
2. Select your bucket: `{S3_BUCKET_NAME}`
3. Go to **Permissions** tab
4. Scroll to **Cross-origin resource sharing (CORS)**
5. Click **Edit** and paste the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["x-amz-version-id"],
    "MaxAgeSeconds": 3000
  }
]
```

**Important:** Replace `https://yourdomain.com` with your actual domain in production.

6. Click **Save changes**

## AWS CLI Method

If you prefer using the AWS CLI:

```bash
aws s3api put-bucket-cors \
  --bucket YOUR_BUCKET_NAME \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET", "DELETE"],
        "AllowedOrigins": [
          "http://localhost:3000",
          "https://yourdomain.com"
        ],
        "ExposeHeaders": ["x-amz-version-id"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'
```

## Verify Configuration

```bash
aws s3api get-bucket-cors --bucket YOUR_BUCKET_NAME
```

## How It Works

1. User selects an image in the browser
2. Frontend requests a presigned URL from the backend
3. Backend returns a presigned URL valid for 1 hour
4. Frontend uploads the file directly to S3 using the presigned URL
5. S3 bucket CORS policy allows the browser to receive the response

This approach:
- ✅ Bypasses the 1MB server limit
- ✅ Provides better user experience with direct uploads
- ✅ Reduces server load
- ✅ Allows larger file uploads (up to 5GB with multipart upload)

## Troubleshooting

If you still see CORS errors:
1. Verify the origin URL matches exactly (including `http://` vs `https://`)
2. Ensure the bucket has the CORS configuration applied
3. Check that your presigned URL includes the `Content-Type` header
4. Verify your S3 credentials have `s3:PutObject` permission
