'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'

export function StatusIndicator() {
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Initializing video generation...')
  
  const statusMessages = [
    'Initializing video generation...',
    'Processing your prompt...',
    'Analyzing scene composition...',
    'Generating video frames...',
    'Applying visual effects...',
    'Rendering final video...',
    'Almost ready...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 5, 95)
        
        // Update status message based on progress
        if (newProgress < 15) {
          setStatusMessage(statusMessages[0])
        } else if (newProgress < 30) {
          setStatusMessage(statusMessages[1])
        } else if (newProgress < 45) {
          setStatusMessage(statusMessages[2])
        } else if (newProgress < 60) {
          setStatusMessage(statusMessages[3])
        } else if (newProgress < 75) {
          setStatusMessage(statusMessages[4])
        } else if (newProgress < 90) {
          setStatusMessage(statusMessages[5])
        } else {
          setStatusMessage(statusMessages[6])
        }
        
        return newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">{statusMessage}</span>
            <span className="text-gray-400 text-sm">{Math.round(progress)}%</span>
          </div>
          
          <Progress 
            value={progress} 
            className="w-full h-2" 
          />
          
          <div className="text-xs text-gray-400 text-center">
            Video generation typically takes 5-15 minutes
          </div>
          
          {/* Loading animation */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}