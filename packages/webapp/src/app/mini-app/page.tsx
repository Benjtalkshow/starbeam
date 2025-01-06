'use client'

import { useLaunchParams, biometry, init as initSDK, CancelablePromise } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

const MiniApp = () => {
    useEffect(() => {
        console.log('Initializing SDK');
        initSDK();
    }, []);

    const launchParams = useLaunchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        let mountPromise: CancelablePromise<void> | null = null;
        
        const initializeComponent = async () => {
            try {
                console.log('Initializing component');
                if (launchParams?.initData) {
                    const initData = launchParams.initData;
                    const uid = initData.user?.id;
                    const name = initData.user?.firstName + " " + initData.user?.lastName;
                    setUserId(uid ?? null);
                    setName(name);

                    // Check if biometry is available and mount it
                    if (biometry.mount.isAvailable()) {
                        console.log('Biometry is available');
                        try {
                            try {
                                console.log('Mounting biometry');
                                mountPromise = biometry.mount();
                                await mountPromise;
                                console.log('Biometry mount exited successfully');
                            } catch (mountError) {
                                // Only ignore "already mounting" error
                                if (mountError instanceof Error && 
                                    mountError.message.toLowerCase().includes('already mounting')) {
                                    console.log("Already mounting, skip this render...");
                                    return;
                                } else {
                                    throw mountError; // Re-throw any other errors
                                }
                            }
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

        initializeComponent();

        // Add cleanup function
        return () => {
            if (mountPromise) {
                console.log('Cancelling mount promise');
                mountPromise.cancel();
            }
        };
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
                    </div>
                </div>

                <div className="text-lg">
                    Available biometry: {biometry.mount.isAvailable() ? 'Yes' : 'No'}
                    <br />
                    Mounted: {biometry.isMounted() ? 'Yes' : 'No'}
                    <br />
                    State: {JSON.stringify(biometry.state())}
                    <br />
                    Supported: {biometry.isSupported() ? 'Yes' : 'No'}
                    <br />
                    Window.Telegram: {(window as any)?.Telegram ? 'Yes' : 'No'}
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

