// pages/api/verification-code.js
const apiUrl = process.env.NEXT_PUBLIC_URL_USER;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    const { email, code } = req.body;
  
    try {
      const response = await fetch(`${apiUrl}/verify/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login successful
        res.status(200).json(data);
      } else {
        // Login failed
        res.status(response.status).json(data);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  