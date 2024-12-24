'use client'

import { useLaunchParams, biometry } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { Client, networks } from "@/../../../.soroban/account/src";

const greeter = new Client({
  ...networks.testnet,
  rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org", 
});

const MiniApp = () => {
    const launchParams = useLaunchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [greeting, setGreeting] = useState<string | null>(null);

    useEffect(() => {
        const initializeComponent = async () => {
            try {
                if (launchParams?.initData) {
                    const initData = launchParams.initData;
                    const uid = initData.user?.id;
                    const name = initData.user?.firstName + " " + initData.user?.lastName;
                    setUserId(uid ?? null);
                    setName(name);

                    // Check if biometry is available and mount it
                    if (biometry.mount.isAvailable()) {
                        try {
                            await biometry.mount();
                            if (biometry.isMounted()) {
                                // Attempt to authenticate the user
                                if (biometry.authenticate.isAvailable()) {
                                    const { status, token } = await biometry.authenticate({
                                        reason: 'Please authenticate to continue',
                                    });

                                    if (status === 'authorized') {
                                        console.log(`Authorized. Token: ${token}`);
                                    } else {
                                        console.log('Not authorized');
                                        setError("Biometry authentication failed");
                                    }
                                }
                            }
                        } catch (err) {
                            console.error("Error during biometry mounting:", err);
                            setError("Biometry mounting failed");
                        }
                    } else {
                        console.log("Biometry is not available");
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

        const fetchGreeting = async () => {
            try {
                const response = await greeter.hello({ to: "Soroban" });
                const greetingText = response.result?.join(" ") || "No greeting received";
                setGreeting(greetingText);
            } catch (error) {
                console.error("Error fetching greeting:", error);
                setError("Failed to fetch greeting");
            }
        };

        initializeComponent();
        fetchGreeting();
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
                        User ID: <span className="font-mono">{userId || 'Not available'}</span><br />
                        <h1>{greeting || "Loading..."}</h1>
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

