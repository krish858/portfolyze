"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

interface PORTFOLIO {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function AllPortfoliosPage() {
  const { data: session, status } = useSession();
  const [allPortfolios, setAllPortfolios] = useState<PORTFOLIO[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAllPortfolios = async () => {
      try {
        const res = await axios.get("/api/getAllPortfolios");
        setAllPortfolios(res.data.portfolios);
      } catch (error) {
        console.error(error);
      }
    };

    if (status === "authenticated") {
      fetchAllPortfolios();
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Portfolios</h1>
        <Button
          onClick={() => router.push("/dashboard")}
          className="text-blue-400 hover:bg-black cursor-pointer"
        >
          Back to Dashboard
        </Button>
      </div>

      {allPortfolios.length === 0 ? (
        <p className="text-gray-400">No portfolios found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPortfolios.map((portfolio: PORTFOLIO) => (
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
      )}
    </div>
  );
}
