"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const [credits, setCredits] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const useRoute = useRouter();
  const pathname = usePathname();
  const session  = useSession();

  useEffect(() => {
    // Fetch user credits on initial load
    fetchCredits();
}, []);

const fetchCredits = async () => {
  try {
      const response = await axios.get<{ credits: number }>('/api/user/credits');
      setCredits(response.data.credits);
  } catch (error) {
      console.error('Error fetching user credits:', error);
  }
};
// console.log('vfdvfddvf', pathname, pathname==="/dashboard")

  return (
    <nav className="bg-[#fefaf6] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
           <div className="flex-shrink-0 flex items-center">
            <Image src="/logo.png" width={30} height={30} alt="My Image"/>
            <Link href="/">
                Fashion Advisor
            </Link>
          </div>
            {/* Navigation Links */}
            <div  className={`hidden md:flex items-center space-x-8 ${isOpen ? 'hidden' : 'flex'}`}>
              {session?.data?.user?
               <>
                  {pathname === '/dashboard'?
                  <>
                  <div className='flex'>
                    <Image src="/credit.svg" width={15} height={15} alt="My Image"/>
                      {credits}/10</div>
                    <button  onClick={() => useRoute.push('/api/auth/signout')} className=" text-sm py-2 px-4 rounded ml-4">
                      Logout
                    </button>
                    </> 
                    :
                    <button  onClick={() => useRoute.push('/dashboard')} className="bg-[#51233A] text-sm hover:bg-[#51233A]/90 text-white py-2 px-4 rounded">
                      Dashboard
                    </button>
                    }
                  
              </> 
              :
             <button  onClick={() => useRoute.push('/api/auth/signin')} className="bg-[#51233A] text-sm hover:bg-[#51233A]/90 text-white py-2 px-4 rounded">
             Login
           </button>}
            </div>
           {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-gray-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

          {isOpen && (
          <div className="md:hidden justify-center mt-2">
            <ul className="flex flex-col space-y-2">
            {session?.data?.user?
               <>
                  {pathname === '/dashboard'?
                  <>
                  <div className='flex justify-center'>
                    <Image src="/credit.svg" width={15} height={15} alt="My Image"/>
                      {credits}/10</div>
                    <button  onClick={() => useRoute.push('/api/auth/signout')} className=" text-sm py-2 px-4 rounded ml-4">
                      Logout
                    </button>
                    </> 
                    :
                    <button  onClick={() => useRoute.push('/dashboard')} className="bg-[#51233A] text-sm hover:bg-[#51233A]/90 text-white py-2 px-4 rounded">
                      Dashboard
                    </button>
                    }
                  
              </> 
              :
             <button  onClick={() => useRoute.push('/api/auth/signin')} className="bg-[#51233A] text-sm hover:bg-[#51233A]/90 text-white py-2 px-4 rounded">
             Login
           </button>}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavItemProps {
  href: string;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, text }) => (
  <li>
    <Link href={href}>
    text
    </Link>
  </li>
);

export default Header;
