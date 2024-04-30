// // pages/api/pdfList.js

// import fs from 'fs';
// import path from 'path';

// export default function handler(req, res) {
//   if (req.method === 'GET') {
//     const pdfDirectory = path.join(process.cwd(), 'public', 'pdf');
//     try {
//       const files = fs.readdirSync(pdfDirectory);
//       res.status(200).json({ success: true, files });
//     } catch (error) {
//       console.error('Error reading PDF directory:', error);
//       res.status(500).json({ success: false, message: 'Failed to read PDF directory.' });
//     }
//   } else {
//     res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }
// }

// pages/api/pdfList.js
// pages/api/pdfList.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const pdfDirectory = path.join(process.cwd(), 'public', 'pdf');
    try {
      const files = fs.readdirSync(pdfDirectory);
      const pdfFiles = files.map(file => {
        const fileUrl = `/pdf/${file}`; // Assuming the files are served under '/pdf' route
        return { name: file, url: fileUrl };
      });
      res.status(200).json({ success: true, files: pdfFiles });
    } catch (error) {
      console.error('Error reading PDF directory:', error);
      res.status(500).json({ success: false, message: 'Failed to read PDF directory.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
