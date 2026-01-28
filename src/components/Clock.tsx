import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <div className="text-center text-white select-none">
      <p className="text-xl md:text-2xl font-light mb-2 opacity-80">
        {getGreeting()}
      </p>
      <h1 className="text-7xl md:text-9xl font-thin tracking-tight mb-4">
        {formatTime(time)}
      </h1>
      <p className="text-lg md:text-xl font-light opacity-70 capitalize">
        {formatDate(time)}
      </p>
    </div>
  );
}
