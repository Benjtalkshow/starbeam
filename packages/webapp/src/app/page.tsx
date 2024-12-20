import { useLaunchParams, biometry } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import TelegramAuth from '@/app/components/TelegramAuth';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const launchParams = useLaunchParams();

  useEffect(() => {
    const init = async () => {
      setIsLoading(false);
    };

    init();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TelegramAuth />
      {/* Add other components/content here */}
    </main>
  );
}