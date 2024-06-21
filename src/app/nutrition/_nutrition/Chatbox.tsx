

export const Chatbox = ({onHandleSubmit, setInputValue}) => {

  //handleInputChange
  //handle onSubmit 
  //and state

  return (
    <div className="flex w-full justify-center">
    <div className="flex flex-col justify-center w-2/3 h-2/4 items-center bg-gray-500 border border-slate-700 rounded-md">
      <div className="pt-5">Log of conversation here</div>
      <div className="w-1/3">
        <input placeholder="Chatbox" type="text" className="text-black border border-white-700 w-full p" />
      </div>
    </div>
    </div>
  )
}