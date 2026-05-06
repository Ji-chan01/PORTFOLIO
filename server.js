import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sendMessageHandler from './api/messages.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/messages', async (req, res) => {
  await sendMessageHandler(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API Endpoint available at http://localhost:${PORT}/api/messages`);
});
