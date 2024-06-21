'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chatbox } from "./Chatbox";
import { openai } from "~/server/openai";
import { api } from "~/trpc/react";

export const Nutrition = () => {

  // { role: "system", content: "You are a helpful nutrition-focused assistant." }
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const boxRef = useRef(null);

  // const testingOpenAI = await openai.chat.completions.create({
  //   messages: [{ role: "system", content: "You are a helpful nutrition-focused assistant." }],
  //   model: "gpt-3.5-turbo",
  //   stream: true,
  // });


  const {data: testingOpenAI, isLoading} = api.openAI.getChat.useQuery();


  console.log('testingOpenAI', testingOpenAI);

  
  useEffect(() => {
    if (testingOpenAI) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (boxRef.current && index < testingOpenAI.length) {
          boxRef.current.innerHTML += testingOpenAI[index] + ' ';
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 100); // Adjust the interval time to control the speed of word display
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [testingOpenAI])

  const onHandleSubmit = (event) => {
    event.preventDefault();
    // setConversation([...conversation, {role: "user", content: inputValue}]);
    //set the message  
  };

  return (
    <>
      <Chatbox onHandleSubmit={onHandleSubmit} setInputValue={setInputValue}/>
        <div className="flex flex-row h-1/2 w-full justify-between py-8 px-12 gap-x-6">
        <div className="bg-gray-500 w-1/3 border-white rounded-md text-white overflow-y-auto" ref={boxRef}></div>
          <div className="bg-gray-500 w-1/3 border-white rounded-md text-white">Box Box</div>
          <div className="w-1/3 bg-gray-500 rounded-md">Recipe Box</div>
        </div>
      </>
  )
};
