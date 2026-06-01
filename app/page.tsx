"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AddForm from "./add-form";
import FeedbackForm from "./feedback-form";

type MenuItem = {
  id: number;
  title: string;
  category: string;
  energy_level: string;
  time_required: number | null;
  tags: string | null;
};

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [suggestion, setSuggestion] = useState<MenuItem | null>(null);
  const [energyFilter, setEnergyFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("menu_items").select("*");
    if (data) {
      setItems(data);
      const tagsSet = new Set<string>();
      data.forEach((item: MenuItem) => {
        if (item.tags) {
          item.tags.split(",").forEach((tag) => tagsSet.add(tag.trim().toLowerCase()));
        }
      });
      setAllTags(Array.from(tagsSet).sort());
    }
  }

  function toggleFilter(type: "energy" | "time", value: string) {
    if (type === "energy") {
      setEnergyFilter(energyFilter === value ? null : value);
    } else if (type === "time") {
      setTimeFilter(timeFilter === value ? null : value);
    }
    setSuggestion(null);
    setHasSearched(false);
  }

  function selectTag(tag: string) {
    setTagFilter(tagFilter === tag ? null : tag);
    setTagDropdownOpen(false);
    setSuggestion(null);
    setHasSearched(false);
  }

  function getFilteredItems(): MenuItem[] {
    let filtered = [...items];

    if (energyFilter) {
      filtered = filtered.filter((item) => item.energy_level === energyFilter);
    }
    if (timeFilter === "quick") {
      filtered = filtered.filter(
        (item) => item.time_required !== null && item.time_required <= 5
      );
    } else if (timeFilter === "short") {
      filtered = filtered.filter(
        (item) =>
          item.time_required !== null &&
          item.time_required >= 5 &&
          item.time_required <= 15
      );
    } else if (timeFilter === "long") {
      filtered = filtered.filter(
        (item) => item.time_required !== null && item.time_required >= 15
      );
    }
    if (tagFilter) {
      filtered = filtered.filter(
        (item) =>
          item.tags &&
          item.tags.toLowerCase().includes(tagFilter.toLowerCase())
      );
    }

    return filtered;
  }

  function startSearching() {
    setHasSearched(true);
    const filtered = getFilteredItems();
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setSuggestion(random);
    } else {
      setSuggestion(null);
    }
  }

  function hasActiveFilters() {
    return energyFilter || timeFilter || tagFilter;
  }

  function clearAllFilters() {
    setEnergyFilter(null);
    setTimeFilter(null);
    setTagFilter(null);
    setSuggestion(null);
    setHasSearched(false);
  }

  return (
    <main className="min-h-screen bg-[#faf7f4] p-8 pb-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h1
          className="text-6xl text-[#6b4e4e] mb-14"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          silvia&apos;s dopamine menu
        </h1>

        {/* Search Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-[#f0e0e0] p-8 mb-10 text-center">
          <p
            className="text-3xl text-[#c48a8a] mb-6"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            search for an item on our dopamine list!
          </p>

          {/* Energy Level */}
          <div className="mb-5">
            <p className="text-[#7a5c5c] text-xs tracking-wide mb-2">energy level</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {["LOW", "MEDIUM", "HIGH"].map((level) => (
                <button
                  key={level}
                  onClick={() => toggleFilter("energy", level)}
                  className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                    energyFilter === level
                      ? "bg-[#e8b4b8] text-white"
                      : "bg-white text-[#7a5c5c] border border-[#e8d5d5] hover:border-[#e8b4b8]"
                  }`}
                >
                  {level.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-5">
            <p className="text-[#7a5c5c] text-xs tracking-wide mb-2">time</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { value: "quick", label: "under 5 min" },
                { value: "short", label: "5-15 min" },
                { value: "long", label: "15+ min" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => toggleFilter("time", t.value)}
                  className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                    timeFilter === t.value
                      ? "bg-[#e8b4b8] text-white"
                      : "bg-white text-[#7a5c5c] border border-[#e8d5d5] hover:border-[#e8b4b8]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <p className="text-[#7a5c5c] text-xs tracking-wide mb-2">tags</p>
              <div className="relative inline-block" ref={tagDropdownRef}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="type or select a tag"
                    value={tagFilter || ""}
                    onChange={(e) => {
                      setTagFilter(e.target.value.toLowerCase() || null);
                      setSuggestion(null);
                      setHasSearched(false);
                    }}
                    onFocus={() => setTagDropdownOpen(true)}
                    className="px-5 py-2 rounded-full text-sm tracking-wide bg-white text-[#7a5c5c] border border-[#e8d5d5] focus:outline-none focus:border-[#e8b4b8] placeholder:text-[#d4c0c0] w-48"
                  />
                  <button
                    type="button"
                    onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                    className="px-3 py-2 rounded-full text-sm transition-all bg-white text-[#7a5c5c] border border-[#e8d5d5] hover:border-[#e8b4b8]"
                  >
                    <svg className={`w-3 h-3 transition-transform ${tagDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {tagDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-lg border border-[#f0e0e0] py-2 z-10 min-w-[160px] max-h-48 overflow-y-auto">
                    {allTags
                      .filter((tag) => tag.includes(tagFilter || ""))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setTagFilter(tag);
                            setTagDropdownOpen(false);
                            setSuggestion(null);
                            setHasSearched(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-all ${
                            tagFilter === tag
                              ? "bg-[#fdf6f7] text-[#e8b4b8]"
                              : "text-[#7a5c5c] hover:bg-[#fdf6f7]"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    {allTags.filter((tag) => tag.includes(tagFilter || "")).length === 0 && (
                      <p className="px-4 py-2 text-xs text-[#c4a4a4]">no matching tags</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clear filters */}
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#c48a8a] hover:text-[#6b4e4e] mb-4 transition-all"
            >
              clear all filters
            </button>
          )}

          <div className="border-t border-[#f0e5e5] pt-6">
            <button
              onClick={startSearching}
              className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-7 py-2.5 rounded-full text-sm tracking-wide transition-all"
            >
              start searching
            </button>
          </div>

          {suggestion && (
            <div className="mt-6 bg-[#fdf6f7] rounded-2xl p-5 border border-[#f0d5d5] text-left max-w-sm mx-auto">
              <p className="text-lg text-[#6b4e4e] mt-1" style={{ fontWeight: 400 }}>
                {suggestion.title}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-[#7a5c5c] tracking-wide">
                <span>{suggestion.energy_level.toLowerCase()}</span>
                {suggestion.time_required && <span>{suggestion.time_required} min</span>}
              </div>
              {suggestion.tags && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {suggestion.tags.split(",").map((tag) => (
                    <span key={tag} className="bg-white/80 px-3 py-1 rounded-full text-xs text-[#7a5c5c]">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasSearched && !suggestion && (
            <p className="mt-6 text-sm text-[#c48a8a]">
              no items match these filters. try broadening your search.
            </p>
          )}
        </div>

        {/* The Menu Section */}
        <p
          className="text-4xl text-[#6b4e4e] mb-4"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          the menu
        </p>

        <AddForm onAdded={fetchItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#fdf6f7] rounded-2xl p-5 border border-[#f0d5d5] hover:bg-[#fdf2f3] transition-all"
            >
              <p className="text-lg text-[#6b4e4e] mt-1" style={{ fontWeight: 400 }}>
                {item.title}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-[#7a5c5c] tracking-wide">
                <span>{item.energy_level.toLowerCase()}</span>
                {item.time_required && <span>{item.time_required} min</span>}
              </div>
              {item.tags && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {item.tags.split(",").map((tag) => (
                    <span key={tag} className="bg-white/70 px-2.5 py-0.5 rounded-full text-xs text-[#7a5c5c]">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

            {/* Feedback */}
      <div className="text-center mt-16">
        <FeedbackForm />
      </div>

      {/* Credits Footer */}
      <footer className="text-center mt-4">
        <p className="text-xs text-[#b8a0a0]">
          made with love by{" "}
          <a
            href="https://github.com/silviasmine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8b6b6b] hover:text-[#6b4e4e] underline underline-offset-2 transition-all"
          >
            silvia
          </a>
        </p>
      </footer>
    </main>
  );
}