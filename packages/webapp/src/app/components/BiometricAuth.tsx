
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