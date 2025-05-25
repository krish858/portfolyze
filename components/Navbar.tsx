"use client";
import { Button } from "./ui/button";
import { gsap } from "gsap";
import { signIn } from "next-auth/react";

function Navbar() {
  const handleHover = (e: any) => {
    gsap.to(e.target, {
      scale: 1.05,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleHoverOut = (e: any) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  };
  return (
    <div className="h-[64px] md:h-[80px] w-full bg-[#0D0D0D] backdrop-blur-[6px] opacity-0.9 p-[8px] md:p-0 md:px-[12px] lg:px-[16px] flex justify-between md:justify-around items-center font-extrabold text-[24px] lg:text-[26px]">
      <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
        Portfolyze
      </span>
      <span className="flex items-center space-x-[8px] md:space-x-[12px] lg:space-x-[16px] ">
        <Button
          className="text-[#E2E8F0] cursor-pointer text-[14px] lg:text-[16px] border-2 hover:border-0 border-blue-500 hover:text-white hover:bg-blue-400 transition-colors duration-200 hover:font-bold"
          variant="ghost"
          asChild
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOut}
          onClick={() => {
            signIn("google", {
              callbackUrl: "/dashboard",
            });
          }}
        >
          <div> Sign in </div>
        </Button>
      </span>
    </div>
  );
}

export default Navbar;
