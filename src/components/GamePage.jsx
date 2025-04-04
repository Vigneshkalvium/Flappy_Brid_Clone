import React from 'react'
import backGround from '../assets/images/background.jpg'
import backGround1 from '../assets/images/background1.jpg'
import bird from '../assets/images/bird.lottie'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "motion/react"
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gameSound from '../assets/audio/game.mp3'
import pointSound from '../assets/audio/point.mp3'
import hitSound from '../assets/audio/hit.mp3'
import { Howl } from 'howler';

const gravity = 0.35;
const jumpForce = -4;
const PIPE_GAP = 210;
const PIPE_WIDTH = 80;
const PIPE_SPACING = 600;
const BIRD_WIDTH = 150;
const BIRD_HEIGHT = 150;

const gameBgSound = new Howl({
  src: [gameSound],
  loop: true,
  volume: 0.2,
});

const point = new Howl({
  src: [pointSound],
  volume: 0.7,
});

const hit = new Howl({
  src: [hitSound],
  volume: 1.0,
});

const GamePage = () => {
  const [start, setStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [birdY, setBirdY] = useState((window.innerHeight / 2) - 100);
  const [birdX, setBirdX] = useState((window.innerWidth / 2) - 112);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [highScoreText, setHighScoreText] = useState(false);
  const [pipeSpeed, setPipeSpeed] = useState(3);
  const [showPointText, setShowPointText] = useState(false);
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const pipeIdRef = useRef(0);
  const animationRef = useRef();
  const lastPipeXRef = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedHighScore = localStorage.getItem("flappyHighScore");
      if (savedHighScore) setHighScore(Number(savedHighScore));
      gameBgSound.play();
      setStart(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
      gameBgSound.stop();
    };
  }, []);

  useEffect(() => {
    if (!start || gameOver) return;

    const update = () => {
      setVelocity((prev) => prev + gravity);
      setBirdY((prev) => prev + velocity);
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [start, velocity, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (!gameOver) {
          setVelocity(jumpForce);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (!start || gameOver) return;

    const movePipes = () => {
      setPipes((prev) => {
        const updated = prev.map((pipe) => {
          const newX = pipe.x - pipeSpeed;

          if (!pipe.passed && newX + PIPE_WIDTH < birdX) {
            pipe.passed = true;
            point.play();
            setShowPointText(true);
            setTimeout(() => setShowPointText(false), 600);
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore % 10 === 0) {
                setPipeSpeed((prevSpeed) => prevSpeed + 0.5);
              }
              return newScore;
            });
          }

          return { ...pipe, x: newX };
        }).filter(pipe => pipe.x + PIPE_WIDTH > 0);

        const lastX = updated.length > 0 ? updated[updated.length - 1].x : 0;

        if (lastPipeXRef.current - lastX >= PIPE_SPACING || updated.length === 0) {
          const topHeight = Math.floor(Math.random() * (windowSize.height - PIPE_GAP - 200)) + 50;
          const newPipe = {
            id: pipeIdRef.current++,
            x: windowSize.width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            width: PIPE_WIDTH,
            passed: false
          };
          lastPipeXRef.current = windowSize.width;
          return [...updated, newPipe];
        }

        return updated;
      });

      requestAnimationFrame(movePipes);
    };

    requestAnimationFrame(movePipes);
  }, [start, gameOver, birdX, windowSize, pipeSpeed]);

  useEffect(() => {
    if (!start || gameOver) return;

    const birdTop = birdY;
    const birdBottom = birdY + BIRD_HEIGHT;
    const birdLeft = birdX;
    const birdRight = birdX + BIRD_WIDTH;

    if (birdTop <= 0 || birdBottom >= windowSize.height) {
      hit.play();
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("flappyHighScore", score);
        setHighScoreText(true);
      }
      return;
    }

    for (let pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      const isInPipeXRange = birdRight > pipeLeft && birdLeft < pipeRight;
      const inGap = birdBottom > pipe.topHeight && birdTop < pipe.bottomY;

      if (isInPipeXRange && !inGap) {
        hit.play();
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("flappyHighScore", score);
          setHighScoreText(true);
        }
        return;
      }
    }
  }, [birdY, pipes, start, gameOver, birdX, windowSize]);


  useEffect(() => {
    if (highScoreText) {
      const timer = setTimeout(() => setHighScoreText(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highScoreText]);

  return (
    <div className="relative flex justify-center items-center inset-0 h-screen w-screen overflow-hidden">
      <img
        src={backGround}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {pipes.map((pipe) => (
          <React.Fragment key={pipe.id}>
            <div
              className="absolute bg-green-700 rounded-b-xl shadow-md border-1"
              style={{
                left: `${pipe.x}px`,
                top: 0,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.topHeight}px`,
              }}
            ></div>
            <div
              className="absolute bg-green-700 rounded-t-xl shadow-md border-1"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.bottomY}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${windowSize.height - pipe.bottomY}px`,
              }}
            ></div>
          </React.Fragment>
        ))}

        {!start ? (
          <motion.div
            initial={{ x: '-100vw', y: '-50vh', opacity: 1 }}
            animate={{ x: '0', y: '0', opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <DotLottieReact className="w-56 h-46" src={bird} loop autoplay />
          </motion.div>
        ) : (
          <div
            className="absolute"
            style={{ top: `${birdY}px`, left: `${birdX}px` }}
          >
            <DotLottieReact className="w-56 h-46" src={bird} loop autoplay />
          </div>
        )}

        {showPointText && (
          <motion.div
            className="absolute text-black text-4xl font-bold drop-shadow-lg"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -80 }}
            transition={{ duration: 2 }}
            style={{ top: `${birdY}px`, left: `${birdX + BIRD_WIDTH / 2}px` }}
          >
            +1
          </motion.div>
        )}

        {highScoreText && (
          <motion.div
            className="absolute top-20 text-yellow-400 text-5xl font-extrabold z-40 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            🎉 New High Score! 🎉
          </motion.div>
        )}

        <div className="absolute w-full bottom-[-10px] z-10 flex justify-center items-center flex-col">
          <img className="absolute w-full bottom-[-10px]" src={backGround1} alt="" />
          <h1 className="absolute text-black text-2xl font-bold z-20 text-center bottom-12">
            Score: {score}
          </h1>
          <h2 className="absolute text-red-600 text-xl font-bold z-20 text-center bottom-4">
            High Score: {highScore}
          </h2>
        </div>

        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full z-30">
            <img
              src={backGround}
              alt="Blurred Background"
              className="absolute w-full h-full object-cover blur-md opacity-99"
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-red-600 text-8xl font-bold mb-6">Game Over</h1>
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-black m-4 px-6 py-3 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-130 hover:bg-gray-200 duration-300"
              >
                Restart
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-black text-white px-6 py-3 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-110 hover:bg-gray-700 duration-300"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;