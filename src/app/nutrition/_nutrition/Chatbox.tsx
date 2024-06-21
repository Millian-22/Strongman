import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";


export const Chatbox = ({onHandleSubmit, setInputValue}) => {
  const boxRef = useRef(null);

  const {data: chatData} = api.openAI.getChat.useQuery();


  console.log('chatData', chatData);

  
  useEffect(() => {
    if (chatData) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (boxRef.current && index < chatData.length) {
          boxRef.current.innerHTML += chatData[index] + ' ';
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 100); // Adjust the interval time to control the speed of word display
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [chatData])

  return (
    <div className="flex flex-col w-full justify-center items-center h-1/2">
      <div className="flex flex-col w-2/3 h-full bg-gray-500 border border-slate-700 rounded-md">
        <div className="pt-5 w-full px-4 flex-grow" ref={boxRef}></div>
        <div className="w-full px-4 pb-4">
          <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full" />
        </div>
      </div>
    </div>
  )
}