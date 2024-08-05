import type { NextApiRequest, NextApiResponse } from 'next';
import { completeTask } from '@/modules/taskManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title } = req.body;
    completeTask(title);
    res.status(200).json({ message: 'Task completed successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}