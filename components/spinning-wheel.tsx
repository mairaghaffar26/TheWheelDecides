"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"

interface Participant {
  id: string
  name: string
  slots: number
}

// Mock participants data - in real app this would come from database
const mockParticipants: Participant[] = [
  { id: "1", name: "Atif", slots: 10 },
  { id: "2", name: "Sarah", slots: 1 },
  { id: "3", name: "Ahmed", slots: 1 },
  { id: "4", name: "Maria", slots: 1 },
  { id: "5", name: "John", slots: 1 },
  { id: "6", name: "Lisa", slots: 1 },
  { id: "7", name: "Omar", slots: 1 },
  { id: "8", name: "Emma", slots: 1 },
]

export function SpinningWheel() {
  const { user } = useAuth()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Create wheel segments based on participants and their slots
  const createWheelSegments = () => {
    const segments: string[] = []
    mockParticipants.forEach((participant) => {
      for (let i = 0; i < participant.slots; i++) {
        segments.push(participant.name)
      }
    })
    return segments
  }

  const segments = createWheelSegments()
  const segmentAngle = 360 / segments.length

  // Auto-spin animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSpinning) {
        setIsSpinning(true)
        const newRotation = rotation + 360 + Math.random() * 360
        setRotation(newRotation)

        setTimeout(() => {
          setIsSpinning(false)
        }, 3000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [rotation, isSpinning])

  const getSegmentColor = (index: number, name: string) => {
    // Highlight user's segments in yellow
    if (name === user?.fullName) {
      return "fill-primary"
    }
    // Alternate colors for other segments
    const colors = ["fill-chart-2", "fill-chart-3", "fill-chart-4", "fill-chart-5"]
    return colors[index % colors.length]
  }

  const getTextColor = (name: string) => {
    return name === user?.fullName ? "fill-primary-foreground" : "fill-foreground"
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-80 h-80">
        {/* Wheel SVG */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={`transform transition-transform duration-3000 ease-out ${isSpinning ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((name, index) => {
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180

            const x1 = 160 + 140 * Math.cos(startAngleRad)
            const y1 = 160 + 140 * Math.sin(startAngleRad)
            const x2 = 160 + 140 * Math.cos(endAngleRad)
            const y2 = 160 + 140 * Math.sin(endAngleRad)

            const largeArcFlag = segmentAngle > 180 ? 1 : 0

            const pathData = [`M 160 160`, `L ${x1} ${y1}`, `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

            const textAngle = startAngle + segmentAngle / 2
            const textAngleRad = (textAngle * Math.PI) / 180
            const textX = 160 + 100 * Math.cos(textAngleRad)
            const textY = 160 + 100 * Math.sin(textAngleRad)

            return (
              <g key={`${name}-${index}`}>
                <path d={pathData} className={`${getSegmentColor(index, name)} stroke-border stroke-2`} />
                <text
                  x={textX}
                  y={textY}
                  className={`${getTextColor(name)} text-sm font-medium`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {name}
                </text>
              </g>
            )
          })}

          {/* Center circle */}
          <circle cx="160" cy="160" r="20" className="fill-primary stroke-border stroke-2" />
        </svg>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
        </div>
      </div>

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium pulse-glow">
            Spinning...
          </div>
        </div>
      )}
    </div>
  )
}
