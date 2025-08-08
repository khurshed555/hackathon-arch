import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value ?? null;

  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const expected = crypto.createHash("sha256").update(`${username}|${password}`).digest("hex");

  const isAuthed = session === expected;
  redirect(isAuthed ? "/watch" : "/login");
}
