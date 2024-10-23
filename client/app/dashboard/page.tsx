'use client'
import React, { act, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navbar from '../components/navbar';
import { ImageArr, parArr, headingArr } from '../SampleArrays'
import { useSocket } from '../socketContext'
import { useRouter } from 'next/navigation';
import { useLogin } from '../context'
import peerService from '../Services/SocketServices'

export default function Dashboard() {
  const [active, setActive] = useState<number>(0);
  const [roomMeetingCode, setRoomMeetingCode] = useState<string>('');
  const [callOffer, setCallOffer] = useState<any>();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { localUser, setLocalUser } = useLogin()
  const { socket } = useSocket();

  const increaseActive = () => {
    active === 1 ? setActive(0) : setActive(prev => prev + 1);
  }

  const decreaseActive = () => {
    active === 0 ? setActive(1) : setActive(prev => prev - 1);
  }

  const generateRandomMeetingCode = () => {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    let min = 0;
    let max = 52;

    for (let i = 0; i < 9; i++) {
      let char = Math.floor(Math.random() * (max - min)) + min;
      result += alphabets[char];
    }
    setRoomMeetingCode(result)
    return result;
  }

  socket.on("room:join", ({ email, roomId }: any) => {
    console.log("First User ", email, roomId);
    setLocalUser(email);
  })

  const newMeeting = async () => {
    const meetingCode = generateRandomMeetingCode();
    socket.emit("room:join", localUser, meetingCode)
    router.push(`/roomPage/${meetingCode}`)
    try {
      const offer = await peerService.getOffer();
      setCallOffer(offer);
      console.log(offer);
      socket.emit("offer:sent", meetingCode, offer)
    } catch (error) {
      console.error("Error getting offer:", error);
    }
  }

  const joinMeeting = async () => {
    socket.emit("newuser:join", localUser, roomMeetingCode)
    router.push(`/roomPage/${roomMeetingCode}`)
    socket.on("offer:received", async ({ from, offer }: any) => {
      try {
        const ans = await peerService.getAnswer(offer);
        setCallOffer(offer);
        console.log(ans);
        console.log("offer received", from, offer);
        socket.emit("offer:accepted", roomMeetingCode, ans);
      } catch (error) {
        console.log("Error in sending answer");
      }
    })
    const ans = await peerService.getAnswer(callOffer);
    console.log(ans);
  }

  return (
    <>
      <Navbar />
      <section className='flex justify-between items-center w-screen h-screen'>
        <div className='w-1/2 h-screen flex flex-col justify-center items-start gap-4 px-28'>
          <div>
            <h1 className='text-gray-600 font-medium text-5xl'> Video calls and meetings for everyone </h1>
            <p className='text-gray-400 font-medium text-xl w-96 my-2'> Connect, collaborate and celebrate from anywhere in Connect Sphere </p>
          </div>
          <div className='flex justify-start gap-7 py-2'>
            {/* <Link href={'/roomPage'}> */}
            <button className='bg-blue-500 border-none text-white font-semibold px-5 py-3 rounded-md' onClick={newMeeting}>
              New Meeting
            </button>
            {/* </Link> */}

            <div className='relative border-2 border-gray-400 rounded-md focus-within:border-blue-400 overflow-hidden'>
              <div className='w-full h-full flex justify-start items-center px-3 absolute pointer-events-none'>
                <Image src="https://cdn-icons-png.freepik.com/256/16633/16633181.png?ga=GA1.1.340517500.1727584059&semt=ais_hybrid" alt="keyboard" width={100} height={100} className='w-6 h-6' />
              </div>
              <input type="text" name="meetingCode" className='h-full outline-none text-gray-600 pl-12 placeholder:text-gray-600' placeholder='Enter a code or link' onChange={e => setRoomMeetingCode(e.target.value)} />
            </div>

            <button className={!roomMeetingCode ? 'border-none text-gray-400 font-semibold cursor-default' : 'border-none text-blue-400 font-semibold cursor-pointer'} onClick={joinMeeting}> Join </button>
          </div>
        </div>

        <div className='w-1/2 h-screen text-center flex flex-col justify-center items-center gap-10'>
          <div className='flex justify-between items-center w-96'>
            <button className='hover:bg-gray-100 p-2 rounded-full' onClick={decreaseActive}>
              <Image src='https://cdn-icons-png.flaticon.com/128/271/271220.png' alt='' width={100} height={100} className='w-5 h-5' />
            </button>

            <Image src={active === 0 ? ImageArr[0] : ImageArr[1]} alt='Image' width={100} height={100} className='mx-auto w-64 h-64' />

            <button className='hover:bg-gray-100 p-2 rounded-full' onClick={increaseActive}>
              <Image src='https://cdn-icons-png.flaticon.com/128/271/271228.png' alt='' width={100} height={100} className='w-5 h-5' />
            </button>
          </div>

          <div ref={ref}>
            <h2 className='text-gray-800 font-medium text-xl my-2'> {active === 0 ? headingArr[0] : headingArr[1]} </h2>
            <p className='text-gray-500 font-medium w-96 mx-auto'> {active === 0 ? parArr[0] : parArr[1]} </p>
          </div>

          <div className='flex justify-center items-center gap-4'>
            <div className={active !== 0 ? 'bg-gray-300 rounded-full w-2 h-2' : 'bg-blue-500 rounded-full w-2 h-2'}></div>
            <div className={active !== 1 ? 'bg-gray-300 rounded-full w-2 h-2' : 'bg-blue-500 rounded-full w-2 h-2'}></div>
          </div>

        </div>
      </section>
    </>
  )
}
