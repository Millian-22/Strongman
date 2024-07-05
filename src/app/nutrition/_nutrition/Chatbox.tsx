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

  //this uses a ref but I might end up changing it so that 
  //I can just display the new message in the correct box? 
  //can you set the interval on messages without a useEffect
  //this shouldn't be a useEffect it isn't a side effect. That's theissue 
  //but maybe if it were not awaiting the Data in the router it would work?
  //okay so useQuery doesn't actually handle streaming all that well yet. It does 
  //with server components if I convert the app, but I'm not sure it's worth it.
  //maybe in a big refactor just to push myself in a little. For now I'm going to handle
  useEffect(() => {
    console.log('boxRef', boxRef);
    if (chatData) {
      let index = 0;
      //joins chatgpt bits but then splits on spaces
      const concatenatedChatData = chatData.join('').split(' ');
      const testConcatChatData = chatData.join('').replace(/\n/g, ' \n ').split(' ').filter(Boolean);

      console.log('contatenatedChatData', testConcatChatData);
      const intervalId = setInterval(() => {
        if (boxRef.current && index < concatenatedChatData.length) {
          const nextElement = concatenatedChatData[index] + ' ';
          // boxRef.current.innerHTML += concatenatedChatData[index] + ' ';
          boxRef.current.innerHTML += nextElement === '\n' ? '<br>' : ` ${nextElement}`;
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 40); // Adjust the interval time to control the speed of word display
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [chatData]);

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
        <div className="pt-5 w-full px-4 flex-grow overflow-y-auto pb-5 whitespace-pre-wrap" ref={boxRef}>
          {messages ? messages.map((messages, key) => { return (<div key={key}>{messages.content}</div>)}) : null}
        </div>
        <form className="w-full px-4 pb-4" onSubmit={onSubmitChat}>
          <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} />
        </form>
      </div>
    </div>
    {/* <div className="flex flex-col w-2/3 h-ful bg-white text-black">
      Test Box for Messages 
    {messages ? messages.map((message, key) => {
      return (<div key={key}>{message.content}</div>)
    }) : null
    </div>
    } */}
    {/* this works. Only difference is getting the interval on here for only system messages */}
    {/* And just like that son you've done it. Now just make the interval a function that works for chatData */}
    {/* not a useEffect and you're goooooooodie */}
    <div className="flex flex-col w-2/3 h-ful bg-white text-black overflow-y-auto">TEST 2
    {messages ? messages.map((messages, key) => { return (<div key={key}>{messages.content}</div>)}) : null}
      {chatData ? <div>{chatData.join('')}</div> : null }
   </div>
    
  </>
  )
}
