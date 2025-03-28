import React from 'react'
import backGround from '../assets/images/background.jpg'
import bird from '../assets/images/bird.lottie'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "motion/react"
import { div } from 'framer-motion/client';
const StatrtPage = () => {
  return (
    <div className='relative overflow-hidden bg-cyan-200 h-screen w-screen flex justify-center items-center top-0'>
      <img src={backGround} alt="" className='absolute inset-0 h-full w-full object-fit' />
      <div className='absolute inset-0 flex flex-col justify-center items-center'>
        <motion.div
          initial={{ x:"-100vw",y:"100vh",opacity: 0 }}
          animate={{  x:"0",y:"0",opacity: 1 }}
          transition = {{ duration: 2 }}  
        >
          <DotLottieReact
            className='w-66 h-56'
            src={bird}
            loop
            autoplay/>
        </motion.div>
        <button className='w-46 h-14 bg-red-700 border-1 border-red-950 rounded-2xl text-4xl uppercase font-bold hover:bg-red-500 text-center hover:scale-110'>
          Start
        </button>
      </div>
  </div>

  )
}

export default StatrtPage
