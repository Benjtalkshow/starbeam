// import { useLaunchParams } from "@telegram-apps/sdk-react";
// import { useEffect, useState } from "react";
// import TelegramAuth from '@/app/components/TelegramAuth';

// export default function Page() {
//   const [isLoading, setIsLoading] = useState(true);
//   const launchParams = useLaunchParams();

//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(false);
//     };

//     init();
//   }, []);

//   if (isLoading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <TelegramAuth />
//       {/* Add other components/content here */}
//     </main>
//   );
// }


'use client';

import { useState } from 'react';
import BiometricAuth from './components/BiometricAuth';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Add any page-level initialization if needed
        setIsLoading(false);
      } catch (error) {
        console.error('Initialization failed:', error);
        setError('Failed to initialize the page');
      }
    };

    init();

    return () => {
      // Add any cleanup if needed
    };
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BiometricAuth />
      {/* Add other components here */}
    </main>
  );
}