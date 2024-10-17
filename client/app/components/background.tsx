import React from 'react'

export default function Background() {
    return (
        <>
            <div className='w-full h-full absolute top-0 bg-gray-100 bg-opacity-95 backdrop-blur-3xl -z-10'></div>
            <div className='absolute top-0 bottom-0 right-0 left-0 grid grid-rows-2 grid-cols-2 gap-10 h-full -z-20'>
                <div className='bg-red-700 h-full'></div>
                <div className='bg-green-500 h-full'></div>
                <div className='bg-blue-500 h-full'></div>
                <div className='bg-yellow-500 h-full'></div>
            </div>
        </>
    )
}
