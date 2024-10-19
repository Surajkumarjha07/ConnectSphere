'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useLogin } from '../context';

export default function Navbar() {
  const [time, setTime] = useState('');
  const { isLoggedIn} = useLogin();

  function timeUpdate() {
    setTime(new Date().toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h12',
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }))
  }

  useEffect(() => {
    timeUpdate();
  }, [])

  setTimeout(() => {
    setTime(new Date().toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h12',
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }))
  }, 1000);

  return (
    <>
      <nav className='w-screen px-10 py-2'>
        <ul className='w-full flex justify-between items-center'>
          <li>
            <div className='w-fit h-fit bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text'>
              <h1 className='text-4xl font-extrabold text-transparent'> CS </h1>
            </div>
          </li>
          <li className='flex justify-center items-center gap-10'>
            <p className='text-xl font-medium text-gray-500'> {time} </p>
            {
              !isLoggedIn ?
                <Link href={'/login'}>
                  <button className='text-xl font-medium text-gray-500'> Sign In </button>
                </Link> :
                <div className='flex justify-center items-center bg-gray-200 rounded-full w-14 h-14 text-gray-900 font-bold text-2xl'>
                  S
                </div>
            }
          </li>
        </ul>
      </nav>
    </>
  )
}
