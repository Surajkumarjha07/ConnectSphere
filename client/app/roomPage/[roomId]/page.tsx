'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PeopleIcon from '@mui/icons-material/People';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { ReturnType } from '../../types'
import ReactPlayer from 'react-player';
import { useParams } from 'next/navigation';
import { useSocket } from '../../socketContext'
import peerService from '../../Services/SocketServices'

export default function RoomPage() {
  const params = useParams();
  const [time, setTime] = useState<string>('');
  const [togglePeople, setTogglePeople] = useState<boolean>(false);
  const [toggleChat, setToggleChat] = useState<boolean>(false);
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [toggleDiv, setToggleDiv] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [fromUser, setFromUser] = useState('dola');
  const [roomId, setRoomId] = useState<string | string[] | undefined>('');
  const [receivingMsgArray, setReceivingMsgArray] = useState<ReturnType[]>([]);
  const { socket } = useSocket();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  function timeUpdate() {
    setTime(new Date().toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h12',
    }))
  }

  const sendMessage = () => {
    socket.emit("message", fromUser, message);
    setMessage('');
  }

  //Socket Functions
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    setMyStream(stream);
  }, [myStream]);

  //Socket useEffect
  useEffect(() => {
    //Initialize variables
    const { roomId } = params;
    setRoomId(roomId);

    //On events
    socket.on('user-messages', (fromUser: string, messages: string) => {
      setFromUser(fromUser)
      setReceivingMsgArray([...receivingMsgArray, { fromUser, messages }])
    })

    socket.on("newuser:join", ({ email, roomId }: any) => {
      console.log("Another user joined", email, roomId);
    })

    return () => {
      socket.off("user-messages");
      socket.off("newuser:join");
    }
  }, [socket])


  useEffect(() => {
    handleCallUser();
    setInterval(() => {
      timeUpdate();
    }, 1000);
  }, [])

  const toggleChatSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleSidebar(true);
    setToggleChat(true);
    setTogglePeople(false);
  }

  const togglePeopleSection = () => {
    setTogglePeople(true);
    setToggleSidebar(true);
    setToggleChat(false);
  }

  const cancel = () => {
    setToggleSidebar(false);
    setTimeout(() => {
      setToggleChat(false);
      setTogglePeople(false);
    }, 100);
  }

  const toggleList = () => {
    setToggleDiv(!toggleDiv);
  }

  return (
    <>
      <section className='w-screen h-screen flex flex-col justify-between items-center pt-4'>

        <div className={`${!toggleSidebar ? 'w-4/6' : 'w-4/6 -translate-x-48'} transition-all duration-500 h-4/5 bg-white rounded-md flex justify-center items-center`}>
          {
            myStream ? <ReactPlayer playing muted volume={1} width={'100%'} height={'100%'} url={myStream} className='w-full h-full' /> :
              <div className='bg-gray-200 w-40 h-40 rounded-full text-4xl text-gray-600 flex justify-center items-center'> S </div>
          }
        </div>

        {/* Sidebar Section */}
        <section className={`absolute top-4 right-6 bg-white w-96 h-5/6 rounded-md py-4 px-8 transition-all duration-500 overflow-hidden ${toggleSidebar ? 'translate-x-[0rem]' : 'translate-x-[40rem]'}`}>

          {/* People Section */}
          <div className={`${togglePeople ? 'visible' : 'hidden'}`}>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-medium text-gray-500'> People </h1>
              <Image src={'https://cdn-icons-png.flaticon.com/512/10728/10728089.png'} alt='' width={20} height={20} className='cursor-pointer' onClick={cancel} />
            </div>
            <button className='bg-blue-200 px-4 py-2 text-gray-700 rounded-full flex justify-center items-center gap-2 my-4'>
              <Image src={'https://cdn-icons-png.freepik.com/256/17847/17847446.png?ga=GA1.1.340517500.1727584059&semt=ais_hybrid'} alt='Contacts' width={25} height={25} />
              Add People
            </button>

            <div className={`${togglePeople ? 'visible' : 'hidden'}`}>
              <div className={`h-12 relative border-2 border-gray-400 rounded-md focus-within:border-blue-400 overflow-hidden my-4`}>
                <div className='w-full h-full flex justify-start items-center px-3 absolute pointer-events-none'>
                  <Image src="https://cdn-icons-png.freepik.com/256/966/966642.png?ga=GA1.1.340517500.1727584059&semt=ais_hybrid" alt="search" width={100} height={100} className='w-6 h-6' />
                </div>
                <input type="text" name="meetingCode" className='h-full outline-none text-gray-600 pl-12 placeholder:text-gray-600' placeholder='Search for people' />
              </div>

              <p className='text-gray-500 text-sm font-medium my-2'> IN MEETING </p>

              <div className={`flex justify-between items-center py-2 px-4 cursor-pointer ${!toggleDiv ? 'border-2 border-gray-500 rounded-lg' : 'border-b-0 border-2 border-gray-500 rounded-t-lg'}`} onClick={toggleList}>
                <p className='text-gray-800 font-medium text-sm'> Contributors </p>
                <div className='flex justify-center items-center gap-6'>
                  <p className='text-gray-800 font-medium text-sm'> 1 </p>
                  <Image src={'https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-up-01-512.png'} alt='' width={20} height={20} />
                </div>
              </div>

              <div className={`${!toggleDiv ? 'hidden' : 'visible'} border-2 border-gray-500 h-52 w-full rounded-b-lg`}>
                <div className='flex justify-between items-center px-4 py-3'>
                  <div className='flex justify-center items-center gap-5'>
                    <button className='w-10 h-10 bg-gray-100 p-2 rounded-full text-black'> S </button>
                    <div>
                      <p className='text-gray-600 font-medium text-sm'> Suraj kumar jha (You) </p>
                      <p className='text-gray-400 font-medium text-[10px]'> MEETING HOST </p>
                    </div>
                  </div>
                  <div className='flex flex-col justify-center items-center gap-1'>
                    <div className={'bg-gray-500 rounded-full w-1 h-1'}></div>
                    <div className={'bg-gray-500 rounded-full w-1 h-1'}></div>
                    <div className={'bg-gray-500 rounded-full w-1 h-1'}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className={`${toggleChat ? 'visible' : 'hidden'} flex flex-col justify-between h-full`}>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-medium text-gray-500'> In-call messages </h1>
              <Image src={'https://cdn-icons-png.flaticon.com/512/10728/10728089.png'} alt='' width={20} height={20} className='cursor-pointer' onClick={cancel} />
            </div>
            <div className={`h-full flex flex-col justify-between`}>
              <div className='w-full h-full my-4 overflow-y-scroll customScroll'>
                {
                  receivingMsgArray.map(({ fromUser, messages }, index) => (
                    <div key={index} className='w-full bg-transparent hover:bg-gray-100 text-gray-700 my-2'>
                      <p className='font-semibold text-gray-700 text-sm'> {fromUser} </p>
                      <p className='font-medium text-gray-500 text-sm w-fit'> {messages} </p>
                    </div>
                  ))
                }
              </div>
              <div className='flex justify-start items-center gap-5 bg-gray-100 rounded-full'>
                <input type="text" name='chatBox' className='bg-gray-100 text-gray-700 rounded-full py-3 px-4 border-none outline-none w-full placeholder:text-sm' placeholder='Send message' value={message} onChange={e => setMessage(e.target.value)} />
                <button className='p-3 rounded-full hover:bg-gray-200' onClick={sendMessage}>
                  <SendRoundedIcon className={`${message ? 'text-blue-500' : 'text-gray-400'} w-7 h-7`} />
                </button>
              </div>
            </div>
          </div>

        </section>

        <div className='flex justify-center items-center w-screen h-24 mx-auto rounded-md py-2 px-8'>
          <p className='text-lg font-medium text-gray-500'> {time} </p>
          <button className='w-14 h-14 bg-gray-200 rounded-full flex justify-center items-center mx-auto' onClick={handleCallUser}>
            <Image src={'https://b2174441.smushcdn.com/2174441/wp-content/uploads/2022/08/phone-icon-red.png?lossy=0&strip=0&webp=1'} alt='Call' width={50} height={50} className='w-6 h-6' />
          </button>

          <div className='flex justify-center items-center gap-10'>
            <button onClick={togglePeopleSection}>
              {!togglePeople ?
                <PeopleAltOutlinedIcon className='text-gray-600 w-8 h-8' /> :
                <PeopleIcon className='text-gray-600 w-8 h-8' />
              }
            </button>

            <button onClick={toggleChatSection}>
              {!toggleChat ?
                <ChatIcon className='text-gray-600 w-8 h-8' /> :
                <ChatBubbleRoundedIcon className='text-gray-600 w-8 h-8' />
              }
            </button>
          </div>
        </div>

      </section>
    </>
  )
}
