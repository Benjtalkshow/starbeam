// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Fingerprint, AlertTriangle, CheckCircle2 } from 'lucide-react'

// // Mock functions to simulate Telegram Mini App SDK behavior
// const mockMiniApp = {
//   isSupported: () => true,
//   showPopup: async () => {}
// }

// const mockBiometry = {
//   isSupported: async () => true,
//   getType: async () => 'fingerprint' as 'fingerprint' | 'face',
//   requestBiometry: async () => ({ success: true })
// }

// export default function BiometricAuth() {
//   const [isAvailable, setIsAvailable] = useState(false)
//   const [biometryType, setBiometryType] = useState<'face' | 'fingerprint' | 'none'>('none')
//   const [isVerified, setIsVerified] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [status, setStatus] = useState<string>('Initializing...')

//   useEffect(() => {
//     const checkBiometrySupport = async () => {
//       try {
//         setStatus('Checking biometry support...')
        
//         // Check if running in Telegram Mini App (using mock for demonstration)
//         if (!mockMiniApp.isSupported()) {
//           setStatus('Not running in Telegram Mini App')
//           return
//         }

//         // Check biometry availability
//         const biometrySupport = await mockBiometry.isSupported()
//         setIsAvailable(biometrySupport)
        
//         if (biometrySupport) {
//           // Get biometry type
//           const type = await mockBiometry.getType()
//           setBiometryType(type)
//           setStatus(`Ready to use ${type} authentication`)
//         } else {
//           setStatus('Biometric authentication not available')
//         }
//       } catch (err) {
//         setStatus('Failed to initialize biometry')
//         setError(err instanceof Error ? err.message : 'Unknown error')
//       }
//     }

//     checkBiometrySupport()
//   }, [])

//   const handleBiometricVerification = async () => {
//     try {
//       setStatus('Requesting biometric verification...')
      
//       const result = await mockBiometry.requestBiometry({
//         title: 'Verify Your Identity',
//         description: 'Please verify your identity using biometrics'
//       })

//       if (result.success) {
//         setIsVerified(true)
//         setError(null)
//         setStatus('Successfully verified!')
        
//         // Show success message using Mini App native UI (mocked)
//         await mockMiniApp.showPopup({
//           title: 'Success',
//           message: 'Identity verified successfully!',
//           buttons: [{ type: 'ok' }]
//         })
//       } else {
//         throw new Error('Verification failed')
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Verification failed')
//       setStatus('Verification failed. Please try again.')
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Biometric Authentication</CardTitle>
//         <CardDescription>{status}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {!mockMiniApp.isSupported() && (
//           <Alert variant="warning">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertTitle>Warning</AlertTitle>
//             <AlertDescription>
//               This app must be opened in Telegram Mini App.
//             </AlertDescription>
//           </Alert>
//         )}

//         {mockMiniApp.isSupported() && !isAvailable && (
//           <Alert variant="warning">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertTitle>Warning</AlertTitle>
//             <AlertDescription>
//               Biometric authentication is not available on your device.
//             </AlertDescription>
//           </Alert>
//         )}

//         {error && (
//           <Alert variant="destructive" className="mt-4">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {isVerified && (
//           <Alert variant="success" className="mt-4">
//             <CheckCircle2 className="h-4 w-4" />
//             <AlertTitle>Success</AlertTitle>
//             <AlertDescription>
//               Identity verified successfully! Verified using {biometryType}.
//             </AlertDescription>
//           </Alert>
//         )}

//         {mockMiniApp.isSupported() && isAvailable && !isVerified && (
//           <Button
//             onClick={handleBiometricVerification}
//             className="w-full mt-4"
//           >
//             <Fingerprint className="mr-2 h-4 w-4" />
//             Verify with {biometryType === 'face' ? 'Face ID' : 'Fingerprint'}
//           </Button>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
// src/app/components/BiometricAuth.tsx
// 'use client'  // Add this at the top of the file!

// import { useState, useEffect } from 'react'
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import { Alert, AlertDescription } from "../../components/ui/alert"
// import { Fingerprint } from 'lucide-react'

// const BiometricAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [error, setError] = useState('');
//   const [isBiometricSupported, setIsBiometricSupported] = useState(false);

//   useEffect(() => {
//     // Check if Web Authentication API is supported
//     if (window.PublicKeyCredential) {
//       setIsBiometricSupported(true);
//     }

//     // Initialize Telegram WebApp
//     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
//       window.Telegram.WebApp.ready();
//     }
//   }, []);

//   const authenticateWithBiometric = async () => {
//     try {
//       const challenge = new Uint8Array(32);
//       window.crypto.getRandomValues(challenge);

//       const publicKeyCredentialRequestOptions = {
//         challenge,
//         timeout: 60000,
//         userVerification: 'required',
//         rpId: window.location.hostname,
//       };

//       const assertion = await navigator.credentials.get({
//         publicKey: publicKeyCredentialRequestOptions
//       });

//       if (assertion) {
//         setIsAuthenticated(true);
//         setError('');
//       }
//     } catch (err) {
//       setError('Biometric authentication failed. Please try again.');
//       console.error('Biometric auth error:', err);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Fingerprint className="w-6 h-6" />
//           Biometric Authentication
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {!isBiometricSupported ? (
//           <Alert variant="destructive" className="mb-4">
//             <AlertDescription>
//               Biometric authentication is not supported on this device.
//             </AlertDescription>
//           </Alert>
//         ) : isAuthenticated ? (
//           <div className="text-center">
//             <div className="text-green-500 font-medium mb-2">✓ Authentication Successful</div>
//             <p className="text-sm text-gray-600">You are now securely authenticated.</p>
//           </div>
//         ) : (
//           <>
//             <Button 
//               onClick={authenticateWithBiometric}
//               className="w-full flex items-center justify-center gap-2"
//             >
//               <Fingerprint className="w-4 h-4" />
//               Authenticate with Biometrics
//             </Button>
//             {error && (
//               <Alert variant="destructive" className="mt-4">
//                 <AlertDescription>
//                   {error}
//                 </AlertDescription>
//               </Alert>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BiometricAuth;



























// src/app/components/BiometricAuth.tsx
'use client'

import { useState, useEffect } from 'react'
import { Fingerprint } from 'lucide-react'

const BiometricAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)

  useEffect(() => {
    if (window.PublicKeyCredential) {
      setIsBiometricSupported(true)
    }

    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
    }
  }, [])

  const authenticateWithBiometric = async () => {
    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname,
      }

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })

      if (assertion) {
        setIsAuthenticated(true)
        setError('')
      }
    } catch (err) {
      setError('Biometric authentication failed. Please try again.')
      console.error('Biometric auth error:', err)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Biometric Authentication</h2>
      </div>

      <div className="space-y-4">
        {!isBiometricSupported ? (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            Biometric authentication is not supported on this device.
          </div>
        ) : isAuthenticated ? (
          <div className="text-center">
            <div className="text-green-500 font-medium mb-2">✓ Authentication Successful</div>
            <p className="text-sm text-gray-600">You are now securely authenticated.</p>
          </div>
        ) : (
          <>
            <button 
              onClick={authenticateWithBiometric}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              <Fingerprint className="w-4 h-4" />
              Authenticate with Biometrics
            </button>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BiometricAuth