"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("STARTER");
  const [energyLevel, setEnergyLevel] = useState("LOW");
  const [timeRequired, setTimeRequired] = useState("");
  const [tags, setTags] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("menu_items").insert({
      title,
      category,
      energy_level: energyLevel,
      time_required: timeRequired ? parseInt(timeRequired) : null,
      tags: tags || null,
      is_public: true,
    });
    setTitle("");
    setTags("");
    setTimeRequired("");
    setIsOpen(false);
    onAdded();
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
    <form onSubmit={handleSubmit} className="bg-white/60 rounded-3xl shadow-sm border border-[#f0e0e0] p-8 mb-8">
      <p className="text-[#b8a0a0] text-sm tracking-wider uppercase mb-5">Add a dopamine menu item</p>

      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#8b6b6b] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 bg-white/80 border border-[#f0e0e0] rounded-xl text-[#8b6b6b] focus:outline-none focus:border-[#e8b4b8]"
        >
          <option value="STARTER">starter</option>
          <option value="MAIN">main</option>
          <option value="SIDE">side</option>
          <option value="DESSERT">dessert</option>
          <option value="SPECIAL">special</option>
        </select>

        <select
          value={energyLevel}
          onChange={(e) => setEnergyLevel(e.target.value)}
          className="p-3 bg-white/80 border border-[#f0e0e0] rounded-xl text-[#8b6b6b] focus:outline-none focus:border-[#e8b4b8]"
        >
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
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-3 text-[#8b6b6b] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      <input
        type="text"
        placeholder="tags: music, solo, quick"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl mb-5 text-[#8b6b6b] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8]"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-6 py-2 rounded-full text-sm tracking-wide transition-all"
        >
          save
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-[#c4a4a4] px-6 py-2 rounded-full text-sm tracking-wide hover:text-[#8b6b6b] transition-all"
        >
          cancel
        </button>
      </div>
    </form>
  );
}