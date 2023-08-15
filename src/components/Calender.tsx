import { Fragment, useId, useMemo, useState } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { formatDate } from "../utils/formatDate";
import { cc } from "../utils/cc";
import { EVENT_COLORS, useEvents } from "../context/useEvents";
import { Modal } from ".";
import { UnionOmit } from "../utils/types";
import { ModalProps } from "./Modal";
import { Event } from "../context/Events";

export default function Calender() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth));

    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [selectedMonth]);

  return (
    <>
      <div className="calendar">
        <div className="header">
          <button className="btn" onClick={() => setSelectedMonth(new Date())}>
            Today
          </button>
          <div>
            <button
              onClick={() => setSelectedMonth((m) => subMonths(m, 1))}
              className="month-change-btn"
            >
              &lt;
            </button>
            <button
              onClick={() => setSelectedMonth((m) => addMonths(m, 1))}
              className="month-change-btn"
            >
              &gt;
            </button>
          </div>
          <span className="month-title">
            {formatDate(selectedMonth, { month: "long", year: "numeric" })}
          </span>
        </div>
        <div className="days">
          {calendarDays &&
            calendarDays.map((day, index) => (
              <CalendarDay
                key={day.getTime()}
                day={day}
                showWeekName={index < 7}
                selectedMonth={selectedMonth}
              />
            ))}
        </div>
      </div>
    </>
  );
}

type CalendarDayProps = {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
};

function CalendarDay({ day, showWeekName, selectedMonth }: CalendarDayProps) {
  const { addEvent } = useEvents();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  return (
    <div
      className={cc(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day"
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatDate(day, { weekday: "short" })}
          </div>
        )}
        <div className={cc("day-number", isToday(day) && "today")}>
          {formatDate(day, { day: "2-digit" })}
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="add-event-btn"
        >
          +
        </button>
      </div>

      <EventFormModal
        date={day}
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={addEvent}
      />
    </div>
  );
}

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | { onDelete: () => void; event: Event; date?: never }
  | { onDelete?: never; event?: never; date: Date }
) &
  Omit<ModalProps, "children">;

function EventFormModal({
  onSubmit,
  onDelete,
  event,
  date,
  ...modalProps
}: EventFormModalProps) {
  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENT_COLORS[0]
  );
  const [isAllDayChecked, setIsAllDayChecked] = useState(
    event?.allDay || false
  );
  const [startTime, setStartTime] = useState(event?.startTime || "");

  const isNew = event == null;
  const formId = useId();

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add" : "Edit"} Event</div>
        <small>{formatDate(date || event.date, { dateStyle: "short" })}</small>
        <button onClick={modalProps.onClose} className="close-btn">
          &times;
        </button>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input type="text" id={`${formId}-name`} required />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id={`${formId}-allday`}
            checked={isAllDayChecked}
            onChange={(e) => setIsAllDayChecked(e.target.checked)}
          />
          <label htmlFor={`${formId}-allday`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              type="time"
              id={`${formId}-start-time`}
              required={!isAllDayChecked}
              disabled={isAllDayChecked}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              type="time"
              id={`${formId}-end-time`}
              required={!isAllDayChecked}
              disabled={isAllDayChecked}
              min={startTime}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENT_COLORS.map((color) => (
              <Fragment key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  id={`${formId}-${color}`}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${color}`}>
                  <span className="sr-only">{color}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {isNew ? "Add" : "Edit"}
          </button>
          {onDelete != null && (
            <button onClick={onDelete} className="btn btn-delete" type="button">
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
