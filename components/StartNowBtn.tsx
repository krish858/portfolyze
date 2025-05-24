"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

function StartNowBtn() {
  return (
    <Button
      className="mt-8 md:mt-20 w-[150px] h-[40px] md:w-[180px] md:h-[50px] cursor-pointer bg-gradient-to-r from-[#0ec4ab] to-transparent text-neutral-200 text-2xl font-bold"
      onClick={() => {
        signIn("google", {
          callbackUrl: "/dashboard",
        });
      }}
    >
      Start Now
    </Button>
  );
}

export default StartNowBtn;
