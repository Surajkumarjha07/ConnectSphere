'use client'
import React, { FormEvent, useState } from 'react'
import Link from 'next/link';
import Background from '../components/background';

export default function UpdateUser() {
  const [newName, setnewName] = useState('');
  const [email, setEmail] = useState('chico@gmail.com');
  const [password, setPassword] = useState('');
  const [newEmail, setnewEmail] = useState('');
  const [newPassword, setnewPassword] = useState('')

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/updateInfo", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newName, newEmail, newPassword, password })
      })

      console.log(response);
      if (response.ok) {
        setnewName("");
        setnewEmail("");
        setnewPassword("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <>
      <section className='w-screen h-screen absolute top-0 left-0 bottom-0 right-0 flex flex-col items-center justify-center'>
        <form className='w-fit h-fit px-10 py-10 rounded-md bg-white' method='POST' onSubmit={updateUser}>
          <div className='w-fit h-fit bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text'>
            <h1 className='text-4xl font-extrabold text-transparent'> CS </h1>
          </div>
          <p className='text-2xl text-gray-700 font-bold my-4'> Update Credentials </p>
          <input type="text" name="newName" placeholder='New name' className='w-96 text-gray-600 font-semibold py-2 border-b-2 border-gray-400 outline-none focus-within:border-blue-400 text-sm placeholder:text-sm placeholder:font-medium' value={newName} onChange={e => setnewName(e.target.value)} />
          <br /><br />

          <input type="email" name="newEmail" placeholder='New email' className='w-96 text-gray-600 font-semibold py-2 border-b-2 border-gray-400 focus-within:border-blue-400 text-sm outline-none placeholder:text-sm placeholder:font-medium' value={newEmail} onChange={e => setnewEmail(e.target.value)} />
          <br /><br />

          <input type="password" name="newPassword" placeholder='New password' className='w-96 text-gray-600 font-semibold py-2 border-b-2 border-gray-400 focus-within:border-blue-400 text-sm outline-none placeholder:text-sm placeholder:font-medium' value={newPassword} onChange={e => setnewPassword(e.target.value)} />
          <br /><br />

          <input type="password" name="password" placeholder='Password' className='w-96 text-gray-600 font-semibold py-2 border-b-2 border-gray-400 focus-within:border-blue-400 text-sm outline-none placeholder:text-sm placeholder:font-medium' value={password} onChange={e => setPassword(e.target.value)} />
          <br /><br />

          <p className='w-96 hyphens-auto text-gray-500 font-semibold text-sm'> Please enter all the details, and cross check before proceeding because this process is irreversible. Want to update? or go back to <span className='text-blue-500 font-bold'> <Link href="/login"> Home. </Link> </span> </p>
          <br />

          <div className='flex justify-end'>
            <input type="submit" value="Update Account" className='text-white bg-blue-500 rounded-md px-6 py-2 cursor-pointer' />
          </div>
        </form>
      </section>
    </>
  )
}
