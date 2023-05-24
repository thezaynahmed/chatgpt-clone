"use client";

import { collection, orderBy, query } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import NewChat from "../components/NewChat";
import { db } from "../utils/firebase";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";

function SideBar() {
  const { data: session } = useSession();

  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );

  const [parent, enableAnimations] = useAutoAnimate();
  return (
    <div className="p-2 flex flex-col h-screen">
      {/* NewChat */}
      <NewChat />
      <div className="flex-1 overflow-y-auto">
        <div>
          <div ref={parent} className="hidden md:inline">
            <ModelSelection />
          </div>
          {loading && (
            <div className="animate-pulse text-center text-white mt-2">
              <p>Loading Chats...</p>
            </div>
          )}
          <div ref={parent} className="flex flex-col space-y-2 my-2">
            {chats?.docs.map((chat, id) => (
              <ChatRow key={chat.id} id={chat.id} />
            ))}
          </div>
        </div>
      </div>
      {session && (
        <>
          <hr className="border-t border-white/20" />
          <div className="pt-4 pb-2">
            <img
              onClick={() => signOut()}
              src={session.user?.image || "fallback_pic_profile.svg"}
              alt="User Profile Picture"
              className="h-12 w-12 cursor-pointer rounded-full mx-auto mb-2
          hover:opacity-50"
            />
            <p className="text-white text-xs md:text-sm fw-bold text-center">
              {session.user?.email}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SideBar;
