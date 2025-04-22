"use client"

import { useEffect, useState } from "react"

interface PrivacyScoreProps {
  score: number
}

export default function PrivacyScore({ score }: PrivacyScoreProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score)
    }, 500)

    return () => clearTimeout(timer)
  }, [score])

  // Calculate color based on score
  const getColor = (value: number) => {
    if (value < 40) return "#ef4444" // Red for poor
    if (value < 70) return "#f59e0b" // Amber for moderate
    return "#22c55e" // Green for good
  }

  const circumference = 2 * Math.PI * 40 // r = 40
  const strokeDashoffset = circumference - (displayScore / 100) * circumference
  const color = getColor(displayScore)

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease-in-out, stroke 1s" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {displayScore}
        </span>
        <span className="text-xs text-muted-foreground">out of 100</span>
      </div>
    </div>
  )
}
