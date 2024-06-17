import { getServerAuthSession } from "~/server/auth";
import { Nutrition } from "./_nutrition/Nutrition";
import Link from "next/link";
import { openai } from "~/server/api/routers/openai";

export default async function nutritionPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const testingOpenAI = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log('testingOpenAI', testingOpenAI);

  console.log('something here');


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
        <div>{JSON.stringify(testingOpenAI?.choices[0])}</div>
      </main>
  
  )
};
