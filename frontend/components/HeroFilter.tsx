import { FilterCategory } from "@/lib/types";

interface HeroFilterProps {
  filter: FilterCategory;
  onFilterChange: (f: FilterCategory) => void;
}

const FILTER_BUTTONS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "planner", label: "Planner" },
  { key: "performer", label: "Performer" },
  { key: "crew", label: "Crew" },
];

export default function HeroFilter({ filter, onFilterChange }: HeroFilterProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#f0ece8] rounded-2xl px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Browse <span className="text-orange-500">Event Requirements</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">
            Discover roles, performers, and planners for every kind of event.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 justify-center">
            {FILTER_BUTTONS.map(({ key, label }) => (
              <button
                key={key}
                id={`filter-${key}`}
                onClick={() => onFilterChange(key)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 active:scale-95 ${
                  filter === key
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
