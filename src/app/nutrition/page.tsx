import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { Nutrition } from "./_nutrition/Nutrition";

export default async function nutritionPage() {
  const session = await getServerAuthSession();
  // if (!session?.user) return null;

  return (
    <main className="bg-gradient-to-b from-[#2E8B57] to-[#fff] h-lvh overflow-y-hidden text-white">
        <div className="flex flex-row w-full justify-between p-5">
          <p>Logged in as {session?.user.email}</p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-orange-400 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
        <Nutrition />
      </main>
  
  )
};
