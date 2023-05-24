"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { db } from "../utils/firebase";
import ModelSelection from "./ModelSelection";

type ChatInputTypes = { chatId: String };
const ChatInput = ({ chatId }: ChatInputTypes) => {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendGptMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;
    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name!}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        String(session?.user?.email!),
        "chats",
        String(chatId),
        "messages"
      ),
      message
    );

    // Toast Notification
    const notification = toast.loading("ChatGPT is thinking...");

    await fetch(`/api/askQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    })
      .then(() => {
        // Success Toast Notification
        toast.success("ChatGPT has responded!", { id: notification });
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        toast.error("An error occurred while processing your request.", {
          id: notification,
        });
      });
  };

  return (
    <div>
      <div className="bg-[#40414F] shadow-sm mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl text-gray-300 rounded-lg text-sm">
        <form
          onSubmit={sendGptMessage}
          className="py-2 px-4 md:py-3 flex space-x-5">
          <input
            className="bg-transparent focus:outline-none text-base font-medium flex-1 
          disabled:cursor-not-allowed disabled:text-gray-600"
            disabled={!session}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Send a message."
          />
          <button
            type="submit"
            className="p-1 rounded-md disabled:cursor-not-allowed disabled:text-gray-400 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:opacity-40"
            disabled={!prompt || !session}>
            <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
          </button>
        </form>
      </div>
      <div className="md:hidden mx-2">
        <ModelSelection />
      </div>
      <p className="text-center text-xs px-3 pt-2 pb-3 text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        Free Research Preview. ChatGPT may produce inaccurate information about
        people, places, or facts.{" "}
        <span className="font-bold underline">ChatGPT Mar 23 Version</span>
        <span className="font-bold underline block mt-2">
          Your current chat ID: {chatId}
        </span>
      </p>
    </div>
  );
};

export default ChatInput;
