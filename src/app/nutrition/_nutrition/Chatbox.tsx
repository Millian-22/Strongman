import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

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
  const utils = api.useUtils();
  

const {data: chatData} = api.openAI.getChat.useQuery(messages, {refetchOnWindowFocus: false});
const sendMessage = api.openAI.sendChatMessage.useMutation({
  onMutate: async (newMessage) => {

    await utils.openAI.getChat.cancel(messages);
    const userMessage = newMessage[0]?.content;

    if (!userMessage) { 
      return;
    }

    utils.openAI.getChat.setData(messages, (() => {
      return [userMessage];
    }));

    if (boxRef.current) {
      boxRef.current.innerHTML += `\n ${userMessage}`;
    }

  },
  onSettled: async () => {
    await utils.openAI.getChat.invalidate(messages);
  }
});

  const handleInputChange = useCallback(
    debounce((value) => {
      setInputValue(value);
    },5),
  []);

  const onSubmitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('chatData', chatData);
    console.log('inputValue', inputValue);
    console.log('messages', messages);
    // const systemMessage = chatData?.map((message) => message.join(''))
    //need a null handler here
    const systemMsgTest = chatData ? chatData?.join(''): '';
    
    //should have this jsut take in the value and let the mutation change how this is sent to the query.
    sendMessage.mutate([{role: 'user', content: inputValue}]);
    setMessages((prevMessages) => [...prevMessages, {role: 'system', content: systemMsgTest}, {role: 'user', content: inputValue}]);
    setInputValue('');
  }

  return (
    <>
    <div className="flex flex-col w-full justify-center items-center h-1/2">
      <div className="flex flex-col w-2/3 h-full bg-gray-500 border border-slate-700 rounded-md">
        <div className="pt-5 w-full px-4 flex-grow overflow-y-auto pb-5 whitespace-pre-wrap">
        {messages?.map((messages, key) => { 
          if (messages.role === 'user') { 
            return (
            <div key={key} className="flex flex-row justify-end">
              <div className="rounded-full bg-blue-300 w-1/3 text-center">{messages.content}</div>
            </div>)
          }
            return (<div className="mt-2 flex flex-row w-3/4 whitespace-normal" key={key}>{messages.content}</div>)
          }
        )}
        { chatData ? <div className="mt-2 flex flex-row w-3/4 whitespace-normal">{chatData.join('')}</div> : null }
        </div>
        <form className="w-full px-4 pb-4" onSubmit={onSubmitChat}>
          <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} />
        </form>
      </div>
    </div>
  </>
  )
}
