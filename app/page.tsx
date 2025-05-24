import Navbar from "@/components/Navbar";
import StartNowBtn from "@/components/StartNowBtn";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import IPhone from "@/components/IPhone";

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#000000]">
      <Navbar />
      <div className="h-[1px] w-full bg-gradient-to-r from-[#2DD4BF] to-transparent" />
      <div className="flex justify-center w-full px-4">
        <div className="max-w-[1100px] w-full mt-8 md:mt-16 flex flex-col items-center">
          <h1 className="text-[28px] md:text-3xl lg:text-6xl font-bold md:font-extrabold bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white tracking-tight px-4">
            Win More Clients with{" "}
            <span className="text-[#20bea9]">Portfolyze,</span>
          </h1>
          <h1 className="text-[25px] md:text-3xl lg:text-6xl font-extrabold md:font-bold text-neutral-400 text-center px-4 mt-2">
            <span className="text-[#20bea9]">Make your portfolio</span> in 5
            mins!
          </h1>
          <StartNowBtn />
        </div>
      </div>

      <div className="hidden xl:block">
        <MacbookScroll />
        <footer className="border-t border-gray-800 py-4 mt-24">
          <div className="container mx-auto px-6 ">
            <div className="flex items-center justify-center text-gray-400">
              <span>© 2025 Portfolyze. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>

      <div className=" xl:hidden flex justify-center items-center mt-8 px-4 pb-8">
        <div className="relative w-full max-w-[280px]">
          <IPhone />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 rounded-[3rem] pointer-events-none"></div>
        </div>
      </div>

      <div className="block xl:hidden border-t border-gray-800 py-4 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center text-gray-400">
            <span>© 2025 Portfolyze. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
