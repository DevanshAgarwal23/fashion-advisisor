"use client"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

export default function Home() {
    const session  = useSession();

    const useRoute = useRouter()
    console.log(session?.data?.user)
    if (session?.data?.user) {
        return (
            <div>
                <h1>Welcome </h1>
                <button onClick={() => useRoute.push('/dashboard')}>Go to Dashboard</button>
                <button onClick={() => useRoute.push('/api/auth/signout')}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => useRoute.push('/api/auth/signin')}>Login with Google</button>
        </div>
    );
}
