"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    await supabase.from("feedback").insert({
      message: message.trim(),
    });

    setMessage("");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2000);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-[#b8a0a0] hover:text-[#8b6b6b] underline underline-offset-2 transition-all"
      >
        send feedback
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
      {submitted ? (
        <p className="text-sm text-[#8b6b6b] italic">thank you! your message has been sent.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            placeholder="tell me what you think..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full p-3 bg-white/80 border border-[#f0e0e0] rounded-xl text-sm text-[#6b4e4e] placeholder:text-[#d4c0c0] focus:outline-none focus:border-[#e8b4b8] resize-none"
          />
          <div className="flex gap-2 justify-center">
            <button
              type="submit"
              className="bg-[#e8b4b8] hover:bg-[#d49b9b] text-white px-4 py-1.5 rounded-full text-xs tracking-wide transition-all"
            >
              send
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#c4a4a4] px-4 py-1.5 rounded-full text-xs tracking-wide hover:text-[#8b6b6b] transition-all"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}