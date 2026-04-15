import type { TaskItem } from '@/services/Bai7';
import { TaskStatus } from '@/services/Bai7';
  
  export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    status: string;
  };
  
  // convert task -> event
  export const mapTasksToEvents = (tasks: TaskItem[]): CalendarEvent[] => {
    return tasks.map((task) => ({
      title: `${task.title} - ${task.assignee}`,
      start: new Date(task.deadline),
      end: new Date(task.deadline),
      allDay: true,
      status: task.status,
    }));
  };
  
  // màu theo trạng thái
  export const getEventStyle = (status: TaskStatus | string) => {
    switch (status) {
      case TaskStatus.Done:
        return { backgroundColor: "green" };
      case TaskStatus.InProgress:
        return { backgroundColor: "orange" };
      case TaskStatus.Todo:
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: "#3174ad" };
    }
  };