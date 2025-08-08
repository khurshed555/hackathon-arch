"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const dict = {
  en: (await import("@/i18n/en.json")).default,
  uz: (await import("@/i18n/uz.json")).default,
  ru: (await import("@/i18n/ru.json")).default,
};

function useLocale() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const cookie = document.cookie.split("; ").find((r) => r.startsWith("lang="));
    const value = cookie?.split("=")[1];
    if (value && ["en", "uz", "ru"].includes(value)) setLang(value);
  }, []);
  return lang;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLocale();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Login failed");
      }
      const next = searchParams.get("next") || "/watch";
      router.push(next);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-950 dark:to-neutral-900 p-6">
      <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{dict[lang]["login.title"]}</h1>
            <p className="text-sm text-black/60 dark:text-white/60">
              {dict[lang]["login.subtitle"]}
            </p>
          </div>
          <LanguageSwitcher current={lang} />
        </div>
        {errorMessage ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {errorMessage}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">{dict[lang]["login.username"]}</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 px-3 outline-none focus:ring-2 ring-offset-2 ring-foreground/20"
              placeholder="admin"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">{dict[lang]["login.password"]}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 px-3 outline-none focus:ring-2 ring-offset-2 ring-foreground/20"
              placeholder="••••••••"
              required
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-md bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "…" : dict[lang]["login.submit"]}
          </button>
        </form>
      </div>
    </div>
  );
}

function LanguageSwitcher({ current }) {
  async function setLang(locale) {
    await fetch("/api/lang", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    location.reload();
  }
  const item = (value, label) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      className={`text-xs rounded-md border px-2 py-1 ${
        current === value ? "bg-foreground text-background" : "border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-2">
      {item("en", "EN")}
      {item("uz", "UZ")}
      {item("ru", "RU")}
    </div>
  );
}

