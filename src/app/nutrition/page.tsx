import { getServerAuthSession } from "~/server/auth";
import { Nutrition } from "./_nutrition/Nutrition";
import Link from "next/link";
import { useRef, useState } from "react";
import { openai } from "~/server/openai";
import { openAIRouter } from "~/server/api/routers/openaiRoute";

export default async function nutritionPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;


  //need to set the state to the message, and once that's set, send an API request. On submit. 
  //which is actually onKeyPress I think

  //I still think this could be routed through TRPC

  // const testingOpenAI = await openai.chat.completions.create({
  //   messages: [{ role: "system", content: "You are a helpful nutrition-focused assistant." }],
  //   model: "gpt-3.5-turbo",
  //   stream: true,
  // });
  //   const testingOpenAI = await openAIRouter.testStream.chat.completions.create({
  //   messages: [{ role: "system", content: "You are a helpful nutrition-focused assistant." }],
  //   model: "gpt-3.5-turbo",
  //   stream: true,
  // });

  // let string = '';

  // const toDisplay = async () => {
  // };

  
  // const messages = [];

  // console.log('testingOpenAI', testingOpenAI);


  // for await (const chunk of testingOpenAI) {
  //   const individualMessage = chunk.choices[0]?.delta?.content;
  //   if (individualMessage && individualMessage !== ''){ 
  //     messages.push(individualMessage);
  //   }
    
    // (chunk.choices[0]?.delta?.content || "");
// }

  //   for await (const chunk of stream) {
  //     process.stdout.write(chunk.choices[0]?.delta?.content || "");
  // }
  
  

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
        {/* <div>{toDisplay()}</div> */}
      </main>
  
  )
};
