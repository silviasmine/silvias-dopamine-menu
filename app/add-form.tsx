"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AddForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchExistingTags();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchExistingTags() {
    const { data } = await supabase.from("menu_items").select("tags");
    if (data) {
      const tagsSet = new Set<string>();
      data.forEach((item: { tags: string | null }) => {
        if (item.tags) {
          item.tags.split(",").forEach((tag) => tagsSet.add(tag.trim().toLowerCase()));
        }
      });
      setExistingTags(Array.from(tagsSet).sort());
    }
  }

  function addTag(tag?: string) {
    const trimmed = (tag || tagInput).trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
    setTagDropdownOpen(false);
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!energyLevel) return;

    await supabase.from("menu_items").insert({
      title: title.toLowerCase(),
      category: "general",
      energy_level: energyLevel,
      time_required: timeRequired ? parseInt(timeRequired) : null,
      tags: tags.length > 0 ? tags.join(",") : null,
      is_public: true,
    });
    setTitle("");
    setEnergyLevel("");
    setTags([]);
    setTimeRequired("");
    setIsOpen(false);
    onAdded();
  }

  function resetForm() {
    setTitle("");
    setEnergyLevel("");
    setTags([]);
    setTimeRequired("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-5 py-2.5 rounded-full text-sm tracking-wide transition-all mb-8"
      >
        + add menu item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 rounded-3xl shadow-sm border border-[#f0e0e0] p-8 mb-8 text-left">
      <p className="text-[#b8a0a0] text-sm tracking-wider uppercase mb-5">add a dopamine menu item</p>

      <input
        type="text"
        placeholder="name this item (eg. listen to one favorite song)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      <select
        value={energyLevel}
        onChange={(e) => setEnergyLevel(e.target.value)}
        required
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#6b4e4e] focus:outline-none focus:border-[#e8b4b8]"
      >
        <option value="">select energy level</option>
        <option value="LOW">low</option>
        <option value="MEDIUM">medium</option>
        <option value="HIGH">high</option>
      </select>

      <input
        type="number"
        placeholder="time in minutes (optional)"
        value={timeRequired}
        onChange={(e) => setTimeRequired(e.target.value)}
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      {/* Tag input with bubbles + dropdown */}
      <div className="relative" ref={tagDropdownRef}>
        <div className="bg-white/80 border border-[#f0e0e0] rounded-xl p-3 mb-5 focus-within:border-[#e8b4b8]">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#fdf6f7] text-[#6b4e4e] px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-[#f0d5d5]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-[#c48a8a] hover:text-[#6b4e4e] ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="type a tag and press enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value.toLowerCase())}
              onKeyDown={handleTagKeyDown}
              onFocus={() => setTagDropdownOpen(true)}
              className="w-full bg-transparent text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none text-sm"
            />
            {existingTags.length > 0 && (
              <button
                type="button"
                onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                className="text-[#c4a4a4] hover:text-[#8b6b6b] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {tagDropdownOpen && existingTags.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-[#f0e0e0] py-2 z-10 max-h-40 overflow-y-auto">
            {existingTags
              .filter((tag) => !tags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="w-full text-left px-4 py-2 text-sm text-[#7a5c5c] hover:bg-[#fdf6f7] transition-all"
                >
                  {tag}
                </button>
              ))}
            {existingTags.filter((tag) => !tags.includes(tag)).length === 0 && (
              <p className="px-4 py-2 text-xs text-[#c4a4a4]">all tags added</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-6 py-2 rounded-full text-sm tracking-wide transition-all"
        >
          save
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="text-[#c4a4a4] px-6 py-2 rounded-full text-sm tracking-wide hover:text-[#6b4e4e] transition-all"
        >
          cancel
        </button>
      </div>
    </form>
  );
}