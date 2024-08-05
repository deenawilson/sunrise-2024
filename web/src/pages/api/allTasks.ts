import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTasks } from '@/modules/taskManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tasks = getAllTasks();
    res.status(200).json(tasks);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}