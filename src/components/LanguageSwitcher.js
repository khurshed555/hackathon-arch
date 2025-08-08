"use client";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ current = "en" }) {
  const router = useRouter();
  function setLang(locale) {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `lang=${locale}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    router.refresh();
  }

  function Item({ value, label }) {
    const isActive = current === value;
    return (
      <button
        type="button"
        onClick={() => setLang(value)}
        className={`text-xs rounded-md border px-2 py-1 ${
          isActive
            ? "bg-foreground text-background"
            : "border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Item value="en" label="EN" />
      <Item value="uz" label="UZ" />
      <Item value="ru" label="RU" />
    </div>
  );
}

