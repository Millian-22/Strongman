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
  const [systemMessage, setSystemMessage] = useState<Messages[]>([]);
  const utils = api.useUtils();
  

const {data: chatData} = api.openAI.getChat.useQuery(messages, {refetchOnWindowFocus: false});
// const {data: chatData} = api.openAI.getChat.useQuery({});
const sendMessage = api.openAI.sendChatMessage.useMutation({
  onMutate: async (newMessage) => {
    //this might need to be set in state because it only returns one message

    await utils.openAI.getChat.cancel(messages);

    const previousMessages = chatData?.join('');
    console.log('previousMessages', previousMessages);
    console.log('newMessage', newMessage);
    const test = [newMessage];
    utils.openAI.getChat.setData(messages, ((old) => {
      console.log('old', old);
      console.log('newMessage[0]?.content', newMessage[0]?.content);
      if (boxRef.current) {
        boxRef.current.innerHTML += ` ${newMessage[0].content}`;
      }

      return [newMessage[0]?.content ?? ''];
      // const oldMsg = old?.join('');
      // // return [{role: 'system', content: oldMsg}, newMessage[0]];
      // return {
      //   messages: newMessage,
      // }
    }));
    
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
  
      setSystemMessage([{role: 'system', content: chatData.join('')}]);
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [chatData, messages]);

  const onSubmitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('chatData', chatData);
    console.log('inputValue', inputValue);
    console.log('messages', messages);
    console.log('systemMessage', systemMessage);
    
    //should have this jsut take in the value and let the mutation change how this is sent to the query.
    sendMessage.mutate([{role: 'user', content: inputValue}]);
    setMessages((prevMessage) => [...prevMessage, ...systemMessage,  {role: 'user', content: inputValue}] );
    setInputValue('');
  }

  //map through a list of the messages, it displays on left or right side depepding on the 'role'
  //do I use a ref because I have the interval set up, do I use state, 
  //How do I get just the new part to render, not re-render the entire list of messages already there.
  //I think React is set up for this but it's time to check !  
  //I might have this mutation pattern wrong in liftingLog as well. I think I need to add a mutation and keep that state
  //I just remember it being slow though. 
  //I think even in Hugo's best practices you eventually pass it off to state. So I get invalidation and keeping client / server state apart
  //But I think you'd have to return to this eventually. And use state to handle the client interactions, even if you pass what they need
  //as a mutation. 
  //Whats the process. Initial useQuery returns the first stream. You type into box chatbox, it makes a mutation of the original call with a new message?
  //Should only be a mutation the entire time, first mutation is called 

  return (
    <>
    <div className="flex flex-col w-full justify-center items-center h-1/2">
      <div className="flex flex-col w-2/3 h-full bg-gray-500 border border-slate-700 rounded-md">
        <div className="pt-5 w-full px-4 flex-grow overflow-y-auto pb-5 whitespace-pre-wrap" ref={boxRef}></div>
        <form className="w-full px-4 pb-4" onSubmit={onSubmitChat}>
          <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} />
        </form>
      </div>
    </div>
    <div className="flex flex-col w-2/3 h-ful bg-white text-black">
      Test Box for Messages 
    {messages ? messages.map((message, key) => {
      return (<div key={key}>{message.content}</div>)
    }) : null
    }
    {/* <div>{chatData}</div> */}
    </div>
  </>
  )
}
