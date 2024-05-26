"use client";
import { useState } from 'react';

const SideNav = () => {
  const history = ['Item 1', 'Item 2', 'Item 3']; 
  return (
    <div className={`top-0 left-0 h-full md:w-1/5 lg:w-1/6 xl:w-1/7 bg-[#51233A] text-white block`}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
