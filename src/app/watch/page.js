import fs from "fs";
import path from "path";
import en from "@/i18n/en.json";
import uz from "@/i18n/uz.json";
import ru from "@/i18n/ru.json";
import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function collectVideoPathsRecursively(baseDir) {
  const videoExtensions = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);
  const results = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (videoExtensions.has(ext)) {
          const publicRoot = path.resolve(process.cwd(), "public");
          const webPath = "/" + path.relative(publicRoot, absolute).replace(/\\/g, "/");
          results.push({ name: entry.name, src: webPath });
        }
      }
    }
  }
  walk(baseDir);
  return results;
}

export default async function WatchPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value ?? "en";
  const t = lang === "uz" ? uz : lang === "ru" ? ru : en;
  const publicDir = path.resolve(process.cwd(), "public");
  const videos = fs.existsSync(publicDir)
    ? collectVideoPathsRecursively(publicDir)
    : [];

  return (
    <div className="mx-auto max-w-screen-2xl p-6 grid gap-6">
      <header className="flex items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-2xl font-semibold">{t["watch.title"]}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">{t["watch.subtitle"]}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={lang} />
        <a
          href="/api/logout"
          className="text-sm rounded-md border border-black/10 dark:border-white/15 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          {t["watch.logout"]}
        </a>
        </div>
      </header>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 dark:border-white/15 p-8 text-center text-black/60 dark:text-white/60">
          {t["watch.empty"]}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={video.src} className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-black/5 dark:bg-white/5">
              <div className="p-3 text-sm font-medium">{t["channel.label"]} {index + 1}</div>
              <video
                src={video.src}
                className="w-full aspect-video bg-black object-cover"
                preload="metadata"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

