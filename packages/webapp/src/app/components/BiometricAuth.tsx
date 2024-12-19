import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        showAlert: (message: string) => Promise<void>;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        requestBiometric: (params: {
          purpose: 'auth' | 'confirm_action';
          title: string;
          subtitle?: string;
        }) => Promise<{ success: boolean }>;
        availableBiometrics: () => Promise<{ 
          isBiometryAvailable: boolean;
          biometryType: 'face' | 'fingerprint' | 'none';
        }>;
      };
    };
  }
}

export default function BiometricAuth() {
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<'face' | 'fingerprint' | 'none'>('none');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Checking environment...');

  useEffect(() => {
    const checkEnvironment = async () => {
      // Check if running in Telegram WebApp
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        setStatus('Not running in Telegram. Please open this app in Telegram.');
        return;
      }

      setIsInTelegram(true);
      tg.ready();
      setStatus('Checking biometric availability...');

      try {
        const biometryStatus = await tg.availableBiometrics();
        setIsAvailable(biometryStatus.isBiometryAvailable);
        setBiometryType(biometryStatus.biometryType);
        setStatus(biometryStatus.isBiometryAvailable 
          ? `Ready to use ${biometryStatus.biometryType} authentication` 
          : 'Biometric authentication not available');
      } catch (err) {
        setStatus('Failed to check biometry availability');
        setIsAvailable(false);
      }
    };

    checkEnvironment();
  }, []);

  const handleBiometricVerification = async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setError("Please open this app in Telegram");
      return;
    }

    setStatus('Requesting biometric verification...');

    try {
      const result = await tg.requestBiometric({
        purpose: 'auth',
        title: 'Verify Your Identity',
        subtitle: 'Use biometric authentication to verify ownership'
      });

      if (result.success) {
        setIsVerified(true);
        setError(null);
        setStatus('Successfully verified!');
        await tg.showAlert("Verification successful!");
      } else {
        setError("Verification failed");
        setStatus('Verification failed. Please try again.');
      }
    } catch (err) {
      setError("Verification failed or was cancelled");
      setStatus('Verification failed or was cancelled. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Biometric Authentication</h2>
        <p className="text-sm text-gray-600 mt-1">{status}</p>
      </div>

      {!isInTelegram && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">
            ⚠️ This app must be opened in Telegram to use biometric authentication.
          </p>
        </div>
      )}

      {isInTelegram && !isAvailable && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">
            ⚠️ Biometric authentication is not available on your device.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-lg mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {isVerified && (
        <div className="p-4 bg-green-50 rounded-lg mt-4">
          <p className="text-green-600">✅ Identity verified successfully!</p>
          <p className="text-sm text-green-500 mt-1">
            Verified using {biometryType === 'face' ? 'Face ID' : 'Fingerprint'}
          </p>
        </div>
      )}

      {isInTelegram && isAvailable && !isVerified && (
        <button
          onClick={handleBiometricVerification}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {biometryType === 'face' ? 'Verify with Face ID' : 'Verify with Fingerprint'}
        </button>
      )}
    </div>
  );
}
