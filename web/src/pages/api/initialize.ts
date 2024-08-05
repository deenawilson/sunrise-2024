import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeTasks } from '@/modules/taskManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    initializeTasks();
    res.status(200).json({ message: 'Tasks initialized successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}