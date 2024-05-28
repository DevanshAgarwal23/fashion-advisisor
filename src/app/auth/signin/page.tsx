"use client"; // Ensure this is a Client Component

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';

const SignIn = () => {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/dashboard' }); // Redirect to dashboard after sign in
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <Image src="/vercel.svg" alt="Logo" width={50} height={50} className="m-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'freight-display-pro, serif' }}>
          Sign in to your account
        </h1>
        {providers && Object.values(providers).map((provider: any) => (
          <div key={provider.name} className="mb-4">
            <button
              onClick={() => handleSignIn(provider.id)}
              className="bg-[#51233A] text-white py-2 px-4 rounded w-full hover:bg-[#51233A]/90 transition duration-300 ease-in-out"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignIn;
