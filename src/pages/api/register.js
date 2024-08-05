// pages/api/register.js
const apiUrl = process.env.NEXT_PUBLIC_URL_USER;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, password, phoneNumber, address } = req.body;

  try {
    const response = await fetch(`${apiUrl}/User/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Signup successful
      res.status(200).json(data);
    } else {
      // Signup failed
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
