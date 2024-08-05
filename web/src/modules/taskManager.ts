
import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";



let tasks: Task[] = [...initialTasks];


export function initializeTasks() {
    tasks = [...initialTasks];
}

export function getActiveTasks(): Task[] {
    const incompleteGroup = Math.min(...tasks.filter(task=> !task.completed).map(task => task.group));
    return tasks.filter(task => !task.completed && task.group === incompleteGroup);
}

export function getCompletedTasks(): Task[] {
    return tasks.filter(task=> task.completed);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function completeTask(taskTitle: string): void {
    const task = tasks.find(task =>task.title === taskTitle);
    if (task){
        task.completed=true;
    }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
    const newTask = new Task(tasks.length+1, title, description,persona,group);
    tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const task = tasks.findIndex(t => t.id == taskId );
    if (task!==-1){
        tasks[task] = { ...tasks[task], ...updatedTask };
    }
}

export function deleteTask(taskId: number): void {
    tasks = tasks.filter(task =>task.id !== taskId);
}
