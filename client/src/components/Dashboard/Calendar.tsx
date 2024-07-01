import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Instance } from "tippy.js";
import {
  EventChangeArg,
  EventDropArg,
  EventClickArg,
  DateSelectArg,
  EventHoveringArg,
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

  const toolTipHandler = (info: EventHoveringArg) => {
    createTooltip(info, activeTooltip, setActiveTooltip);
  };

  const handleEventChange = (changeInfo: ChangeInfo) => {
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
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = appointments.find(
      (appointment: Appointment) =>
        appointment.id === Number(clickInfo.event.id)
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsEditModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateRange({ start: selectInfo.start, end: selectInfo.end });
    setSelectInfo(selectInfo);

    if (selectInfo.view) {
      setIsAddModalOpen(true);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={config.view}
        weekends={config.weekends}
        nowIndicator={true}
        firstDay={1}
        allDaySlot={false}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        weekNumbers
        events={appointments.map((appointment: Appointment) => ({
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
        headerToolbar={{
          left: "today prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay,dayGridMonth,listMonth",
        }}
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        unselectAuto={false}
        eventMouseEnter={toolTipHandler}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendar;
