"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const nextSpinTime = new Date()
    nextSpinTime.setHours(nextSpinTime.getHours() + 24)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = nextSpinTime.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 6
  const timerColor = isUrgent ? "text-red-400" : "text-yellow-400"
  const iconColor = isUrgent ? "text-red-400" : "text-yellow-400"
  const bgColor = isUrgent ? "bg-red-500/20" : "bg-yellow-500/20"

  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className={`p-2 ${bgColor} rounded-full`}>
          <Clock className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="font-semibold text-white text-lg">Next Wheel Spin</h3>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="text-center">
          <div className={`text-2xl font-bold ${timerColor}`}>{timeLeft.days.toString().padStart(2, "0")}</div>
          <div className="text-xs text-gray-400">Days</div>
        </div>
        <div className={`${timerColor} text-xl`}>:</div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${timerColor}`}>{timeLeft.hours.toString().padStart(2, "0")}</div>
          <div className="text-xs text-gray-400">Hours</div>
        </div>
        <div className={`${timerColor} text-xl`}>:</div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${timerColor}`}>{timeLeft.minutes.toString().padStart(2, "0")}</div>
          <div className="text-xs text-gray-400">Min</div>
        </div>
        <div className={`${timerColor} text-xl`}>:</div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${timerColor}`}>{timeLeft.seconds.toString().padStart(2, "0")}</div>
          <div className="text-xs text-gray-400">Sec</div>
        </div>
      </div>
      {isUrgent && <p className="text-xs text-red-400 mt-2 animate-pulse">⚠️ Final hours! Admin will spin soon!</p>}
    </div>
  )
}
