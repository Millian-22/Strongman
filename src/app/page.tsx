import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({text: 'Welcome to Strongman'});
  const session = await getServerAuthSession();
  console.log('session', session);

  //commented out authorization for now
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2E8B57] to-[#fff] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
          {/* <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
          </Link> */}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>

            <div className="flex flex-row gap-x-10">
              <Link
                href={"/nutrition"}
                className="rounded-full bg-orange-400 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Nutrition Page
              </Link>
              <Link
                href={"/liftingLog"}
                className="rounded-full bg-orange-400 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Lifting Log
              </Link>
              {/* {session ? <Link
                href={"/liftingLog"}
                className="rounded-full bg-orange-400 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Lifting Log
              </Link>: null}
            
            {session ? <Link
              href={"/nutrition"}
              className="rounded-full bg-purple-800 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>: null} */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
