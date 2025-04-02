import React from 'react'
import backGround from '../assets/images/background.jpg'
import bird from '../assets/images/bird.lottie'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "motion/react"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const StartPage = () => {
  const navigate = useNavigate();
  const [fly, setFly] = useState(false);

  const handleStart = () => {
    setFly(true);
    setTimeout(() => {
      navigate('/game');
    }, 900);
  };

  return (
    <div className='relative overflow-hidden bg-cyan-200 h-screen w-screen flex justify-center items-center top-0'>
      <img src={backGround} alt="" className='absolute inset-0 h-full w-full object-cover' />
      <div className='absolute inset-0 flex flex-col justify-center items-center'>
        <motion.div
          initial={{ x: "-100vw", y: "100vh", opacity: 0 }}
          animate={fly ? { x: "100vw", y: "-50vh", opacity: 1 } : { x: "0", y: "0", opacity: 1 }}
          transition={fly?{ duration: 2 }:{ duration: 2 }}
        >
          <DotLottieReact
            className='w-66 h-56'
            src={bird}
            loop
            autoplay
          />
        </motion.div>
        <motion.button
          initial={{ y: "100vh", opacity: 0 }}
          animate={fly?{opacity: 0}:{ y: "0", opacity: 1 }}
          transition={{ duration: 2 }}
          className='w-46 h-14 bg-red-700 border-1 border-red-950 rounded-2xl text-4xl uppercase font-bold hover:bg-red-500 text-center hover:scale-110 mt-5'
          onClick={handleStart}
        >
          Start
        </motion.button>
      </div>
    </div>
  );
};

export default StartPage;