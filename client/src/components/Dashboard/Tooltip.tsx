import tippy, { Instance } from "tippy.js";
import { EventHoveringArg } from "@fullcalendar/core/index.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/animations/scale-extreme.css";

export const createTooltip = (
  info: EventHoveringArg,
  activeTooltip: Instance | null,
  setActiveTooltip: (tooltip: Instance | null) => void
) => {
  if (activeTooltip) {
    activeTooltip.destroy();
    setActiveTooltip(null);
  }

  const title = info.event.title;
  const email = info.event.extendedProps.email;
  const notes = info.event.extendedProps.notes;
  const firstName = info.event.extendedProps.patient.firstName;
  const lastName = info.event.extendedProps.patient.lastName;
  const contactNumber = info.event.extendedProps.patient.contactNumber;

  const startTime = info.event.start
    ? info.event.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const endTime = info.event.end
    ? info.event.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const tooltipContent = `
    <div class="tooltip">
    <div class="tooltip-title">${title}</div>
    <div><strong>Appointment:</strong> ${startTime} — ${endTime}</div>
    <div><strong>Patient:</strong> ${firstName} ${lastName}</div>
    <div><strong>Phone number:</strong> ${contactNumber}</div>
    <div><strong>Email:</strong> ${email}</div>
    <div><strong>Notes:</strong> ${notes}</div>
    </div>
  `;

  const instance = tippy(info.el, {
    theme: "light",
    animation: "scale-extreme",
    content: tooltipContent,
    allowHTML: true,
    touch: true,
  });

  setActiveTooltip(instance);
};
