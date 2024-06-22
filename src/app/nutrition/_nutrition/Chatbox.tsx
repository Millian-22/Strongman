import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

// const messagesArray = z.object({
//   role: z.string().optional(),
//   content: z.string().optional()
//  });
type MessageArrayKeys = "role" | "content" ; 
type Messages = Record<MessageArrayKeys, string>;

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  } as T;
}

export const Chatbox = () => {
  const boxRef = useRef(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<Messages[]>([]);

  const {data: chatData} = api.openAI.getChat.useQuery();


  const handleInputChange = useCallback(
    debounce((value) => {
      setInputValue(value);
    },10),
  []);

  
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
  
      // setMessages([{role: '', content: chatData.join('')}]);
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [chatData]);

  // console.log('messages', messages);
// 
  const onSubmitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('inputValue', inputValue);
    setInputValue('');
  }

  return (
    <div className="flex flex-col w-full justify-center items-center h-1/2">
      <div className="flex flex-col w-2/3 h-full bg-gray-500 border border-slate-700 rounded-md">
        <div className="pt-5 w-full px-4 flex-grow" ref={boxRef}></div>
        <form className="w-full px-4 pb-4" onSubmit={onSubmitChat}>
          <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} />
        </form>
      </div>
    </div>
  )
}