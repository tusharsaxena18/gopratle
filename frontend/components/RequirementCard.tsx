import { EventRequirement } from "@/lib/types";
import { CATEGORY_COLOR, EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatCurrency, capitalize } from "@/lib/helpers";
import { MapPinIcon, CalendarIcon } from "./Icons";

interface RequirementCardProps {
  req: EventRequirement;
}

export default function RequirementCard({ req }: RequirementCardProps) {
  const d = req.details;

  const chips: string[] = [];

  if ("guestCount" in d) chips.push(`${d.guestCount} guests`);
  if ("budget" in d) chips.push(formatCurrency(d.budget as number));
  if ("planningStage" in d) chips.push(capitalize(d.planningStage as string));
  if ("teamSize" in d) chips.push(`Team of ${d.teamSize}`);
  if ("performerCount" in d)
    chips.push(`${d.performerCount} performer${(d.performerCount as number) > 1 ? "s" : ""}`);
  if ("fee" in d) chips.push(formatCurrency(d.fee as number));
  if ("durationMinutes" in d) chips.push(`${d.durationMinutes} min`);
  if ("actType" in d) chips.push(capitalize(d.actType as string));
  if ("headcount" in d) chips.push(`${d.headcount} crew`);
  if ("payPerDay" in d) chips.push(`${formatCurrency(d.payPerDay as number)}/day`);
  if ("experienceLevel" in d) chips.push(capitalize(d.experienceLevel as string));

  const dateStr =
    req.dateMode === "range" && req.endDate
      ? `${formatDate(req.startDate)} – ${formatDate(req.endDate)}`
      : formatDate(req.startDate);

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide ${CATEGORY_COLOR[req.category]}`}
        >
          {req.category}
        </span>
        <span className="text-xs text-gray-400 font-medium">
          {EVENT_TYPE_LABELS[req.eventType]}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-150 leading-snug">
        {req.eventName}
      </h3>

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <MapPinIcon />
        <span>
          {req.location}
          {req.venue ? ` · ${req.venue}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <CalendarIcon />
        <span>{dateStr}</span>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((label, i) => (
            <span
              key={i}
              className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {typeof d.notes === "string" && d.notes && (
        <p className="text-xs text-gray-400 italic line-clamp-2">{d.notes}</p>
      )}
    </div>
  );
}
