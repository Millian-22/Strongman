'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chatbox } from "./Chatbox";

export const Nutrition = () => {

  // { role: "system", content: "You are a helpful nutrition-focused assistant." }
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  

  return (
    <section className="h-[75lvh]">
      <Chatbox />
      <div className="flex flex-row w-full h-1/2 justify-center items-center">
        <div className="flex flex-row h-full w-2/3 justify-between py-3 gap-x-20">
          <div className="bg-gray-500 w-2/4 border-white rounded-md text-white">Box Box</div>
          <div className="w-2/4 bg-gray-500 rounded-md">Recipe Box</div>
        </div>
        </div>
    </section>
  )
};
