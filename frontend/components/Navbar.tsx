import { PlusIcon } from "./Icons";

interface NavbarProps {
  onRegisterClick: () => void;
}

export default function Navbar({ onRegisterClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="text-gray-900 font-bold text-lg tracking-tight">
            Event<span className="text-orange-500">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-orange-500 border border-orange-400 hover:bg-orange-50 transition-colors">
            Login
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-orange-500 border border-orange-400 hover:bg-orange-50 transition-colors">
            Join
          </button>
          <button
            id="open-register-modal-btn"
            onClick={onRegisterClick}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            <PlusIcon />
            Post my Event
          </button>
        </div>
      </div>
    </header>
  );
}
