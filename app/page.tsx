"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AddForm from "./add-form";

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
  const [energyFilter, setEnergyFilter] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("menu_items").select("*");
    if (data) setItems(data);
  }

  async function getSuggestion() {
    let query = supabase.from("menu_items").select("*");
    if (energyFilter) {
      query = query.eq("energy_level", energyFilter);
    }
    const { data } = await query;
    if (data && data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setSuggestion(random);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f4] p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h1
          className="text-6xl text-[#6b4e4e] mb-14"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          silvia&apos;s dopamine menu
        </h1>

        {/* Suggestion Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-[#f0e0e0] p-8 mb-10 text-center">
          <p
            className="text-3xl text-[#c48a8a] mb-6"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            place your order here:
          </p>

          <p className="text-[#7a5c5c] text-sm mb-3">select energy level</p>

          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {["", "LOW", "MEDIUM", "HIGH"].map((level) => (
              <button
                key={level}
                onClick={() => setEnergyFilter(level)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                  energyFilter === level
                    ? "bg-[#e8b4b8] text-white"
                    : "bg-white text-[#7a5c5c] border border-[#e8d5d5] hover:border-[#e8b4b8] hover:text-[#5c3d3d]"
                }`}
              >
                {level === "" ? "any" : level.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="border-t border-[#f0e5e5] pt-6">
            <button
              onClick={getSuggestion}
              className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-7 py-2.5 rounded-full text-sm tracking-wide transition-all"
            >
              surprise me
            </button>
          </div>

          {suggestion && (
            <div className="mt-6 p-6 bg-[#fdf6f7] rounded-2xl border border-[#f0d5d5] text-left">
              <p className="text-xs text-[#c48a8a] tracking-widest uppercase">{suggestion.category}</p>
              <p className="text-2xl text-[#6b4e4e] mt-2" style={{ fontWeight: 400 }}>
                {suggestion.title}
              </p>
              <div className="flex gap-4 mt-3 text-xs text-[#7a5c5c] tracking-wide">
                <span>{suggestion.energy_level.toLowerCase()}</span>
                {suggestion.time_required && <span>{suggestion.time_required} min</span>}
              </div>
              {suggestion.tags && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {suggestion.tags.split(",").map((tag) => (
                    <span key={tag} className="bg-white/80 px-3 py-1 rounded-full text-xs text-[#7a5c5c]">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <p
          className="text-4xl text-[#6b4e4e] mb-4"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          silvia&apos;s favorites
        </p>

        <AddForm onAdded={fetchItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/50 rounded-2xl p-5 border border-[#f0e0e0] hover:bg-white/80 transition-all"
            >
              <p className="text-[10px] text-[#c48a8a] tracking-widest uppercase">{item.category}</p>
              <p className="text-lg text-[#6b4e4e] mt-1" style={{ fontWeight: 400 }}>
                {item.title}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-[#7a5c5c] tracking-wide">
                <span>{item.energy_level.toLowerCase()}</span>
                {item.time_required && <span>{item.time_required} min</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}