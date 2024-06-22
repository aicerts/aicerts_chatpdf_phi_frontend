import AWS from "../config/aws-config";

export const generatePresignedUrl = async (fullUrl) => {
  // Extract the object key from the full URL
  const urlParts = fullUrl.split("/");
  const key = urlParts.slice(3).join("/"); // Assuming the key starts at index 3

  const s3 = new AWS.S3();
  const params = {
    Bucket: 'aichatpdf-dev',
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


export function formatChatResponse(data) {
  console.log('dattas',data)
  // if (data.status !== "success" || !data.data || !data.data.content) {
  //     return '';
  // }

  // Extract the content
  const content = data.content;

  // Split content by lines
  const lines = content.split('\n');

  // Initialize the formatted content
  let formattedContent = '';

  // Process each line
  lines.forEach(line => {
      if (line.startsWith('**') && line.endsWith('**')) {
          // It's a heading
          formattedContent += `<h2>${line.slice(2, -2)}</h2>\n`;
      } else if (line.startsWith('* **')) {
          // It's a list item with bold text
          let [boldText, ...rest] = line.slice(2).split(': ');
          boldText = boldText.slice(2, -2);
          const restText = rest.join(': ');
          formattedContent += `<li><strong>${boldText}</strong>: ${restText}</li>\n`;
      } else if (line.startsWith('*')) {
          // It's a regular list item
          formattedContent += `<li>${line.slice(2)}</li>\n`;
      } else if (line === '') {
          // Add a new line for spacing
          formattedContent += '<br>\n';
      } else {
          // Otherwise, treat it as a paragraph
          formattedContent += `<p>${line}</p>\n`;
      }
  });

  return formattedContent;
}