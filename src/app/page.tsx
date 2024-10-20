"use client";
import * as React from "react";

import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

export default function Home() {
  const [text, setText] = React.useState("Signify");

  return (
    <main className="bg-[url('/images/bg.png')] w-screen h-screen flex flex-col items-center gap-2 md:gap-6 justify-center">
      <NextImage
        src="/Signify Logo White.png"
        width={2000}
        height={2000}
        alt="Signify"
        className="max-w-[50%] md:max-w-[20%]"
        onMouseEnter={() => setText("Coming soon!")}
        onMouseLeave={() => setText("Signify")}
      />
      <div className="w-max">
        <Typography
          variant="h1"
          weight="bold"
          className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-5xl text-white font-bold max-sm:text-[40px]"
        >
          {text}
        </Typography>
      </div>
    </main>
  );
}
