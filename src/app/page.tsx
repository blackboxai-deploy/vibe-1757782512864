'use client'

import { VideoGenerator } from '@/components/VideoGenerator'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Create Amazing Videos with AI
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Transform your ideas into stunning videos using advanced AI technology. 
          Just describe what you want to see, and watch it come to life.
        </p>
      </div>
      
      <VideoGenerator />
    </div>
  )
}