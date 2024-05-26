import Link from 'next/link';

/**
 * The shared footer component.
 */
export default function Footer() {
  return (
    <footer className="text-center text-sm bg-[#51233A] text-white">
      <div className="px-4 py-8 md:px-24">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-x-12 md:space-y-0">
          <Link href="/aboutUs">
            About US
          </Link>
          <span className="hidden md:inline">|</span> {/* Hide the '|' separator on small screens */}
          <Link href="mailto:fashion-advisor@gmail.com">
            Contact US
          </Link>
        </div>
        <div className="mt-4"> {/* Margin top only on small screens */}
          2024 @ Fashion Advisor. All right reserved.
        </div>
      </div>
    </footer>
  );
}
