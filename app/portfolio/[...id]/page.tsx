"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoSignOut } from "react-icons/go";
import { FiSave, FiSend, FiEye, FiMessageSquare } from "react-icons/fi";
import { signOut } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  role: string;
  content: string;
}

interface Portfolio {
  _id: string;
  title: string;
  description: string;
  data: string;
  score: number;
}

export default function PortfolioDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [score, setScore] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(null);
  // Mobile view state - true for preview, false for chat
  const [mobileView, setMobileView] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! let's get started to make your portfolio/resume. Let's start with what role you are aiming for.",
    },
  ]);
  const [bodyContent, setBodyContent] = useState(
    `<div class="text-center font-bold text-2xl text-black">PORTFOLIO</div>`
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/getPortfolioChat", {
        id: params.id,
      });

      if (response.data.success) {
        const portfolioData = response.data.portfolio;
        setPortfolio(portfolioData);
        setBodyContent(portfolioData.data || bodyContent);
        setScore(portfolioData.score || 0);

        const messagesData = response.data.messages;
        if (
          messagesData &&
          messagesData.message &&
          messagesData.message.length > 0
        ) {
          setMessages(messagesData.message);
        }
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                html, body {
                  height: 100%;
                  width: 100%;
                  background: white;
                  padding: 0px;
                  margin: 0px;
                  color: black;
                }
              </style>
            </head>
            <body>${bodyContent}</body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [bodyContent]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (params.id) {
      fetchPortfolio();
    }
  }, [params.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);

    const userMessage = { role: "user", content: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setMessage("");

    try {
      const response = await axios.post(`/api/generateResponse`, {
        query: message,
        id: params.id,
      });

      console.log(response);

      if (response.data.success) {
        const data = response.data.data;

        const aiMessage = { role: "assistant", content: data.message };
        setMessages([...updatedMessages, aiMessage]);

        setBodyContent(data.html);
        setScore(data.score || score);

        setPortfolio((prev) => {
          if (prev) {
            return {
              ...prev,
              title: data.title,
              description: data.description,
              data: data.html,
              score: data.score,
            };
          }
          return prev;
        });
      } else {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              response.data.msg ||
              "Sorry, I couldn't process your request. Please try again.",
          },
        ]);
      }

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const calculateMeterAngle = (score: number) => {
    return (score / 100) * 180;
  };

  const handleDownloadPDF = async () => {
    try {
      const printWindow = window.open("", "_blank");

      if (printWindow) {
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 1in;
                }
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              body {
                font-family: 'Times New Roman', serif;
                background: white;
                padding: 1in;
                margin: 0;
                color: black;
              }
            </style>
          </head>
          <body>
            ${bodyContent}
          </body>
        </html>
      `);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div
            className="font-bold text-lg md:text-2xl cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Portfolyze
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1 px-2 md:px-3 h-8 md:h-auto"
            >
              <FiSave size={14} />{" "}
              <span className="hidden sm:inline hover:cursor-pointer">
                Save as PDF
              </span>
            </Button>
            <div
              onClick={() => signOut()}
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <GoSignOut size={20} className="text-white" />
            </div>
            <Avatar className="h-7 w-7 md:h-8 md:w-8">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="bg-gray-800 text-xs">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Mobile Toggle Buttons */}
      <div className="md:hidden flex border-b border-gray-800">
        <button
          onClick={() => setMobileView(true)}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mobileView
              ? "bg-blue-600 text-white border-b-2 border-blue-400"
              : "bg-gray-900 text-gray-400 hover:text-white"
          }`}
        >
          <FiEye size={16} />
          Preview
        </button>
        <button
          onClick={() => setMobileView(false)}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            !mobileView
              ? "bg-blue-600 text-white border-b-2 border-blue-400"
              : "bg-gray-900 text-gray-400 hover:text-white"
          }`}
        >
          <FiMessageSquare size={16} />
          Chat
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Desktop Layout or Mobile Preview */}
        <div
          className={`w-full md:w-1/2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-800 overflow-auto ${
            !mobileView ? "hidden md:block" : "block"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
            {portfolio?.title || "My Portfolio"}
          </h2>
          <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
            {portfolio?.description || "Portfolio description will appear here"}
          </p>
          <div className="bg-white rounded-lg overflow-hidden min-h-64 md:min-h-96 xl:h-[calc(100vh-300px)]">
            {loading ? (
              <div className="text-gray-500 text-center py-12">Loading...</div>
            ) : bodyContent ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full min-h-[500px] border-none"
                title="Portfolio Content"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="text-gray-500 text-center py-12">
                No portfolio content available
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout or Mobile Chat */}
        <div
          className={`w-full md:w-1/2 flex flex-col h-full ${
            mobileView ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Score Meter */}
          <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col items-center">
            <div className="relative w-32 md:w-48 h-16 md:h-24 mb-1 md:mb-2">
              <div className="absolute w-full h-full bg-gray-800 rounded-t-full overflow-hidden"></div>
              <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full h-full bg-blue-600 rounded-t-full origin-bottom"
                  style={{
                    transform: `rotate(${calculateMeterAngle(score) - 180}deg)`,
                    transformOrigin: "bottom center",
                    transition: "transform 0.5s ease-out",
                  }}
                ></div>
              </div>
              <div className="absolute bottom-1 md:bottom-2 left-0 right-0 text-center">
                <span className="text-xl md:text-2xl font-bold">{score}</span>
                <span className="text-xs md:text-sm text-gray-400">/100</span>
              </div>
            </div>
            <span className="text-xs md:text-sm text-gray-400">
              Portfolio Score
            </span>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 p-3 md:p-6 overflow-y-auto max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-300px)]"
            ref={chatContainerRef}
          >
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading messages...
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-3/4 min-w-1/4 ${
                        msg.role === "user"
                          ? "bg-blue-900 border-blue-800"
                          : "bg-gray-900 border-gray-800"
                      }`}
                    >
                      <CardContent className="">
                        <p className="text-xs md:text-sm text-white whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 md:py-12 text-sm md:text-base">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Input - Always visible on mobile, only visible in chat mode */}
      <div
        className={`p-3 md:p-4 border-t border-gray-800 flex justify-center mt-auto ${
          mobileView ? "md:block hidden" : "block"
        }`}
      >
        <div className="flex gap-2 w-full max-w-3xl mx-auto">
          <Input
            placeholder="Ask about your portfolio..."
            className="bg-gray-900 border-gray-700 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            disabled={sending || loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !message.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 cursor-pointer"
          >
            {sending ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <FiSend size={18} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile-only chat input when in preview mode */}
      <div
        className={`md:hidden p-3 border-t border-gray-800 flex justify-center mt-auto ${
          !mobileView ? "hidden" : "block"
        }`}
      >
        <button
          onClick={() => setMobileView(false)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <FiMessageSquare size={16} />
          Start Chatting
        </button>
      </div>
    </div>
  );
}
