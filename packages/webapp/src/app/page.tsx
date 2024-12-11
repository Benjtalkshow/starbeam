"use client"

import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

export default function Home() {
  const launchParams = useLaunchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        if (launchParams?.initData) {
          const initData = launchParams.initData;
          const uid = initData.user?.id;
          const name = initData.user?.firstName + " " + initData.user?.lastName;
          setUserId(uid ?? null);
          setName(name);
        } else {
          console.log("No initData available");
          setError("No initData provided");
        }
      } catch (error) {
        console.error("Error in initializeComponent:", error);
        setError("An error occurred while initializing the component");
      } finally {
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, [launchParams]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">Starbeam</h1>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="text-lg">
            {name ? `Hello, ${name}!` : 'Hello, stranger!'}
          </div>
          <div className="text-lg">
            User ID: <span className="font-mono">{userId || 'Not available'}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
