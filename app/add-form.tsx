"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
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
    if (!category || !energyLevel) return;

    await supabase.from("menu_items").insert({
      title: title.toLowerCase(),
      category: category,
      energy_level: energyLevel,
      time_required: timeRequired ? parseInt(timeRequired) : null,
      tags: tags.length > 0 ? tags.join(",") : null,
      is_public: true,
    });
    setTitle("");
    setCategory("");
    setEnergyLevel("");
    setTags([]);
    setTimeRequired("");
    setIsOpen(false);
    onAdded();
  }

  function resetForm() {
    setTitle("");
    setCategory("");
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

      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="p-3 bg-white/80 border border-[#f0e0e0] rounded-xl text-[#6b4e4e] focus:outline-none focus:border-[#e8b4b8]"
        >
          <option value="">select item type</option>
          <option value="STARTER">starter</option>
          <option value="MAIN">main</option>
          <option value="SIDE">side</option>
          <option value="DESSERT">dessert</option>
          <option value="SPECIAL">special</option>
        </select>

        <select
          value={energyLevel}
          onChange={(e) => setEnergyLevel(e.target.value)}
          required
          className="p-3 bg-white/80 border border-[#f0e0e0] rounded-xl text-[#6b4e4e] focus:outline-none focus:border-[#e8b4b8]"
        >
          <option value="">select energy level</option>
          <option value="LOW">low</option>
          <option value="MEDIUM">medium</option>
          <option value="HIGH">high</option>
        </select>
      </div>

      <input
        type="number"
        placeholder="time in minutes (optional)"
        value={timeRequired}
        onChange={(e) => setTimeRequired(e.target.value)}
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      {/* Tag input with bubbles */}
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
        <input
          type="text"
          placeholder="type a tag and press enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value.toLowerCase())}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          className="w-full bg-transparent text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none text-sm"
        />
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