import React, { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Task,
  mapTasksToEvents,
  getEventStyle,
} from "./CalendarUtils";

const localizer = momentLocalizer(moment);

type Props = {
  tasks: Task[];
};

const CalendarView: React.FC<Props> = ({ tasks }) => {
  const events = useMemo(() => mapTasksToEvents(tasks), [tasks]);

  const eventStyleGetter = (event: any) => {
    return {
      style: getEventStyle(event.status),
    };
  };

  return (
    <div style={{ height: "500px", marginTop: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          alert(`Task: ${event.title}`);
        }}
      />
    </div>
  );
};

export default CalendarView;