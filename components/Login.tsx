"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => (
  <div className="bg-[#74AA9D] h-screen flex flex-col items-center justify-center text-center">
    <Image
      className="select-none"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/640px-ChatGPT_logo.svg.png"
      priority
      width={300}
      height={300}
      alt="logo"
      draggable="false"
    />
    <button
      onClick={() => signIn("google")}
      className="text-white font-bold text-3xl animate-pulse">
      Sign In to use ChatGPT
    </button>
  </div>
);

export default Login;
