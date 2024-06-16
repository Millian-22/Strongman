import Head from "next/head"
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export const Layout = ({session, children}) => {
  return (
    <>
    <div>
      <Head>
        <div className="flex flex-row w-full justify-between p-5">
        <p>Logged in as {session?.user?.email}</p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-orange-400 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        </div>
      </Head>
      </div>
      {/* <main>{children}</main> */}
      <div>JUST A TEST</div>
      {children}
  </>
  );
}