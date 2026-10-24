"use client";

import { useState, useEffect, useCallback } from "react";
import { EventRequirement, FilterCategory } from "@/lib/types";
import { API } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import HeroFilter from "@/components/HeroFilter";
import RequirementCard from "@/components/RequirementCard";
import SkeletonCard from "@/components/SkeletonCard";
import RegisterModal from "@/components/RegisterModal";

export default function HomePage() {
  const [requirements, setRequirements] = useState<EventRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [showModal, setShowModal] = useState(false);

  const fetchRequirements = useCallback(async (cat: FilterCategory) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        cat === "all"
          ? `${API}/requirements`
          : `${API}/requirements?category=${cat}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setRequirements(json.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load requirements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequirements(filter);
  }, [filter, fetchRequirements]);

  return (
    <div className="min-h-screen bg-[#eef0f4]">
      <Navbar onRegisterClick={() => setShowModal(true)} />

      <HeroFilter filter={filter} onFilterChange={setFilter} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              id="retry-btn"
              onClick={() => fetchRequirements(filter)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && requirements.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">
              No requirements found for this category.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try selecting a different filter.
            </p>
          </div>
        )}

        {!loading && !error && requirements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requirements.map((req) => (
              <RequirementCard key={req._id} req={req} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchRequirements(filter)}
        />
      )}
    </div>
  );
}
