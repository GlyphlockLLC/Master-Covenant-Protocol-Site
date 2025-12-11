import { useEffect, useState } from "react";

export default function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center flex justify-center gap-4 text-white font-semibold text-xl">
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">{timeLeft.days}</span>
        <span className="text-xs opacity-70">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs opacity-70">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs opacity-70">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs opacity-70">Seconds</span>
      </div>
    </div>
  );
}