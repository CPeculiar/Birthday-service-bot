import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://email-birthday-service.onrender.com/run-job');
    res.status(200).json({ message: 'Successfully triggered render job', data: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to call Render endpoint' });
  }
}
