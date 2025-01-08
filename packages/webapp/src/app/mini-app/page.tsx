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
    const [hasAccount, setHasAccount] = useState<boolean>(false);
    const [secureToken, setSecureToken] = useState<string | null>(null);

    // Check if account exists in storage and parse launch params
    useEffect(() => {
        // Parse launch params
        if (launchParams?.initData) {
            const initData = launchParams.initData;
            const uid = initData.user?.id;
            const userName = initData.user?.firstName + 
                (initData.user?.lastName ? " " + initData.user?.lastName : "");
            setUserId(uid ?? null);
            setName(userName);
        }

        // Check for existing account
        const storedPublicKey = localStorage.getItem('accountPublicKey');
        if (storedPublicKey) {
            setHasAccount(true);
        }
        setIsLoading(false);
    }, [launchParams]);

    const handleCreateAccount = async () => {
        try {
            if (!biometry.mount.isAvailable()) {
                setError("Biometry is not available on your device");
                return;
            }

            // Mount biometry if not already mounted
            try {
                await biometry.mount();
            } catch (mountError) {
                if (mountError instanceof Error && 
                    !mountError.message.toLowerCase().includes('already mounting')) {
                    throw mountError;
                }
            }

            // Request biometry access
            if (biometry.requestAccess.isAvailable()) {
                const granted = await biometry.requestAccess({
                    reason: "Authenticate to create new account"
                });
                if (!granted) {
                    setError("Biometry access denied");
                    return;
                }
            }

            // Authenticate user
            if (biometry.authenticate.isAvailable()) {
                const { status } = await biometry.authenticate({
                    reason: 'Please authenticate to create your account',
                });

                if (status === 'authorized') {
                    // Store the secure token
                    if (biometry.updateToken.isAvailable()) {
                        await biometry.updateToken({
                            token: "12345" // This would be your actual private key in production
                        });
                    }
                    
                    // Store public key in local storage
                    localStorage.setItem('accountPublicKey', 'dummy-public-key');
                    setHasAccount(true);
                } else {
                    setError("Authentication failed");
                }
            }
        } catch (err) {
            console.error("Error creating account:", err);
            setError("Failed to create account");
        }
    };

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

                {!hasAccount ? (
                    <button 
                        onClick={handleCreateAccount}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors"
                    >
                        Create Account
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-2xl font-bold">Balance</div>
                        <div className="text-3xl">0.00</div>
                    </div>
                )}

                {/* Debug info - you can remove this in production */}
                <div className="text-sm text-gray-500 mt-8">
                    <div>User: {name || 'Not available'}</div>
                    <div>ID: {userId || 'Not available'}</div>
                    <div>Has Account: {hasAccount ? 'Yes' : 'No'}</div>
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

