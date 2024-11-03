import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import showToast from "@/utils/showToast";
import { Instance } from "tippy.js";
import {
  EventDropArg,
  EventClickArg,
  DateSelectArg,
  EventHoveringArg,
  EventChangeArg,
} from "@fullcalendar/core";
import { CalendarProps, Appointment, ChangeInfo } from "./types";
import { createTooltip } from "./Tooltip";

const Calendar: React.FC<CalendarProps> = ({
  config,
  appointments,
  editAppointment,
  setSelectedAppointment,
  setIsEditModalOpen,
  setSelectedDateRange,
  setSelectInfo,
  setIsAddModalOpen,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<Instance | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1080);
  const lastChangeRef = useRef<string | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);

  // Blocked days (fetched from the backend, here hardcoded for example)
  const blockedDays = config.blockedDays || [];

  // Convert blocked days to Date objects for comparison
  const blockedDates = blockedDays.map((date: string) =>
    new Date(date).toDateString()
  );

  const isDateBlocked = (date: Date) => {
    return blockedDates.includes(date.toDateString());
  };

  const toolTipHandler = (info: EventHoveringArg) => {
    createTooltip(info, activeTooltip, setActiveTooltip);
  };

  const handleEventChange = (changeInfo: ChangeInfo) => {
    const eventIdentifier = `${changeInfo.event.id}-${changeInfo.event.start}-${changeInfo.event.end}`;

    // Prevent multiple executions by checking the event identifier
    if (lastChangeRef.current === eventIdentifier) {
      return; // Exit early if this event change has already been processed
    }

    // Mark this event change as processed
    lastChangeRef.current = eventIdentifier;

    // Check if the new start or end date is blocked
    if (
      isDateBlocked(changeInfo.event.start) ||
      isDateBlocked(changeInfo.event.end)
    ) {
      showToast("error", "You cannot move an appointment to a blocked day.");
      changeInfo.revert(); // Revert the change if the date is blocked
      return;
    }

    const updatedAppointment: Appointment = {
      id: Number(changeInfo.event.id),
      scheduleId: config.scheduleId,
      title: changeInfo.event.title,
      start: new Date(changeInfo.event.start),
      end: new Date(changeInfo.event.end),
      notes: changeInfo.event.extendedProps.notes,
      email: changeInfo.event.extendedProps.email,
      patient: changeInfo.event.extendedProps.patient,
      userId: config.userId,
    };

    editAppointment(updatedAppointment);
    showToast("success", "Appointment updated successfully!");
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = appointments.find(
      (appointment) => appointment.id === Number(clickInfo.event.id)
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsEditModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (isDateBlocked(selectInfo.start) || isDateBlocked(selectInfo.end)) {
      showToast(
        "error",
        "This day is blocked and appointments cannot be scheduled."
      );
      return;
    }

    setSelectedDateRange({ start: selectInfo.start, end: selectInfo.end });
    setSelectInfo(selectInfo);

    if (selectInfo.view) {
      setIsAddModalOpen(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (isMobile) {
        calendarApi.changeView("timeGridThreeDay");
      } else {
        calendarApi.changeView(config.view);
      }
    }
  }, [isMobile, config.view]);

  return (
    <div className="justify-center items-center w-full max-w-8xl mx-auto ">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={config.view}
        weekends={config.weekends}
        nowIndicator={true}
        firstDay={1}
        allDaySlot={false}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        weekNumbers
        locale="en-GB"
        events={appointments.map((appointment) => ({
          id: appointment.id.toString(),
          title: appointment.title,
          start: appointment.start,
          end: appointment.end,
          extendedProps: {
            email: appointment.email,
            notes: appointment.notes,
            patient: appointment.patient,
          },
        }))}
        slotDuration={"00:15:00"}
        eventTextColor="#5748d9"
        editable={true}
        eventDrop={handleEventChange as unknown as (arg: EventDropArg) => void}
        eventChange={
          handleEventChange as unknown as (arg: EventChangeArg) => void
        }
        noEventsContent={"No appointments scheduled"}
        moreLinkClick="popover"
        dayMaxEvents={1}
        slotMinTime={config.slotMinTime}
        slotMaxTime={config.slotMaxTime}
        height="auto"
        headerToolbar={
          isMobile
            ? {
                left: "today prev,next",
                center: "title",
                right: "",
              }
            : {
                left: "today prev,next",
                center: "title",
                right: "timeGridWeek,timeGridDay,dayGridMonth,listMonth",
              }
        }
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        unselectAuto={false}
        eventMouseEnter={toolTipHandler}
        eventClick={handleEventClick}
        dayCellDidMount={(info) => {
          if (isDateBlocked(info.date)) {
            info.el.classList.add("fc-disabled-day");
          }
        }}
        selectAllow={(selectInfo) => {
          const { start, end } = selectInfo;
          return (
            !isDateBlocked(start) &&
            !isDateBlocked(end) &&
            start.getTime() >= new Date().getTime() - 86400000
          );
        }}
        views={{
          timeGridThreeDay: {
            type: "timeGrid",
            duration: { days: 3 },
            buttonText: "3 day",
          },
        }}
        windowResize={() => {
          const calendarApi = calendarRef.current?.getApi();
          if (calendarApi) {
            if (isMobile) {
              calendarApi.changeView("timeGridThreeDay");
            } else {
              calendarApi.changeView(config.view);
            }
          }
        }}
      />
    </div>
  );
};

export default Calendar;
