import { useEffect, useState } from "react";

interface CurrentTimeIndicatorProps {
  startHour: number;
  endHour: number;
}

export function CurrentTimeIndicator({
  startHour,
  endHour,
}: CurrentTimeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  if (hour < startHour || hour >= endHour) return null;

  const hoursSinceStart = hour - startHour;
  const minuteProgress = minutes / 60;
  const totalProgress = hoursSinceStart + minuteProgress;
  const totalHours = endHour - startHour;
  const percentageFromTop = (totalProgress / totalHours) * 100;

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${percentageFromTop}%` }}
    >
      <div className="flex items-center">
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-l font-medium">
          {timeString}
        </span>
        <div className="flex-1 h-0.5 bg-red-500"></div>
      </div>
    </div>
  );
}
