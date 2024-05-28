"use client"; 

import { signOut } from 'next-auth/react';
import Image from 'next/image';

const SignOut = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <Image src="/vercel.svg" alt="Logo" width={50} height={50} className="m-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'freight-display-pro, serif' }}>
          Are you sure you want to sign out?
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-[#51233A] text-white py-2 px-4 rounded w-full hover:bg-[#51233A]/90 transition duration-300 ease-in-out"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default SignOut;
