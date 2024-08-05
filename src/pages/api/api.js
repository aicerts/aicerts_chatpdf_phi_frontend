// pages/api/api.js

import { userServerConfig } from "../../config/server-config";

const BASE_URL = userServerConfig.userServerUrl;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { endpoint } = req.query;
        let apiEndpoint;

        switch (endpoint) {
            case 'login':
                apiEndpoint = 'User/authenticate';
                break;
            case 'register':
                apiEndpoint = '/User/signup';
                break;
            case 'forgot-password':
                apiEndpoint = '/User/forgetPassword';
                break;
            case 'verify':
                apiEndpoint = '/verify/verify-code';
            case 'resend-otp':
                apiEndpoint = '/verify/send-verification-code';
            default:
                return res.status(404).json({ message: 'Endpoint not found' });
        }

        try {
            const response = await fetch(`${BASE_URL}/${apiEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json(data);
            } else {
                res.status(response.status).json(data);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
