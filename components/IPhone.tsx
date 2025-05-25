import React from "react";

function IPhone() {
  return (
    <div
      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl mx-auto border border-gray-700"
      style={{ aspectRatio: "9/19.5" }}
    >
      <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10 border border-gray-800"></div>

        <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-10 text-white text-xs">
          <span className="font-medium p-1">9:41</span>
          <div className="flex items-center space-x-1"></div>
        </div>

        <div className="pt-12 px-6 h-full flex flex-col items-center justify-center text-white">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold bg-gradient-to-b from-neutral-600 text-center to-white bg-clip-text text-transparent">
                Chat with AI and make
              </h2>
              <h3 className="text-2xl font-extrabold ">
                <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
                  Professional
                </span>{" "}
                <span className="bg-gradient-to-b from-neutral-600 text-center to-white bg-clip-text text-transparent">
                  Portfolios.
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap justify-center mt-4">
              <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">
                AI-Powered
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}

export default IPhone;
