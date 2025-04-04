import React from 'react'
import backGround from '../assets/images/background.jpg'
import bird from '../assets/images/bird.lottie'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "motion/react"
const GamePage = () => {
  return (
    <>
    <div className='relative flex justify-center items-center inset-0 h-screen w-screen overflow-hidden'>
        <img src={backGround} alt="" className='absolute inset-0 h-full w-full object-cover' />
        <div className='absolute inset-0 flex flex-col justify-center items-center'>
            <motion.div
            initial={{ x: "-100vw", y: "-50vh", opacity: 1 }}
            animate={{ x: "-10vw", y: "-10vh", opacity: 1 }}
            transition={{duration: 2}}
            >
            <DotLottieReact
                className='w-56 h-46'
                src={bird}
                loop
                autoplay
            />
            </motion.div>
        </div>
    </div>
    </>
  )
}

export default GamePage
