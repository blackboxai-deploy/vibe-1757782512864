'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoGeneration } from '@/types/video'

interface GenerationHistoryProps {
  history: VideoGeneration[]
  onSelect: (video: VideoGeneration) => void
  currentVideoId?: string
}

export function GenerationHistory({ history, onSelect, currentVideoId }: GenerationHistoryProps) {
  const truncatePrompt = (prompt: string, maxLength = 60) => {
    return prompt.length > maxLength ? `${prompt.substring(0, maxLength)}...` : prompt
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (history.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <p className="text-gray-400 text-sm">
              No videos generated yet. Create your first AI video!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Generation History</CardTitle>
        <p className="text-gray-400 text-sm">{history.length} video{history.length !== 1 ? 's' : ''}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((video) => (
            <div
              key={video.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${
                currentVideoId === video.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
              onClick={() => onSelect(video)}
            >
              <div className="space-y-2">
                <p className="text-white text-sm font-medium">
                  {truncatePrompt(video.prompt)}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                    {video.metadata.aspectRatio}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                    {video.metadata.duration}s
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                    {video.metadata.style}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {formatTimeAgo(video.createdAt)}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        const link = document.createElement('a')
                        link.href = video.videoUrl
                        link.download = `ai-video-${video.id}.mp4`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {history.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-gray-300 hover:bg-white/10"
              onClick={() => {
                // Clear history functionality
                if (window.confirm('Clear all generation history?')) {
                  // This would need to be passed as a prop function
                  console.log('Clear history')
                }
              }}
            >
              Clear History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}