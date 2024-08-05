import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileData } = req.body; // Extract fileName and fileData from the request body

    const filePath = path.join(process.cwd(), 'public', 'pdf', fileName); // Use fileName in the file path

    try {
      fs.writeFileSync(filePath, Buffer.from(fileData, 'base64'));
      
      res.status(200).json({ success: true, message: 'File saved successfully.' });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ success: false, message: 'Failed to save file.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
