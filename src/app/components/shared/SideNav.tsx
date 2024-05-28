"use client";
import { useState } from 'react';
import Image from 'next/image';

const SideNav = ({history , setHistory, setFile, setFashionAdvice }) => {
  // const history = ['Item 1', 'Item 2', 'Item 3']; 
  function truncateString(str: string, maxLength: number = 15): string {
    if (str?.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }

  function clearfiltter(){
      setFile(null)
      setHistory(null)
      setFashionAdvice(null)
  }
  return (
    <div className={`top-0 left-0 h-full md:w-1/5 lg:w-1/6 xl:w-1/7 bg-[#51233A] text-white block overflow-auto`}>
      <div className="p-4">
      <button  onClick={() => clearfiltter()} className="text-sm flex w-full justify-between mb-4">
        <div className=' mr-2'>Fashion Advisor </div>
        <Image src="/editIcon.svg" width={15} height={15} alt="edit icon" className='' />
      </button>
        <h2 className="text-lg font-bold mb-4">History</h2>
        <ul>
          {Array.isArray(history) && history.map((item, index) => (
            <li key={index} className="mb-2"><button  onClick={() => setHistory(item)}>
              {truncateString(item.text)}
              </button></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
