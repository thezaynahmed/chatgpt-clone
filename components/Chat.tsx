"use client";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";
import Message from "./Message";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

type ChatInputTypes = { chatId: String };

const Chat = ({ chatId }: ChatInputTypes) => {
  const { data: session } = useSession();

  const [messages] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          String(session?.user?.email),
          "chats",
          String(chatId),
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages?.empty && (
        <>
          <p className="mt-10 text-center text-white">
            Type a prompt in below to get started!
          </p>
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-white animate-bounce" />
        </>
      )}
      {messages?.docs.map((message) => (
        <Message key={message.id} message={message.data()} />
      ))}
    </div>
  );
};

export default Chat;
