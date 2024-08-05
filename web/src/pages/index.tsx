import React, { useState } from 'react';
import { Flex, Card, Button, Badge } from 'antd';
import Task from '@/model/Task';
import { initialTasks } from '@/utils/TaskList';

const groupTasksByGroup = (tasks: Task[]): { [key: number]: Task[] } => {
  return tasks.reduce((groups, task) => {
    const { group } = task;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(task);
    return groups;
  }, {} as { [key: number]: Task[] });
};

const allTasksInPreviousGroupsCompleted = (
  task: Task,
  groupedTasks: { [key: number]: Task[] },
  completedTasks: Task[]
): boolean => {
  const previousGroups = Object.keys(groupedTasks)
    .map(Number)
    .filter((groupId) => groupId < task.group);

  return previousGroups.every((groupId) =>
    groupedTasks[groupId].every((t) => completedTasks.some((ct) => ct.id === t.id))
  );
};

const moveToInProgress = (
  task: Task,
  tasks: Task[],
  inProgress: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setInProgress: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  setInProgress([...inProgress, task]);
  setTasks(tasks.filter((t) => t.id !== task.id));
};

const markAsCompleted = (
  task: Task,
  inProgress: Task[],
  completed: Task[],
  setInProgress: React.Dispatch<React.SetStateAction<Task[]>>,
  setCompleted: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const updatedTask = { ...task, completed: true };
  setCompleted([...completed, updatedTask]);
  setInProgress(inProgress.filter((t) => t.id !== task.id));
};

const renderTasks = (
  taskList: Task[],
  action: (task: Task) => void,
  buttonText: string,
  groupedTasks: { [key: number]: Task[] },
  completed: Task[]
) => {
  return Object.entries(groupedTasks).map(([group, tasks]) => (
    <Flex wrap="wrap" gap="16px" key={group}>
      {tasks.map((task: Task) => (
        <Card
          key={task.id}
          title={task.title}
          extra={
            <Button
              type="primary"
              onClick={() => action(task)}
              disabled={!allTasksInPreviousGroupsCompleted(task, groupedTasks, completed)}
            >
              {buttonText}
            </Button>
          }
          style={{ width: 300 }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </Card>
      ))}
    </Flex>
  ));
};

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);

  const groupedTasks = groupTasksByGroup(tasks);

  return (
    <Flex gap="middle" vertical>
      <h2>Task Board</h2>
      <div>
        <Flex gap="large" justify="space-between">
          {/* Task List */}
          <div>
            <h2>Task List <Badge count={tasks.length} overflowCount={10} /></h2>
            {renderTasks(tasks, (task) => moveToInProgress(task, tasks, inProgress, setTasks, setInProgress), 'Start', groupedTasks, completed)}
          </div>

          {/* In Progress */}
          <div>
            <h2>In Progress <Badge count={inProgress.length} style={{ backgroundColor: '#52c41a' }} overflowCount={10} /></h2>
            {renderTasks(inProgress, (task) => markAsCompleted(task, inProgress, completed, setInProgress, setCompleted), 'Complete', groupTasksByGroup(inProgress), completed)}
          </div>

          {/* Completed */}
          <div>
            <h2>Completed <Badge count={completed.length} style={{ backgroundColor: '#52c41a' }} overflowCount={10} /></h2>
            {renderTasks(completed, () => {}, 'Done', groupTasksByGroup(completed), completed)}
          </div>
        </Flex>
      </div>
    </Flex>
  );
};

export default TaskPage;
