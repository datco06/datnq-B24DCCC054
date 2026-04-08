export type Task = {
    id: number;
    title: string;
    assignee: string;
    priority: "Low" | "Medium" | "High";
    deadline: string;
    status: "todo" | "doing" | "done";
  };
  
  export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    status: string;
  };
  
  // convert task -> event
  export const mapTasksToEvents = (tasks: Task[]): CalendarEvent[] => {
    return tasks.map((task) => ({
      title: `${task.title} - ${task.assignee}`,
      start: new Date(task.deadline),
      end: new Date(task.deadline),
      allDay: true,
      status: task.status,
    }));
  };
  
  // màu theo trạng thái
  export const getEventStyle = (status: string) => {
    switch (status) {
      case "done":
        return { backgroundColor: "green" };
      case "in-progress":
        return { backgroundColor: "orange" };
      case "todo":
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: "#3174ad" };
    }
  };