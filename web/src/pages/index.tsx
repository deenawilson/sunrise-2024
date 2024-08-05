import React, {useState} from 'react'
import Task from '@/model/Task'
import { initialTasks } from '@/utils/TaskList'
import { Flex, Button, Badge, Card} from "antd";

const groupTasksBygroup = (tasks: Task[]) => {
  return tasks.reduce((groups: { [key: number]: Task[] }, task: Task) => {
    const { group } = task;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(task);
    return groups;
  }, {});
};

const allTaskCompleted = ( tasks : Task[], completedTasks: Task[]) =>{
  const groupedTask = groupTasksBygroup(tasks);
  return Object.entries(groupedTask).every(([group, groupTasks]) =>
    groupTasks.every(task => completedTasks.some(t=> t.id === task.id))
  );
};

const taskPage :React.FC = () => {  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);

  const moveToInProgress = (task: Task) => {
    setInProgress([...inProgress, task]);
    setTasks(tasks.filter((t) => t.id !== task.id));
  };

  const markAsCompleted = (task: Task) => {
    const updatedTask = {...task,completed:true};
    setCompleted([...completed, updatedTask]);
    setInProgress(inProgress.filter((t) => t.id !== task.id));

    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  const prevTaskComplete=(task : Task) => {
    const groupedTask = groupTasksBygroup(initialTasks);
    const prevGroup = Object.keys(groupedTask).filter(id => parseInt(id) < task.group).flatMap(id => groupedTask[parseInt(id)] || []);
    return allTaskCompleted(prevGroup, completed);
  };

  const renderTasks = (taskList: Task[], action:(task: Task)=> void, buttonText:string) => {
    const groupedTask = groupTasksBygroup(taskList);
    return Object.entries(groupedTask).map(([group,tasks])=>(
      <Flex wrap="wrap" gap="16px" key={group}>
      {tasks.map((task: Task) => (
            <Card 
              key={task.id}
              title={task.id} 
              extra={<Button type="primary" onClick={() => action(task)} disabled={!prevTaskComplete(task)}>{buttonText}</Button>} 
              style={{ width: 300 }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </Card>
      ))}
      </Flex>
  ));
};

  return (
    
    <Flex gap="middle" vertical >
    <h2 className='heading'>Task Board</h2>
    <hr/>
    <div>
      <Flex gap="large" justify="space-between">
        
        {/* All tasks are Listed  Here*/}
        <div>
        <h2 id="text">
          Task List
            <Badge count={tasks.length} overflowCount={10}/>
            
          </h2>
          {renderTasks(tasks,moveToInProgress,'Start')}
        </div>

        {/* Active Tasks */}
        <div>
        <h2 id="text">
          In Progress
            <Badge count={inProgress.length} style={{ backgroundColor:'#52c41a' }} overflowCount={10}/>
            
          </h2>
          {renderTasks(inProgress,markAsCompleted,'Complete')}
        </div>

        {/* Completed Tasks*/}
        <div>
        <h2 id="text">
            Completed
             <Badge count={completed.length} style={{ backgroundColor:'#52c41a' }} overflowCount={10}/>
            
          </h2>
          {renderTasks(completed, () => {}, 'Done')}
        </div>
      </Flex>
      </div>
    </Flex>
  );
};

export default taskPage;
