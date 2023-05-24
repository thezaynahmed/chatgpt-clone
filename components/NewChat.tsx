import { async } from "@firebase/util";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../utils/firebase";

const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        userId: session?.user?.email,
        createdAt: serverTimestamp(),
      }
    );
    router.push(`/chat/${doc.id}`);
  };

  return (
    <div
      onClick={createNewChat}
      className="border border-gray-700 chatRow mb-2">
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
};

export default NewChat;
