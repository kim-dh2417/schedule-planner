import { useEffect, useRef, useState } from "react";

const DISPLAY_YEAR = 2026;
const DISPLAY_MONTH_INDEX = 2;
const TODAY_KEY = "2026-03-25";

const STORAGE_KEYS = {
  events: "schedule-planner-events",
  workLogs: "schedule-planner-worklogs",
  reminderSettings: "schedule-planner-reminder-settings",
};

const weekdayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const typeOptions = [
  { value: "work", label: "업무" },
  { value: "meeting", label: "미팅" },
  { value: "deadline", label: "마감" },
  { value: "focus", label: "집중" },
  { value: "personal", label: "개인" },
];

const statusOptions = [
  { value: "planned", label: "예정" },
  { value: "done", label: "완료" },
  { value: "risk", label: "조정 필요" },
];

const reminderOptions = [
  { value: "0", label: "알림 없음" },
  { value: "10", label: "10분 전" },
  { value: "30", label: "30분 전" },
  { value: "60", label: "1시간 전" },
];

const initialEvents = [
  {
    id: "evt-1",
    date: "2026-03-24",
    start: "09:30",
    end: "10:00",
    title: "주간 우선순위 정리",
    type: "work",
    status: "done",
    reminderMinutes: 10,
    notes: "이번 주 마감과 오늘의 핵심 작업을 다시 정리했다.",
  },
  {
    id: "evt-2",
    date: "2026-03-24",
    start: "15:00",
    end: "15:40",
    title: "고객 피드백 미팅",
    type: "meeting",
    status: "done",
    reminderMinutes: 30,
    notes: "신규 요청 사항과 배포 일정을 확인했다.",
  },
  {
    id: "evt-3",
    date: "2026-03-25",
    start: "10:00",
    end: "10:30",
    title: "결제 페이지 QA 점검",
    type: "work",
    status: "planned",
    reminderMinutes: 10,
    notes: "모바일 흐름과 결제 실패 케이스를 다시 확인한다.",
  },
  {
    id: "evt-4",
    date: "2026-03-25",
    start: "13:00",
    end: "14:00",
    title: "주간보고 초안 작성",
    type: "work",
    status: "planned",
    reminderMinutes: 30,
    notes: "이번 주 업무일지를 묶어 핵심 요약을 정리한다.",
  },
  {
    id: "evt-5",
    date: "2026-03-25",
    start: "17:30",
    end: "18:00",
    title: "배포 체크리스트 마감",
    type: "deadline",
    status: "risk",
    reminderMinutes: 60,
    notes: "누락된 이슈가 없는지 마지막으로 검토한다.",
  },
  {
    id: "evt-6",
    date: "2026-03-26",
    start: "09:00",
    end: "10:30",
    title: "집중 작업 블록",
    type: "focus",
    status: "planned",
    reminderMinutes: 10,
    notes: "신규 리포트 화면 구현에만 집중한다.",
  },
  {
    id: "evt-7",
    date: "2026-03-27",
    start: "11:00",
    end: "11:30",
    title: "주간 회고 메모 정리",
    type: "personal",
    status: "planned",
    reminderMinutes: 10,
    notes: "이번 주 배운 점과 다음 주 개선 포인트를 정리한다.",
  },
];

const initialWorkLogs = [
  {
    id: "log-1",
    date: "2026-03-24",
    summary: "결제 페이지 QA와 일정 정리를 마무리했다.",
    completed:
      "모바일 결제 QA 재검증\n광고 랜딩 수정 요청 반영\n이번 주 우선순위 재배치",
    blockers: "디자인 수정본 전달이 늦어 오후 검토 시간이 밀렸다.",
    nextPlan: "오전엔 QA 확인, 오후엔 주간보고 초안에 집중한다.",
  },
  {
    id: "log-2",
    date: "2026-03-25",
    summary: "배포 전 확인 항목을 점검하고 주간보고 준비를 시작했다.",
    completed: "배포 체크리스트 정리\n선택일 드로어 점검\n일정 알림 범위 재정의",
    blockers: "오후 미팅이 길어져 주간보고 정리 시간이 부족했다.",
    nextPlan: "주간보고 초안을 완성하고 다음 주 우선순위를 정리한다.",
  },
];

const dateLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey) {
  return dateLabelFormatter.format(parseDateKey(dateKey));
}

function formatMonthLabel(year, monthIndex) {
  return monthLabelFormatter.format(new Date(year, monthIndex, 1));
}

function formatWeekLabel(weekKeys) {
  return `${formatDateLabel(weekKeys[0])} - ${formatDateLabel(weekKeys[6])}`;
}

function toMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function getTypeLabel(type) {
  return typeOptions.find((option) => option.value === type)?.label ?? "일정";
}

function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label ?? "예정";
}

function getTypeTone(type) {
  switch (type) {
    case "meeting":
      return "mint";
    case "deadline":
      return "amber";
    case "focus":
      return "coral";
    case "personal":
      return "sky";
    default:
      return "sky";
  }
}

function getStatusTone(status) {
  switch (status) {
    case "done":
      return "mint";
    case "risk":
      return "coral";
    default:
      return "sky";
  }
}

function getReminderLabel(minutes) {
  const numericMinutes = Number(minutes);
  if (!numericMinutes) {
    return "알림 없음";
  }
  if (numericMinutes === 60) {
    return "1시간 전";
  }
  return `${numericMinutes}분 전`;
}

function isOverlapping(startA, endA, startB, endB) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}

function findConflictIds(events) {
  const grouped = new Map();
  const conflictIds = new Set();

  events.forEach((event) => {
    const dateEvents = grouped.get(event.date) ?? [];
    dateEvents.push(event);
    grouped.set(event.date, dateEvents);
  });

  grouped.forEach((dateEvents) => {
    for (let i = 0; i < dateEvents.length; i += 1) {
      for (let j = i + 1; j < dateEvents.length; j += 1) {
        if (
          isOverlapping(
            dateEvents[i].start,
            dateEvents[i].end,
            dateEvents[j].start,
            dateEvents[j].end,
          )
        ) {
          conflictIds.add(dateEvents[i].id);
          conflictIds.add(dateEvents[j].id);
        }
      }
    }
  });

  return conflictIds;
}

function buildCalendarDays(year, monthIndex, events, workLogMap, selectedDate, conflictIds) {
  const grouped = new Map();
  events.forEach((event) => {
    const dateEvents = grouped.get(event.date) ?? [];
    dateEvents.push(event);
    grouped.set(event.date, dateEvents);
  });

  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = formatDateKey(date);
    const dateEvents = [...(grouped.get(key) ?? [])].sort(
      (left, right) => toMinutes(left.start) - toMinutes(right.start),
    );

    return {
      key,
      day: date.getDate(),
      currentMonth: date.getMonth() === monthIndex,
      isToday: key === TODAY_KEY,
      isSelected: key === selectedDate,
      hasConflict: dateEvents.some((event) => conflictIds.has(event.id)),
      hasLog: workLogMap.has(key),
      events: dateEvents,
    };
  });
}

function getLastEventDefaults(events) {
  if (events.length === 0) {
    return { type: "work", reminderMinutes: "10" };
  }

  const latest = [...events]
    .sort((left, right) =>
      `${left.date}T${left.start}`.localeCompare(`${right.date}T${right.start}`),
    )
    .at(-1);

  return {
    type: latest?.type ?? "work",
    reminderMinutes: String(latest?.reminderMinutes ?? 10),
  };
}

function createEventDraft(date = TODAY_KEY, defaults = { type: "work", reminderMinutes: "10" }) {
  return {
    title: "",
    date,
    start: "09:00",
    end: "09:30",
    type: defaults.type ?? "work",
    status: "planned",
    reminderMinutes: defaults.reminderMinutes ?? "10",
    notes: "",
  };
}

function createEventDraftFromEvent(event) {
  return {
    title: event.title,
    date: event.date,
    start: event.start,
    end: event.end,
    type: event.type,
    status: event.status,
    reminderMinutes: String(event.reminderMinutes ?? 0),
    notes: event.notes ?? "",
  };
}

function createWorkLogDraft(date = TODAY_KEY, entry = null) {
  return {
    date,
    summary: entry?.summary ?? "",
    completed: entry?.completed ?? "",
    blockers: entry?.blockers ?? "",
    nextPlan: entry?.nextPlan ?? "",
  };
}

function loadStoredEvents() {
  if (typeof window === "undefined") {
    return initialEvents;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.events);
    if (!storedValue) {
      return initialEvents;
    }

    const parsed = JSON.parse(storedValue);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initialEvents;
    }

    return parsed.map((event, index) => ({
      id: event.id ?? `stored-event-${index}`,
      title: event.title ?? "이름 없는 일정",
      date: event.date ?? TODAY_KEY,
      start: event.start ?? "09:00",
      end: event.end ?? "09:30",
      type: event.type ?? "work",
      status: event.status ?? "planned",
      reminderMinutes: Number.isFinite(Number(event.reminderMinutes))
        ? Number(event.reminderMinutes)
        : 0,
      notes: event.notes ?? "",
    }));
  } catch {
    return initialEvents;
  }
}

function loadStoredWorkLogs() {
  if (typeof window === "undefined") {
    return initialWorkLogs;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.workLogs);
    if (!storedValue) {
      return initialWorkLogs;
    }

    const parsed = JSON.parse(storedValue);
    if (!Array.isArray(parsed)) {
      return initialWorkLogs;
    }

    return parsed.map((entry, index) => ({
      id: entry.id ?? `stored-log-${index}`,
      date: entry.date ?? TODAY_KEY,
      summary: entry.summary ?? "",
      completed: entry.completed ?? "",
      blockers: entry.blockers ?? "",
      nextPlan: entry.nextPlan ?? "",
    }));
  } catch {
    return initialWorkLogs;
  }
}

function loadReminderSettings() {
  if (typeof window === "undefined") {
    return { browserEnabled: false };
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.reminderSettings);
    if (!storedValue) {
      return { browserEnabled: false };
    }

    const parsed = JSON.parse(storedValue);
    return { browserEnabled: Boolean(parsed?.browserEnabled) };
  } catch {
    return { browserEnabled: false };
  }
}

function getNotificationPermissionState() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return window.Notification.permission;
}

function getEventDateTime(event) {
  return new Date(`${event.date}T${event.start}:00`);
}

function buildWeekKeys(dateKey) {
  const date = parseDateKey(dateKey);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);

  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + index);
    return formatDateKey(nextDate);
  });
}

function buildWeeklyReport(weekKeys, events, workLogs) {
  const dailyEntries = weekKeys.map((dateKey) => {
    const dayEvents = events
      .filter((event) => event.date === dateKey)
      .sort((left, right) => toMinutes(left.start) - toMinutes(right.start));
    const workLog = workLogs.find((entry) => entry.date === dateKey) ?? null;

    return { dateKey, label: formatDateLabel(dateKey), events: dayEvents, workLog };
  });

  const loggedDays = dailyEntries.filter(
    (entry) =>
      entry.workLog &&
      [entry.workLog.summary, entry.workLog.completed, entry.workLog.blockers, entry.workLog.nextPlan]
        .some((value) => value.trim()),
  ).length;
  const totalEvents = dailyEntries.reduce((count, entry) => count + entry.events.length, 0);
  const doneEvents = dailyEntries.reduce(
    (count, entry) => count + entry.events.filter((event) => event.status === "done").length,
    0,
  );
  const reminderCount = dailyEntries.reduce(
    (count, entry) =>
      count + entry.events.filter((event) => Number(event.reminderMinutes) > 0).length,
    0,
  );

  const highlights = dailyEntries
    .filter((entry) => entry.workLog?.summary.trim())
    .map((entry) => `${entry.label}: ${entry.workLog.summary.trim()}`);
  const blockers = dailyEntries
    .filter((entry) => entry.workLog?.blockers.trim())
    .map((entry) => `${entry.label}: ${entry.workLog.blockers.trim()}`);
  const nextPlans = dailyEntries
    .filter((entry) => entry.workLog?.nextPlan.trim())
    .map((entry) => `${entry.label}: ${entry.workLog.nextPlan.trim()}`);

  const weeklyHeadline =
    loggedDays > 0
      ? `이번 주에는 ${loggedDays}일 동안 업무일지를 남겼고, 총 ${totalEvents}개의 일정 중 ${doneEvents}개를 완료했습니다.`
      : "아직 이번 주 업무일지가 없어 주간보고 초안이 비어 있습니다.";

  const reportText = [
    `주간보고 (${formatWeekLabel(weekKeys)})`,
    "",
    `- 기록 일수: ${loggedDays}일`,
    `- 전체 일정: ${totalEvents}건`,
    `- 완료 일정: ${doneEvents}건`,
    `- 알림 설정 일정: ${reminderCount}건`,
    "",
    "핵심 요약",
    weeklyHeadline,
    "",
    "이번 주 기록",
    ...(highlights.length > 0 ? highlights : ["- 업무일지 기록 없음"]),
    "",
    "이슈",
    ...(blockers.length > 0 ? blockers : ["- 특이 이슈 없음"]),
    "",
    "다음 액션",
    ...(nextPlans.length > 0 ? nextPlans : ["- 다음 액션 기록 없음"]),
  ].join("\n");

  return {
    dailyEntries,
    loggedDays,
    totalEvents,
    doneEvents,
    reminderCount,
    highlights,
    blockers,
    nextPlans,
    weeklyHeadline,
    reportText,
  };
}

function SummaryStrip({ items }) {
  return (
    <section className="calendar-summary-strip">
      {items.map((item) => (
        <article key={item.label} className={`calendar-summary calendar-summary--${item.tone}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.detail}</small>
        </article>
      ))}
    </section>
  );
}

function CalendarDay({ day, onSelect }) {
  const className = [
    "calendar-first-day",
    day.currentMonth ? "" : "calendar-first-day--muted",
    day.isSelected ? "calendar-first-day--selected" : "",
    day.hasConflict ? "calendar-first-day--conflict" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      aria-pressed={day.isSelected}
      onClick={() => onSelect(day.key)}
    >
      <div className="calendar-first-day__header">
        <span>{day.day}</span>
        <div className="calendar-first-day__flags">
          {day.isToday ? <em>Today</em> : null}
          {day.hasConflict ? <small>충돌</small> : null}
          {day.hasLog ? <small className="calendar-first-day__log-flag">일지</small> : null}
        </div>
      </div>
      <div className="calendar-first-day__events">
        {day.events.length === 0 ? (
          <p>{day.hasLog ? "업무일지 기록 있음" : "비어 있음"}</p>
        ) : (
          day.events.slice(0, 2).map((event) => (
            <span
              key={event.id}
              className={`event-pill event-pill--${getTypeTone(event.type)}`}
            >
              {event.title}
            </span>
          ))
        )}
        {day.events.length > 2 ? <small>+{day.events.length - 2} more</small> : null}
      </div>
    </button>
  );
}

function SelectedDateDrawer({
  open,
  selectedDateLabel,
  events,
  workLog,
  selectedEventId,
  onClose,
  onSelectEvent,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onOpenWorkLog,
  conflictIds,
}) {
  if (!open) {
    return null;
  }

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;

  return (
    <div className="calendar-drawer">
      <button type="button" className="calendar-drawer__scrim" onClick={onClose} />
      <aside className="calendar-drawer__panel">
        <div className="calendar-drawer__header">
          <div>
            <p className="eyebrow">Selected Day</p>
            <h2>{selectedDateLabel}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="calendar-drawer__actions">
          <button type="button" className="button button--primary" onClick={onCreateEvent}>
            일정 추가
          </button>
          <button type="button" className="button button--secondary" onClick={onOpenWorkLog}>
            업무일지 작성
          </button>
        </div>

        <section className="drawer-block">
          <div className="drawer-block__header">
            <strong>선택일 일정</strong>
            <span>{events.length}건</span>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              <strong>선택한 날짜에는 일정이 없습니다.</strong>
              <p>먼저 일정을 추가하거나 업무일지만 기록해도 됩니다.</p>
            </div>
          ) : (
            <div className="calendar-drawer__list">
              {events.map((event) => {
                const isSelected = event.id === selectedEventId;
                const hasConflict = conflictIds.has(event.id);

                return (
                  <button
                    key={event.id}
                    type="button"
                    className={[
                      "calendar-drawer__item",
                      isSelected ? "calendar-drawer__item--selected" : "",
                      hasConflict ? "calendar-drawer__item--danger" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => onSelectEvent(event)}
                  >
                    <div>
                      <strong>{event.title}</strong>
                      <p>
                        {event.start} - {event.end}
                      </p>
                    </div>
                    <div className="calendar-drawer__item-tags">
                      <span className={`tag tag--${getTypeTone(event.type)}`}>
                        {getTypeLabel(event.type)}
                      </span>
                      {Number(event.reminderMinutes) > 0 ? (
                        <span className="tag tag--soft-sky">
                          {getReminderLabel(event.reminderMinutes)}
                        </span>
                      ) : null}
                      {hasConflict ? <span className="tag tag--danger">충돌</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedEvent ? (
            <div className="calendar-drawer__detail">
              <div className="calendar-drawer__detail-head">
                <strong>{selectedEvent.title}</strong>
                <span className={`tag tag--soft-${getStatusTone(selectedEvent.status)}`}>
                  {getStatusLabel(selectedEvent.status)}
                </span>
              </div>
              <p>
                {selectedEvent.start} - {selectedEvent.end} · {getTypeLabel(selectedEvent.type)}
              </p>
              <span>{selectedEvent.notes || "메모 없음"}</span>
              <div className="calendar-drawer__item-tags">
                <span className="tag tag--soft-sky">
                  {getReminderLabel(selectedEvent.reminderMinutes)}
                </span>
              </div>
              <div className="calendar-drawer__detail-actions">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={onEditEvent}
                >
                  일정 수정
                </button>
                <button type="button" className="danger-button" onClick={onDeleteEvent}>
                  일정 삭제
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="drawer-block">
          <div className="drawer-block__header">
            <strong>업무일지</strong>
            <button
              type="button"
              className="button button--secondary button--mini"
              onClick={onOpenWorkLog}
            >
              {workLog ? "수정" : "작성"}
            </button>
          </div>

          {workLog ? (
            <article className="worklog-card">
              <p className="worklog-card__summary">{workLog.summary || "한 줄 요약 없음"}</p>
              <div className="worklog-card__grid">
                <div>
                  <span>완료한 일</span>
                  <p>{workLog.completed || "기록 없음"}</p>
                </div>
                <div>
                  <span>이슈</span>
                  <p>{workLog.blockers || "기록 없음"}</p>
                </div>
                <div className="worklog-card__full">
                  <span>다음 액션</span>
                  <p>{workLog.nextPlan || "기록 없음"}</p>
                </div>
              </div>
            </article>
          ) : (
            <div className="empty-state">
              <strong>아직 업무일지가 없습니다.</strong>
              <p>그날 한 일과 다음 액션을 남기면 주간보고 초안에 자동 반영됩니다.</p>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}

function EventModal({
  open,
  editing,
  draft,
  validationMessage,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal">
      <button type="button" className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <p className="eyebrow">Event Modal</p>
            <h2>{editing ? "일정 수정" : "일정 추가"}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal__body" onSubmit={onSubmit}>
          <label className="field">
            <span>일정 제목</span>
            <input
              name="title"
              value={draft.title}
              onChange={onChange}
              placeholder="예: 배포 체크리스트 마감"
            />
          </label>

          <div className="field-grid field-grid--triple">
            <label className="field">
              <span>날짜</span>
              <input name="date" type="date" value={draft.date} onChange={onChange} />
            </label>
            <label className="field">
              <span>시작 시간</span>
              <input name="start" type="time" value={draft.start} onChange={onChange} />
            </label>
            <label className="field">
              <span>종료 시간</span>
              <input name="end" type="time" value={draft.end} onChange={onChange} />
            </label>
          </div>

          <div className="field-grid field-grid--two">
            <label className="field">
              <span>일정 유형</span>
              <select name="type" value={draft.type} onChange={onChange}>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>상태</span>
              <select name="status" value={draft.status} onChange={onChange}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-grid field-grid--two">
            <label className="field">
              <span>알림 시점</span>
              <select
                name="reminderMinutes"
                value={draft.reminderMinutes}
                onChange={onChange}
              >
                {reminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>메모</span>
              <input
                name="notes"
                value={draft.notes}
                onChange={onChange}
                placeholder="준비해야 할 것 한 줄 메모"
              />
            </label>
          </div>

          <div className="form-helper-row">
            <p>브라우저 알림은 권한 허용 후 일정 시작 전에 동작합니다.</p>
            {validationMessage ? (
              <span className="validation-message">{validationMessage}</span>
            ) : null}
          </div>

          <div className="form-actions form-actions--modal">
            <button
              type="submit"
              className="button button--primary"
              disabled={Boolean(validationMessage)}
            >
              {editing ? "수정 저장" : "일정 등록"}
            </button>
            <button type="button" className="button button--secondary" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WorkLogModal({ open, draft, onChange, onClose, onSubmit }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal">
      <button type="button" className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <p className="eyebrow">Work Log</p>
            <h2>업무일지 작성</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal__body" onSubmit={onSubmit}>
          <label className="field">
            <span>한 줄 요약</span>
            <textarea
              name="summary"
              rows="2"
              value={draft.summary}
              onChange={onChange}
              placeholder="오늘 무엇을 중심으로 진행했는지 한 줄로 적어보세요."
            />
          </label>

          <label className="field">
            <span>완료한 일</span>
            <textarea
              name="completed"
              rows="4"
              value={draft.completed}
              onChange={onChange}
              placeholder="줄바꿈으로 여러 개를 적을 수 있습니다."
            />
          </label>

          <label className="field">
            <span>이슈</span>
            <textarea
              name="blockers"
              rows="3"
              value={draft.blockers}
              onChange={onChange}
              placeholder="막힌 점이나 확인이 필요한 이슈를 적어보세요."
            />
          </label>

          <label className="field">
            <span>다음 액션</span>
            <textarea
              name="nextPlan"
              rows="3"
              value={draft.nextPlan}
              onChange={onChange}
              placeholder="내일 이어서 할 일이나 우선순위를 적어보세요."
            />
          </label>

          <div className="form-actions form-actions--modal">
            <button type="submit" className="button button--primary">
              업무일지 저장
            </button>
            <button type="button" className="button button--secondary" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WeeklyReportModal({ open, weekLabel, report, onCopy, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal">
      <button type="button" className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <p className="eyebrow">Weekly Report</p>
            <h2>{weekLabel}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <section className="report-metrics">
          <article className="report-card">
            <span>기록 일수</span>
            <strong>{report.loggedDays}일</strong>
          </article>
          <article className="report-card">
            <span>전체 일정</span>
            <strong>{report.totalEvents}건</strong>
          </article>
          <article className="report-card">
            <span>완료 일정</span>
            <strong>{report.doneEvents}건</strong>
          </article>
          <article className="report-card">
            <span>알림 일정</span>
            <strong>{report.reminderCount}건</strong>
          </article>
        </section>

        <section className="report-section">
          <h3>주간 한 줄 요약</h3>
          <p>{report.weeklyHeadline}</p>
        </section>

        <section className="report-section">
          <div className="report-section__header">
            <h3>일자별 기록</h3>
            <button type="button" className="button button--secondary" onClick={onCopy}>
              주간보고 복사
            </button>
          </div>
          <div className="report-list">
            {report.dailyEntries.map((entry) => (
              <article key={entry.dateKey} className="report-entry">
                <div className="report-entry__meta">
                  <strong>{entry.label}</strong>
                  <span>{entry.events.length}건 일정</span>
                </div>
                {entry.workLog ? (
                  <div className="report-entry__body">
                    <p>{entry.workLog.summary || "한 줄 요약 없음"}</p>
                    <small>다음 액션: {entry.workLog.nextPlan || "기록 없음"}</small>
                  </div>
                ) : (
                  <div className="report-entry__body report-entry__body--empty">
                    <p>업무일지 없음</p>
                    <small>이 날짜는 아직 기록되지 않았습니다.</small>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="report-columns">
          <article className="report-section">
            <h3>이슈</h3>
            <ul>
              {report.blockers.length > 0 ? (
                report.blockers.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>기록된 이슈가 없습니다.</li>
              )}
            </ul>
          </article>
          <article className="report-section">
            <h3>다음 액션</h3>
            <ul>
              {report.nextPlans.length > 0 ? (
                report.nextPlans.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>기록된 다음 액션이 없습니다.</li>
              )}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}

function ReminderModal({
  open,
  permission,
  enabled,
  upcomingEvents,
  onRequestPermission,
  onToggleEnabled,
  onClose,
}) {
  if (!open) {
    return null;
  }

  const isGranted = permission === "granted";
  const isUnsupported = permission === "unsupported";
  const isDenied = permission === "denied";

  return (
    <div className="modal">
      <button type="button" className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <p className="eyebrow">Reminder Settings</p>
            <h2>브라우저 알림</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <section className="setting-card">
          <div className="setting-row">
            <div>
              <strong>브라우저/PC 알림</strong>
              <p>
                일정 시작 전에 리마인드를 받는 1차 MVP 기능입니다. 이메일 알림은 차기
                범위입니다.
              </p>
            </div>
            <button
              type="button"
              className={[
                "toggle-chip",
                enabled && isGranted ? "toggle-chip--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={onToggleEnabled}
              disabled={!isGranted}
            >
              {enabled && isGranted ? "활성화됨" : "비활성화"}
            </button>
          </div>

          <div className="setting-row setting-row--stack">
            <span className="tag tag--soft-sky">
              {isUnsupported
                ? "지원되지 않는 브라우저"
                : isDenied
                  ? "권한 차단됨"
                  : isGranted
                    ? "권한 허용됨"
                    : "권한 필요"}
            </span>
            {isUnsupported ? <p>현재 환경에서는 브라우저 알림 API를 지원하지 않습니다.</p> : null}
            {!isUnsupported && !isGranted ? (
              <button type="button" className="button button--primary" onClick={onRequestPermission}>
                브라우저 알림 허용
              </button>
            ) : null}
            {isDenied ? <p>브라우저 설정에서 알림 권한을 직접 다시 허용해야 합니다.</p> : null}
          </div>
        </section>

        <section className="report-section">
          <h3>예정된 알림</h3>
          {upcomingEvents.length > 0 ? (
            <div className="notification-list">
              {upcomingEvents.map((event) => (
                <article key={event.id} className="notification-item">
                  <strong>{event.title}</strong>
                  <p>
                    {formatDateLabel(event.date)} · {event.start} - {event.end}
                  </p>
                  <small>{getReminderLabel(event.reminderMinutes)}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>예정된 알림이 없습니다.</strong>
              <p>새 일정을 추가하거나 알림 시점을 설정하면 여기에 표시됩니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState(loadStoredEvents);
  const [workLogs, setWorkLogs] = useState(loadStoredWorkLogs);
  const [selectedDate, setSelectedDate] = useState(TODAY_KEY);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDraft, setEventDraft] = useState(createEventDraft(TODAY_KEY));
  const [workLogDraft, setWorkLogDraft] = useState(createWorkLogDraft(TODAY_KEY));
  const [feedback, setFeedback] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderSettings, setReminderSettings] = useState(loadReminderSettings);
  const [notificationPermission, setNotificationPermission] = useState(
    getNotificationPermissionState(),
  );
  const sentReminderKeysRef = useRef(new Set());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.workLogs, JSON.stringify(workLogs));
  }, [workLogs]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.reminderSettings,
      JSON.stringify(reminderSettings),
    );
  }, [reminderSettings]);

  useEffect(() => {
    setNotificationPermission(getNotificationPermissionState());
  }, []);

  useEffect(() => {
    if (selectedEventId && !events.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(null);
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    if (
      notificationPermission !== "granted" ||
      !reminderSettings.browserEnabled ||
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return undefined;
    }

    const notifyUpcoming = () => {
      const now = Date.now();

      events.forEach((event) => {
        const reminderMinutes = Number(event.reminderMinutes);
        if (!reminderMinutes) {
          return;
        }

        const eventTime = getEventDateTime(event).getTime();
        const triggerTime = eventTime - reminderMinutes * 60 * 1000;
        const reminderKey = `${event.id}:${event.date}:${event.start}:${reminderMinutes}`;

        if (sentReminderKeysRef.current.has(reminderKey)) {
          return;
        }

        if (now >= triggerTime && now < eventTime) {
          new window.Notification(`${event.title}까지 ${getReminderLabel(reminderMinutes)}`, {
            body: `${formatDateLabel(event.date)} ${event.start} - ${event.end}`,
          });
          sentReminderKeysRef.current.add(reminderKey);
        }
      });
    };

    notifyUpcoming();
    const timer = window.setInterval(notifyUpcoming, 30000);
    return () => window.clearInterval(timer);
  }, [events, notificationPermission, reminderSettings.browserEnabled]);

  const workLogMap = new Map(workLogs.map((entry) => [entry.date, entry]));
  const conflictIds = findConflictIds(events);
  const calendarDays = buildCalendarDays(
    DISPLAY_YEAR,
    DISPLAY_MONTH_INDEX,
    events,
    workLogMap,
    selectedDate,
    conflictIds,
  );
  const selectedDateLabel = formatDateLabel(selectedDate);
  const selectedDateEvents = [...events]
    .filter((event) => event.date === selectedDate)
    .sort((left, right) => toMinutes(left.start) - toMinutes(right.start));
  const selectedEvent =
    selectedDateEvents.find((event) => event.id === selectedEventId) ??
    events.find((event) => event.id === selectedEventId) ??
    null;
  const selectedWorkLog = workLogMap.get(selectedDate) ?? null;
  const todayEvents = events.filter((event) => event.date === TODAY_KEY);
  const todayWorkLog = workLogMap.get(TODAY_KEY) ?? null;
  const weekKeys = buildWeekKeys(selectedDate);
  const weeklyReport = buildWeeklyReport(weekKeys, events, workLogs);
  const upcomingReminderEvents = [...events]
    .filter(
      (event) =>
        Number(event.reminderMinutes) > 0 && getEventDateTime(event).getTime() >= Date.now(),
    )
    .sort((left, right) => getEventDateTime(left) - getEventDateTime(right))
    .slice(0, 5);

  const validationMessage = (() => {
    if (!eventDraft.title.trim()) {
      return "일정 제목을 입력해 주세요.";
    }
    if (!eventDraft.date) {
      return "날짜를 선택해 주세요.";
    }
    if (!eventDraft.start || !eventDraft.end) {
      return "시작 시간과 종료 시간을 입력해 주세요.";
    }
    if (toMinutes(eventDraft.start) >= toMinutes(eventDraft.end)) {
      return "종료 시간은 시작 시간보다 뒤여야 합니다.";
    }
    return "";
  })();

  const summaryItems = [
    {
      label: "오늘 일정",
      value: `${todayEvents.length}건`,
      detail: `충돌 ${todayEvents.filter((event) => conflictIds.has(event.id)).length}건`,
      tone: "mint",
    },
    {
      label: "오늘 업무일지",
      value: todayWorkLog ? "작성 완료" : "미작성",
      detail: todayWorkLog ? "주간보고에 반영됨" : "퇴근 전에 기록 필요",
      tone: "amber",
    },
    {
      label: "이번 주 기록",
      value: `${weeklyReport.loggedDays}일`,
      detail: `${weeklyReport.totalEvents}건 일정`,
      tone: "coral",
    },
    {
      label: "예정 알림",
      value: `${upcomingReminderEvents.length}건`,
      detail:
        upcomingReminderEvents[0]
          ? `${upcomingReminderEvents[0].title} · ${upcomingReminderEvents[0].start}`
          : "예정된 알림 없음",
      tone: "sky",
    },
  ];

  function openCreateEventModal(dateKey = selectedDate) {
    setSelectedEventId(null);
    setEventDraft(createEventDraft(dateKey, getLastEventDefaults(events)));
    setSelectedDate(dateKey);
    setIsEventModalOpen(true);
    setFeedback("");
  }

  function openEditEventModal() {
    if (!selectedEvent) {
      return;
    }

    setEventDraft(createEventDraftFromEvent(selectedEvent));
    setIsEventModalOpen(true);
  }

  function openWorkLogModal(dateKey = selectedDate) {
    setSelectedDate(dateKey);
    setWorkLogDraft(createWorkLogDraft(dateKey, workLogMap.get(dateKey) ?? null));
    setIsWorkLogModalOpen(true);
  }

  function handleDateSelect(dateKey) {
    setSelectedDate(dateKey);
    setSelectedEventId(null);
    setIsDrawerOpen(true);
    setFeedback("");
  }

  function handleSelectEvent(event) {
    setSelectedEventId(event.id);
  }

  function handleEventDraftChange(inputEvent) {
    const { name, value } = inputEvent.target;
    setEventDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  }

  function handleWorkLogDraftChange(inputEvent) {
    const { name, value } = inputEvent.target;
    setWorkLogDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  }

  function handleDeleteEvent() {
    if (!selectedEvent) {
      return;
    }

    const shouldDelete = window.confirm("선택한 일정을 삭제할까요?");
    if (!shouldDelete) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== selectedEvent.id),
    );
    setSelectedEventId(null);
    setFeedback("선택한 일정이 삭제되었습니다.");
  }

  function handleEventSubmit(submitEvent) {
    submitEvent.preventDefault();

    if (validationMessage) {
      setFeedback(validationMessage);
      return;
    }

    const nextEvent = {
      id: selectedEventId ?? `evt-${Date.now()}`,
      title: eventDraft.title.trim(),
      date: eventDraft.date,
      start: eventDraft.start,
      end: eventDraft.end,
      type: eventDraft.type,
      status: eventDraft.status,
      reminderMinutes: Number(eventDraft.reminderMinutes),
      notes: eventDraft.notes.trim(),
    };

    setEvents((currentEvents) => {
      if (selectedEventId) {
        return currentEvents.map((event) =>
          event.id === selectedEventId ? nextEvent : event,
        );
      }
      return [...currentEvents, nextEvent];
    });

    setSelectedDate(nextEvent.date);
    setSelectedEventId(nextEvent.id);
    setIsDrawerOpen(true);
    setIsEventModalOpen(false);
    setFeedback(
      selectedEventId
        ? "일정 수정이 반영되었습니다."
        : "새 일정이 저장되고 선택일 상세가 갱신되었습니다.",
    );
  }

  function handleWorkLogSubmit(submitEvent) {
    submitEvent.preventDefault();

    const hasAnyContent = [
      workLogDraft.summary,
      workLogDraft.completed,
      workLogDraft.blockers,
      workLogDraft.nextPlan,
    ].some((value) => value.trim());

    if (!hasAnyContent) {
      setFeedback("업무일지 내용을 하나 이상 입력해 주세요.");
      return;
    }

    const nextEntry = {
      id: workLogMap.get(workLogDraft.date)?.id ?? `log-${Date.now()}`,
      date: workLogDraft.date,
      summary: workLogDraft.summary.trim(),
      completed: workLogDraft.completed.trim(),
      blockers: workLogDraft.blockers.trim(),
      nextPlan: workLogDraft.nextPlan.trim(),
    };

    setWorkLogs((currentEntries) => {
      const existingIndex = currentEntries.findIndex((entry) => entry.date === nextEntry.date);
      if (existingIndex >= 0) {
        return currentEntries.map((entry, index) =>
          index === existingIndex ? nextEntry : entry,
        );
      }
      return [...currentEntries, nextEntry];
    });

    setIsWorkLogModalOpen(false);
    setFeedback("업무일지가 저장되었습니다.");
  }

  async function handleCopyWeeklyReport() {
    try {
      await navigator.clipboard.writeText(weeklyReport.reportText);
      setFeedback("주간보고 초안을 클립보드에 복사했습니다.");
    } catch {
      setFeedback("클립보드 복사에 실패했습니다.");
    }
  }

  async function handleRequestNotificationPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setFeedback("이 브라우저는 알림 기능을 지원하지 않습니다.");
      return;
    }

    const nextPermission = await window.Notification.requestPermission();
    setNotificationPermission(nextPermission);

    if (nextPermission === "granted") {
      setReminderSettings((currentSettings) => ({
        ...currentSettings,
        browserEnabled: true,
      }));
      setFeedback("브라우저 알림이 활성화되었습니다.");
      return;
    }

    setFeedback("브라우저 알림 권한이 허용되지 않았습니다.");
  }

  function handleToggleBrowserReminder() {
    if (notificationPermission !== "granted") {
      setFeedback("먼저 브라우저 알림 권한을 허용해 주세요.");
      return;
    }

    setReminderSettings((currentSettings) => ({
      ...currentSettings,
      browserEnabled: !currentSettings.browserEnabled,
    }));
    setFeedback(
      reminderSettings.browserEnabled
        ? "브라우저 알림을 껐습니다."
        : "브라우저 알림을 켰습니다.",
    );
  }

  return (
    <div className="planner-shell">
      <div className="planner-background planner-background--left" />
      <div className="planner-background planner-background--right" />
      <main className="planner-app">
        <header className="calendar-first-header">
          <div>
            <p className="eyebrow">Schedule Planner</p>
            <h1>그날의 업무일지를 쌓아 주간보고까지 이어지는 캘린더</h1>
            <p className="calendar-first-header__copy">
              일정과 업무 기록을 날짜 기준으로 함께 쌓고, 누적된 기록을 바탕으로
              주간보고 초안을 바로 확인할 수 있는 personal work log MVP입니다.
            </p>
          </div>
          <div className="calendar-first-header__meta">
            <span>{formatMonthLabel(DISPLAY_YEAR, DISPLAY_MONTH_INDEX)}</span>
            <strong>{selectedDateLabel}</strong>
            <small>{selectedWorkLog ? "업무일지 작성 완료" : "업무일지 미작성"}</small>
          </div>
        </header>

        <SummaryStrip items={summaryItems} />

        <section className="calendar-first-toolbar">
          <div className="calendar-first-toolbar__group">
            <span className="toolbar-chip toolbar-chip--active">Month</span>
            <span className="toolbar-chip">{selectedDateLabel}</span>
            <span className="toolbar-chip">{formatWeekLabel(weekKeys)}</span>
          </div>
          <div className="calendar-first-toolbar__group">
            <button type="button" className="button" onClick={() => setIsDrawerOpen(true)}>
              선택일 보기
            </button>
            <button type="button" className="button" onClick={() => openCreateEventModal()}>
              일정 추가
            </button>
            <button type="button" className="button" onClick={() => openWorkLogModal()}>
              업무일지 작성
            </button>
            <button type="button" className="button" onClick={() => setIsWeeklyReportOpen(true)}>
              주간보고
            </button>
            <button type="button" className="button" onClick={() => setIsReminderModalOpen(true)}>
              알림 설정
            </button>
          </div>
        </section>

        {feedback ? <div className="calendar-first-feedback">{feedback}</div> : null}

        <section className="calendar-first-stage">
          <div className="panel calendar-first-stage__panel">
            <div className="panel__header panel__header--calendar">
              <div>
                <p className="eyebrow">Monthly View</p>
                <h2>{formatMonthLabel(DISPLAY_YEAR, DISPLAY_MONTH_INDEX)}</h2>
              </div>
              <span className="tag tag--soft-sky">
                이번 주 기록 {weeklyReport.loggedDays}일
              </span>
            </div>
            <div className="calendar-weekdays">
              {weekdayLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((day) => (
                <CalendarDay key={day.key} day={day} onSelect={handleDateSelect} />
              ))}
            </div>
          </div>
        </section>

        <SelectedDateDrawer
          open={isDrawerOpen}
          selectedDateLabel={selectedDateLabel}
          events={selectedDateEvents}
          workLog={selectedWorkLog}
          selectedEventId={selectedEventId}
          onClose={() => setIsDrawerOpen(false)}
          onSelectEvent={handleSelectEvent}
          onCreateEvent={() => openCreateEventModal(selectedDate)}
          onEditEvent={openEditEventModal}
          onDeleteEvent={handleDeleteEvent}
          onOpenWorkLog={() => openWorkLogModal(selectedDate)}
          conflictIds={conflictIds}
        />
        <EventModal
          open={isEventModalOpen}
          editing={Boolean(selectedEventId)}
          draft={eventDraft}
          validationMessage={validationMessage}
          onChange={handleEventDraftChange}
          onClose={() => setIsEventModalOpen(false)}
          onSubmit={handleEventSubmit}
        />
        <WorkLogModal
          open={isWorkLogModalOpen}
          draft={workLogDraft}
          onChange={handleWorkLogDraftChange}
          onClose={() => setIsWorkLogModalOpen(false)}
          onSubmit={handleWorkLogSubmit}
        />
        <WeeklyReportModal
          open={isWeeklyReportOpen}
          weekLabel={formatWeekLabel(weekKeys)}
          report={weeklyReport}
          onCopy={handleCopyWeeklyReport}
          onClose={() => setIsWeeklyReportOpen(false)}
        />
        <ReminderModal
          open={isReminderModalOpen}
          permission={notificationPermission}
          enabled={reminderSettings.browserEnabled}
          upcomingEvents={upcomingReminderEvents}
          onRequestPermission={handleRequestNotificationPermission}
          onToggleEnabled={handleToggleBrowserReminder}
          onClose={() => setIsReminderModalOpen(false)}
        />
      </main>
    </div>
  );
}
