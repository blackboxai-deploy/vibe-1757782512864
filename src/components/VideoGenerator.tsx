'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { SettingsPanel } from './SettingsPanel'
import { VideoPlayer } from './VideoPlayer'
import { StatusIndicator } from './StatusIndicator'
import { GenerationHistory } from './GenerationHistory'
import { generateVideo, validatePrompt } from '@/lib/video-api'
import { VideoGeneration, GenerationSettings } from '@/types/video'

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoGeneration | null>(null)
  const [generationHistory, setGenerationHistory] = useState<VideoGeneration[]>([])
  
  const [settings, setSettings] = useState<GenerationSettings>({
    duration: 10,
    aspectRatio: '16:9',
    style: 'Cinematic',
    systemPrompt: `You are an AI video generation assistant. Create high-quality, visually stunning videos based on user prompts. Focus on:
- Clear, smooth motion
- Professional cinematography
- Appropriate lighting and composition
- Coherent visual storytelling
- High production value

Ensure the generated video matches the specified duration, aspect ratio, and style requirements.`
  })

  const handleGenerate = async () => {
    // Validate prompt
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setIsGenerating(true)
    
    try {
      toast.info('Starting video generation...', {
        description: 'This may take up to 15 minutes'
      })

      const response = await generateVideo({
        prompt,
        duration: settings.duration,
        aspectRatio: settings.aspectRatio,
        style: settings.style,
        systemPrompt: settings.systemPrompt
      })

      if (response.success && response.videoUrl) {
        const newGeneration: VideoGeneration = {
          id: Date.now().toString(),
          prompt,
          videoUrl: response.videoUrl,
          status: 'completed',
          createdAt: new Date(),
          metadata: response.metadata!
        }

        setCurrentVideo(newGeneration)
        setGenerationHistory(prev => [newGeneration, ...prev])
        
        toast.success('Video generated successfully!')
      } else {
        toast.error('Generation failed', {
          description: response.error || 'Unknown error occurred'
        })
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Generation failed', {
        description: 'Please try again later'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleHistorySelect = (video: VideoGeneration) => {
    setCurrentVideo(video)
    setPrompt(video.prompt)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Generation Interface */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Video Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* System Prompt */}
            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-gray-300">
                System Prompt (Customize AI Behavior)
              </Label>
              <Textarea
                id="system-prompt"
                value={settings.systemPrompt}
                onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[120px]"
                placeholder="Define how the AI should generate videos..."
              />
            </div>

            {/* Video Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-gray-300">
                Video Description
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate... Be detailed about the scene, actions, lighting, and mood."
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[120px]"
                disabled={isGenerating}
              />
              <div className="text-sm text-gray-400">
                {prompt.length}/500 characters
              </div>
            </div>

            {/* Generation Settings */}
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              disabled={isGenerating}
            />

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
              size="lg"
            >
              {isGenerating ? 'Generating Video...' : 'Generate Video'}
            </Button>

            {/* Status Indicator */}
            {isGenerating && <StatusIndicator />}
          </CardContent>
        </Card>

        {/* Video Player */}
        {currentVideo && (
          <VideoPlayer video={currentVideo} />
        )}
      </div>

      {/* Sidebar - Generation History */}
      <div className="lg:col-span-1">
        <GenerationHistory
          history={generationHistory}
          onSelect={handleHistorySelect}
          currentVideoId={currentVideo?.id}
        />
      </div>
    </div>
  )
}