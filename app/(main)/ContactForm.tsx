"use client";
import { useRef, useState } from "react";

export default function ContactForm({ showAlert }: { showAlert: (e: string,e2:"error" | "success" | "warning") => void }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleRef.current?.value,
        message: messageRef.current?.value,
      }),
    });

    if (!res.ok) {
      showAlert("Błąd podczas wysyłania wiadomości", "error");
    } else {
      showAlert("Pomyślnie wysłano wiadomość", "success");
      // Clear form fields after successful send
    }
      if (titleRef.current) titleRef.current.value = "";
      if (messageRef.current) messageRef.current.value = "";
  }

  return (
    <form id="contact" className="space-y-6" onSubmit={handleSend}>
      <input
        ref={titleRef}
        placeholder="Temat"
        className="w-full px-6 py-4 bg-white/5 border focus:border-purple-500 rounded-xl text-white"
      />

      <textarea
        ref={messageRef}
        placeholder="Wiadomość"
        rows={6}
        className="w-full resize-none px-6 py-4 bg-white/5 border focus:border-purple-500 rounded-xl text-white"
      />

      <button
        type="submit"
        className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold"
      >
        Wyślij Wiadomość
      </button>
    </form>
  );
}
