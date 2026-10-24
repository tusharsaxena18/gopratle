import { capitalize } from "@/lib/helpers";

interface MultiChipsProps {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

export default function MultiChips({ options, selected, onChange }: MultiChipsProps) {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
            selected.includes(opt)
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-gray-600 border-orange-200 hover:bg-orange-50"
          }`}
        >
          {capitalize(opt)}
        </button>
      ))}
    </div>
  );
}
