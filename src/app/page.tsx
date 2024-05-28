"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import bg from "../../public/bg.png";
import { useCredits } from "./lib/CreditContext";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  const useRoute = useRouter();

  console.log(session?.data?.user);

  const {fetchCredits } = useCredits();

  useEffect(() => {
      // Fetch user suggestions on initial load
      fetchCredits();
  }, []);

  return (
    // <div>
    //     <button onClick={() => useRoute.push('/api/auth/signin')}>Login with Google</button>
    // </div>
    <main className="flex flex-col items-center justify-between">
      <div
        className="bg-cover bg-center h-[calc(100vh-20vh)] px-16 py-56"
        style={{
          backgroundImage: `url(${bg.src})`,
          width: "100%",
          backgroundBlendMode: "lighten",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="text-center">
          <div
            className="text-7xl"
            style={{ fontFamily: "meno-banner, serif !important" }}
          >
            Discover Your Signature Look
          </div>
          <div className="text-3xl p-4 text-gray-800">
            Upload Your Outfit, Receive Tailored Suggestions!
          </div>

          {session?.data?.user ?
          <>
            <button className="bg-[#51233A] hover:bg-[#51233A]/90 text-white py-2 px-4 rounded-full">
            <Link href="/dashboard"> Try me</Link>
            </button>
          </>

          :
          <>
             <button onClick={() => useRoute.push('/api/auth/signin')} className="bg-[#51233A] hover:bg-[#51233A]/90 text-white py-2 px-4 rounded-full">
              Try Me
              </button>
          </>
        }
          
         
        </div>
      </div>
    </main>
  );
}
