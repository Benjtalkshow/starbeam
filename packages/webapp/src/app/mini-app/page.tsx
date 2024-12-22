'use client'

import { useLaunchParams, biometry } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { fetchDataFromContract } from '@/../../temp/src'; // Import the fetchDataFromContract function

const MiniApp = () => {
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

                    // Fetch data from the contract
                    try {
                        const data = await fetchDataFromContract("CBGHASHQZIWWTJFWQOPEG5GXEJYV3XLQEQHDR4ABHZXUM5OYSS65U5T4"); // Use the contract ID
                        console.log('Fetched data:', data);
                    } catch (fetchError) {
                        console.error("Error fetching data from contract:", fetchError);
                        setError("Failed to fetch data from contract");
                    }
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

const MiniAppPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <MiniApp /> : null;
}

export default MiniAppPage;

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
                        User ID: <span className="font-mono">{userId || 'Not available'}</span><br />
                        <h1>{greeting || "Loading..."}</h1>
                    </div>
                </div>
            </main>
        </div>
    )
}

const MiniAppPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <MiniApp /> : null;
}

export default MiniAppPage