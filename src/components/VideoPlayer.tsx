'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VideoGeneration } from '@/types/video'

interface VideoPlayerProps {
  video: VideoGeneration
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `ai-video-${video.id}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDuration = (seconds: number) => {
    return `${seconds}s`
  }

  const formatGenerationTime = (ms?: number) => {
    if (!ms) return 'N/A'
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Generated Video</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {video.metadata.style}
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {video.metadata.aspectRatio}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {formatDuration(video.metadata.duration)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative w-full rounded-lg overflow-hidden bg-black">
          <video
            src={video.videoUrl}
            controls
            className="w-full h-auto"
            style={{
              aspectRatio: video.metadata.aspectRatio === '16:9' ? '16/9' : 
                          video.metadata.aspectRatio === '9:16' ? '9/16' : '1/1'
            }}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-1">Prompt</h3>
            <p className="text-white text-sm bg-white/5 rounded-md p-3 border border-white/10">
              {video.prompt}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Duration:</span>
              <p className="text-white">{formatDuration(video.metadata.duration)}</p>
            </div>
            <div>
              <span className="text-gray-400">Aspect Ratio:</span>
              <p className="text-white">{video.metadata.aspectRatio}</p>
            </div>
            <div>
              <span className="text-gray-400">Style:</span>
              <p className="text-white">{video.metadata.style}</p>
            </div>
            <div>
              <span className="text-gray-400">Generation Time:</span>
              <p className="text-white">{formatGenerationTime(video.metadata.generationTime)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Download Video
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'AI Generated Video',
                  text: `Check out this AI-generated video: ${video.prompt}`,
                  url: video.videoUrl,
                })
              } else {
                navigator.clipboard.writeText(video.videoUrl)
                // You could add a toast notification here
              }
            }}
          >
            Share
          </Button>
        </div>

        <div className="text-xs text-gray-400">
          Generated on {video.createdAt.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}