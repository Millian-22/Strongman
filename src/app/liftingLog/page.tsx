import { getServerAuthSession } from "~/server/auth";
import { LiftingLog } from "./_liftingLog/LiftingLog";
import Link from "next/link";


export default async function LiftingLogPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
  <main className="bg-gradient-to-b from-[#2E8B57] to-[#fff] h-lvh overflow-y-hidden text-white">
    <div className="flex flex-row w-full justify-between">
      <p>Logged in as {session?.user.email}</p>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-blue/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
    </div>
    <LiftingLog />
    </main>
  )
}