"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoSignOut } from "react-icons/go";
import { signOut } from "next-auth/react";
import axios from "axios";

interface PORTFOLIO {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function ScanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [recentPortfolio, setRecentPortfolio] = useState<PORTFOLIO[]>([]);

  const fetchRecentPortfolio = async () => {
    try {
      const res = await axios.get("/api/getRecentPortfolios");
      setRecentPortfolio(res.data.portfolios);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    fetchRecentPortfolio();
  }, []);

  const handleCreateNew = async () => {
    try {
      const res = await axios.get("/api/createPortfolio");
      console.log(res.data.portfolio._id);
      const mres = await axios.post("/api/createMessage", {
        id: res.data.portfolio._id,
      });
      router.push(`/portfolio/${res.data.portfolio._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <div className="flex justify-end items-center mb-8">
        <div
          onClick={() => signOut()}
          className="mr-4 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
        >
          <GoSignOut size={26} className="text-white" />
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={session?.user?.image || ""}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="bg-gray-800">
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="text-gray-400 text-xl">Ready to make your next resume?</p>
      </div>

      <div className="max-w-4xl mx-auto w-full mb-auto xl:mt-6">
        <div className="flex flex-col gap-4">
          <div className="p-6">
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 text-lg h-auto py-2 rounded-lg font-bold cursor-pointer"
              >
                Create New
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-12">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Recent Portfolio</h2>
          <Button
            variant="link"
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
            onClick={() => {
              router.push("/portfolios");
            }}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(recentPortfolio) &&
            recentPortfolio.map((portfolio: PORTFOLIO) => (
              <Card
                key={portfolio._id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {portfolio.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <p className="text-gray-400 mb-4 text-sm">
                    {portfolio.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-4 ">
                    <span className="text-xs text-gray-500">
                      {portfolio.date}
                    </span>
                    <Button
                      onClick={() => {
                        router.push(`/portfolio/${portfolio._id}`);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 cursor-pointer"
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
