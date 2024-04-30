import AWS from "../config/aws-config";

export const generatePresignedUrl = async (fullUrl) => {
  // Extract the object key from the full URL
  const urlParts = fullUrl.split("/");
  const key = urlParts.slice(3).join("/"); // Assuming the key starts at index 3

  const s3 = new AWS.S3();
  const params = {
    Bucket: 'certs365',
    Key: key,
    Expires: 36000, 
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return null;
  }
};
