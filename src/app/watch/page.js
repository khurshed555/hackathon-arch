import fs from "fs";
import path from "path";

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

export default function WatchPage() {
  const publicDir = path.resolve(process.cwd(), "public");
  const videos = fs.existsSync(publicDir)
    ? collectVideoPathsRecursively(publicDir)
    : [];

  return (
    <div className="mx-auto max-w-screen-2xl p-6 grid gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Watch</h1>
          <p className="text-sm text-black/60 dark:text-white/60">CCTV recordings.</p>
        </div>
        <a
          href="/api/logout"
          className="text-sm rounded-md border border-black/10 dark:border-white/15 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          Logout
        </a>
      </header>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 dark:border-white/15 p-8 text-center text-black/60 dark:text-white/60">
          No videos found in <code className="font-mono">public/</code>.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={video.src} className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-black/5 dark:bg-white/5">
              <div className="p-3 text-sm font-medium">Channel {index + 1}</div>
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

