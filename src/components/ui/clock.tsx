import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch-clock";
import { Label } from "@/components/ui/label";

const CLOCK_CONFIG = {
  size: 200,
  get radius() {
    return this.size / 2;
  },
  get center() {
    return this.radius;
  },
  hourMarks: 12,
  minuteMarks: 60,
  handLength: 0.7,
};

const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");

const getTimeFromCoordinates = (x: number, y: number, isHours: boolean) => {
  // Convert coordinates to angle

  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // Normalize angle to 0-360 degrees, starting from 12 o'clock
  angle = (angle + 270) % 360;

  if (isHours) {
    // Convert angle to hours (30 degrees per hour)
    let hours = Math.round(angle / 30);
    if (hours === 0) hours = 12;
    if (hours > 12) hours = hours - 12;
    return hours;
  } else {
    // Convert angle to minutes (6 degrees per minute)
    let minutes = Math.round(angle / 6);
    if (minutes === 60) minutes = 0;
    return minutes;
  }
};

const ClockFace = ({ selectingHours }: { selectingHours: boolean }) => {
  return (
    <>
      {Array.from({ length: selectingHours ? 12 : 60 }).map((_, index) => {
        // For minutes, only show marks at 5-minute intervals
        if (!selectingHours && index % 5 !== 0) return null;

        const angle = index * (selectingHours ? 30 : 6) - 90;
        const radians = (angle * Math.PI) / 180;
        const x =
          CLOCK_CONFIG.center + CLOCK_CONFIG.radius * 0.8 * Math.cos(radians);
        const y =
          CLOCK_CONFIG.center + CLOCK_CONFIG.radius * 0.8 * Math.sin(radians);

        const value = selectingHours
          ? index === 0
            ? 12
            : index
          : formatTimeUnit(index);

        return (
          <div
            key={index}
            className='absolute w-6 h-6 flex items-center justify-center text-sm font-medium z-30 pointer-events-none'
            style={{
              left: x - 12,
              top: y - 12,
            }}
          >
            {value}
          </div>
        );
      })}
    </>
  );
};

const ClockHand = ({ angle }: { angle: number; isHours: boolean }) => {
  if (angle > 180) angle = angle - 360;

  return (
    <div
      className='relative w-1 bg-primary transition-all duration-200 ease-in-out after:absolute after:top-[-25px] after:left-[-12.5px] after:h-7 after:w-7 after:rounded-full after:bg-primary after:content-[""]'
      style={{
        height: CLOCK_CONFIG.radius * CLOCK_CONFIG.handLength,
        transformOrigin: "bottom center",
        transform: `translateX(-50%) rotate(${angle}deg)`,
        left: CLOCK_CONFIG.center,
        top:
          CLOCK_CONFIG.center - CLOCK_CONFIG.radius * CLOCK_CONFIG.handLength,
      }}
    />
  );
};

export function TimePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const [open, setOpen] = useState(false);
  const [selectingHours, setSelectingHours] = useState(true);
  const [isAM, setIsAM] = useState(date.getHours() < 12);

  const handleTimeSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Calculate coordinates relative to clock center
    const x = CLOCK_CONFIG.center + rect.left - event.clientX;
    const y = CLOCK_CONFIG.center + rect.top - event.clientY;

    const newDate = new Date(date);

    if (selectingHours) {
      const hours = getTimeFromCoordinates(x, y, true);
      newDate.setHours(isAM ? hours : hours + 12);
      setTimeout(() => setSelectingHours(false), 300);
    } else {
      const minutes = getTimeFromCoordinates(x, y, false);
      newDate.setMinutes(minutes);
      setTimeout(() => {
        setOpen(false);
        setSelectingHours(true);
      }, 300);
    }

    setDate(newDate);
  };

  const handleAMPMChange = (checked: boolean) => {
    setIsAM(checked);
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const currentHours = hours % 12 || 12;
    newDate.setHours(checked ? currentHours : currentHours + 12);
    setDate(newDate);
  };

  const hours12 = date.getHours() % 12 || 12;
  const displayTime = `${formatTimeUnit(hours12)}:${formatTimeUnit(
    date.getMinutes()
  )} ${isAM ? "AM" : "PM"}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-[240px] justify-start text-left font-normal'
        >
          <Clock className='mr-2 h-4 w-4' />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div
          className='relative rounded-full border-2 border-border'
          style={{
            width: CLOCK_CONFIG.size,
            height: CLOCK_CONFIG.size,
          }}
          onClick={handleTimeSelect}
        >
          <ClockFace selectingHours={selectingHours} />
          <ClockHand
            angle={selectingHours ? hours12 * 30 : date.getMinutes() * 6}
            isHours={selectingHours}
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            {/* <div className='text-2xl font-bold'>{displayTime}</div> */}
          </div>
        </div>
        <div className='flex w-full items-center justify-center gap-2 p-2'>
          <Label htmlFor='am-pm-switch' className='cursor-pointer'>
            PM
          </Label>
          <Switch
            id='am-pm-switch'
            checked={isAM}
            onCheckedChange={handleAMPMChange}
            variant='static'
            aria-label='Toggle between AM and PM'
          />
          <Label htmlFor='am-pm-switch' className='cursor-pointer'>
            AM
          </Label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TimePicker;
