import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "../../utils/firebaseAdmin";
import query from "../../utils/queryApi";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //Destructuring prompt, chatId, model and session from Request Body
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt!" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  //ChatGPT Query
  const response = await query(prompt, chatId, model);

  const message: Message = {
    text: response || "ChatGPT cannot find answer for that!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGpt",
      name: "ChatGpt",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/640px-ChatGPT_logo.svg.png",
    },
  };

  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  res.status(200).json({ answer: message.text });
}
