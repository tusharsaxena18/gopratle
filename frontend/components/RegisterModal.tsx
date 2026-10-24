"use client";

import { useState } from "react";
import { Category, DateMode, EventType } from "@/lib/types";
import { API, EVENT_TYPES, EVENT_TYPE_LABELS, PLANNER_SERVICES, PLANNER_STAGES, PERFORMER_ACT_TYPES, PERFORMER_GENRES, CREW_ROLES, CREW_LEVELS } from "@/lib/constants";
import { capitalize } from "@/lib/helpers";
import { CloseIcon } from "./Icons";
import MultiChips from "./MultiChips";

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");
  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState("");

  const [services, setServices] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [planningStage, setPlanningStage] = useState("idea");
  const [teamSize, setTeamSize] = useState("");
  const [notes, setNotes] = useState("");

  const [actType, setActType] = useState("band");
  const [genres, setGenres] = useState<string[]>([]);
  const [performerCount, setPerformerCount] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [fee, setFee] = useState("");
  const [soundProvided, setSoundProvided] = useState(false);

  const [rolesNeeded, setRolesNeeded] = useState<string[]>([]);
  const [headcount, setHeadcount] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [payPerDay, setPayPerDay] = useState("");
  const [travelProvided, setTravelProvided] = useState(false);
  const [accommodationProvided, setAccommodationProvided] = useState(false);

  function validate(): string | null {
    if (eventName.trim().length < 3) return "Event name must be at least 3 characters.";
    if (!startDate) return "Start date is required.";
    if (location.trim().length < 2) return "Location must be at least 2 characters.";

    if (category === "planner") {
      if (services.length === 0) return "Select at least one service.";
      if (!guestCount || Number(guestCount) < 1) return "Guest count must be at least 1.";
      if (!budget || Number(budget) <= 0) return "Budget must be a positive number.";
      if (!teamSize || Number(teamSize) < 0) return "Team size must be 0 or more.";
    }

    if (category === "performer") {
      if (genres.length === 0) return "Add at least one genre.";
      if (!performerCount || Number(performerCount) < 1) return "Performer count must be at least 1.";
      if (!durationMinutes || Number(durationMinutes) <= 0) return "Duration must be a positive number.";
      if (!fee || Number(fee) <= 0) return "Fee must be a positive number.";
    }

    if (category === "crew") {
      if (rolesNeeded.length === 0) return "Select at least one role.";
      if (!headcount || Number(headcount) < 1) return "Headcount must be at least 1.";
      if (!payPerDay || Number(payPerDay) <= 0) return "Pay per day must be a positive number.";
      const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
      if (!shiftStart || !timeRe.test(shiftStart)) return "Shift start time is required (HH:mm).";
      if (!shiftEnd || !timeRe.test(shiftEnd)) return "Shift end time is required (HH:mm).";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    let details: Record<string, unknown> = {};
    if (category === "planner") {
      details = {
        servicesNeeded: services,
        guestCount: Number(guestCount),
        budget: Number(budget),
        planningStage,
        teamSize: Number(teamSize),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      };
    } else if (category === "performer") {
      details = {
        actType,
        genre: genres,
        performerCount: Number(performerCount),
        durationMinutes: Number(durationMinutes),
        fee: Number(fee),
        soundProvided,
      };
    } else {
      details = {
        rolesNeeded,
        headcount: Number(headcount),
        experienceLevel,
        shiftTiming: { start: shiftStart, end: shiftEnd },
        payPerDay: Number(payPerDay),
        travelProvided,
        accommodationProvided,
      };
    }

    const payload: Record<string, unknown> = {
      eventName: eventName.trim(),
      eventType,
      dateMode,
      startDate: new Date(startDate).toISOString(),
      location: location.trim(),
      ...(venue.trim() ? { venue: venue.trim() } : {}),
      ...(dateMode === "range" && endDate ? { endDate: new Date(endDate).toISOString() } : {}),
      details,
    };

    try {
      const res = await fetch(`${API}/register/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        const zodErrors = Array.isArray(body?.errors)
          ? (body.errors as { message: string; path?: string[] }[])
              .map((e) => [e.path?.at(-1), e.message].filter(Boolean).join(": "))
              .join(" · ")
          : null;
        throw new Error(zodErrors || body?.message || "Registration failed");
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Register Event</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Step {step} of 2 &mdash;{" "}
              {step === 1 ? "Choose a category" : "Fill in details"}
            </p>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-sm transition-colors duration-300 ${
                step >= s ? "bg-orange-500" : "bg-orange-100"
              }`}
            />
          ))}
        </div>

        <div className="p-6 flex-1">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                What are you looking for?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["planner", "performer", "crew"] as Category[]).map((cat) => {
                  const desc: Record<Category, string> = {
                    planner: "Full-service event coordination and management",
                    performer: "Artists, musicians, comedians, and entertainers",
                    crew: "Technical and support staff for your event",
                  };
                  return (
                    <button
                      key={cat}
                      id={`category-${cat}`}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setStep(2);
                      }}
                      className="flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-150 active:scale-95 bg-white border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                    >
                      <span className="font-semibold text-gray-800 capitalize text-base">
                        {cat}
                      </span>
                      <span className="text-xs text-gray-500 leading-relaxed">{desc[cat]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && category && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-orange-500 hover:underline flex items-center gap-1 -mb-2"
              >
                Back
              </button>

              <div>
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold capitalize">
                  {category}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Event Name *
                    </label>
                    <input
                      id="event-name-input"
                      type="text"
                      required
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g. Grand Wedding 2026"
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Event Type
                    </label>
                    <select
                      id="event-type-select"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Date Mode
                  </label>
                  <div className="flex gap-2">
                    {(["single", "range"] as DateMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDateMode(m)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          dateMode === m
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-600 border-orange-200 hover:bg-orange-50"
                        }`}
                      >
                        {m === "single" ? "Single day" : "Date range"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Start Date *
                    </label>
                    <input
                      id="start-date-input"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  {dateMode === "range" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        id="end-date-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Location *
                    </label>
                    <input
                      id="location-input"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Venue{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="venue-input"
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. The Grand Ballroom"
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-300"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-orange-100" />

              {category === "planner" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Planner Details
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Services Needed
                    </label>
                    <MultiChips options={PLANNER_SERVICES} selected={services} onChange={setServices} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Guest Count
                      </label>
                      <input
                        id="guest-count-input"
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Budget (Rs.)
                      </label>
                      <input
                        id="budget-input"
                        type="number"
                        min="0"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Team Size
                      </label>
                      <input
                        id="team-size-input"
                        type="number"
                        min="1"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Planning Stage
                    </label>
                    <select
                      id="planning-stage-select"
                      value={planningStage}
                      onChange={(e) => setPlanningStage(e.target.value)}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      {PLANNER_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {capitalize(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Notes{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="notes-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                  </div>
                </div>
              )}

              {category === "performer" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Performer Details
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Act Type
                    </label>
                    <select
                      id="act-type-select"
                      value={actType}
                      onChange={(e) => setActType(e.target.value)}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      {PERFORMER_ACT_TYPES.map((a) => (
                        <option key={a} value={a}>
                          {capitalize(a)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Genre
                    </label>
                    <MultiChips options={PERFORMER_GENRES} selected={genres} onChange={setGenres} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Performers
                      </label>
                      <input
                        id="performer-count-input"
                        type="number"
                        min="1"
                        value={performerCount}
                        onChange={(e) => setPerformerCount(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Duration (min)
                      </label>
                      <input
                        id="duration-input"
                        type="number"
                        min="1"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Fee (Rs.)
                      </label>
                      <input
                        id="fee-input"
                        type="number"
                        min="0"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                    <input
                      id="sound-provided-checkbox"
                      type="checkbox"
                      checked={soundProvided}
                      onChange={(e) => setSoundProvided(e.target.checked)}
                      className="accent-orange-500 w-4 h-4"
                    />
                    Sound equipment provided by organizer
                  </label>
                </div>
              )}

              {category === "crew" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Crew Details
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Roles Needed
                    </label>
                    <MultiChips options={CREW_ROLES} selected={rolesNeeded} onChange={setRolesNeeded} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Headcount
                      </label>
                      <input
                        id="headcount-input"
                        type="number"
                        min="1"
                        value={headcount}
                        onChange={(e) => setHeadcount(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Pay Per Day (Rs.)
                      </label>
                      <input
                        id="pay-per-day-input"
                        type="number"
                        min="0"
                        value={payPerDay}
                        onChange={(e) => setPayPerDay(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Experience Level
                    </label>
                    <select
                      id="experience-level-select"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      {CREW_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {capitalize(l)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Shift Start
                      </label>
                      <input
                        id="shift-start-input"
                        type="time"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Shift End
                      </label>
                      <input
                        id="shift-end-input"
                        type="time"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        id="travel-provided-checkbox"
                        type="checkbox"
                        checked={travelProvided}
                        onChange={(e) => setTravelProvided(e.target.checked)}
                        className="accent-orange-500 w-4 h-4"
                      />
                      Travel provided
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        id="accommodation-provided-checkbox"
                        type="checkbox"
                        checked={accommodationProvided}
                        onChange={(e) => setAccommodationProvided(e.target.checked)}
                        className="accent-orange-500 w-4 h-4"
                      />
                      Accommodation provided
                    </label>
                  </div>
                </div>
              )}

              <button
                id="submit-register-btn"
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-150 active:scale-95 text-sm"
              >
                {submitting ? "Registering..." : "Register Event"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
