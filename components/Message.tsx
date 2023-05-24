import { DocumentData } from "firebase/firestore";

const Message = ({ message }: { message: DocumentData }) => {
  const isChatGPT = message.user.name === "ChatGpt";
  return (
    <div className={`py-5 text-white ${isChatGPT && "bg-[#434654]"}`}>
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <img src={message.user.avatar} className="h-10 w-10" alt="" />
        <p className="pt-1 text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
