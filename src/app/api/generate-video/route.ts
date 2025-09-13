import { NextRequest, NextResponse } from 'next/server'
import { VideoGenerationRequest } from '@/types/video'

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions'
const MODEL_NAME = 'replicate/google/veo-3'

const API_HEADERS = {
  'customerId': 'cus_SI19yrM95BDIk5',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json()
    
    // Validate input
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (body.prompt.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be less than 500 characters' },
        { status: 400 }
      )
    }

    const startTime = Date.now()
    
    // Build the prompt with settings
    const fullPrompt = buildVideoPrompt(body)
    const systemPrompt = body.systemPrompt || getDefaultSystemPrompt()

    // Call the AI API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const generationTime = Date.now() - startTime
    
    // Extract video URL from response
    const videoUrl = extractVideoUrl(data)
    
    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: 'No video URL found in API response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      metadata: {
        duration: body.duration || 10,
        aspectRatio: body.aspectRatio || '16:9',
        style: body.style || 'Cinematic',
        generationTime,
        prompt: body.prompt
      }
    })

  } catch (error) {
    console.error('Video generation API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

function buildVideoPrompt(request: VideoGenerationRequest): string {
  const { prompt, duration = 10, aspectRatio = '16:9', style = 'Cinematic' } = request
  
  return `Generate a ${duration}-second video in ${aspectRatio} aspect ratio with ${style} style: ${prompt}`
}

function getDefaultSystemPrompt(): string {
  return `You are an AI video generation assistant. Create high-quality, visually stunning videos based on user prompts. Focus on:
- Clear, smooth motion
- Professional cinematography  
- Appropriate lighting and composition
- Coherent visual storytelling
- High production value

Ensure the generated video matches the specified duration, aspect ratio, and style requirements.`
}

function extractVideoUrl(apiResponse: any): string | null {
  // Handle different possible response formats from the API
  if (apiResponse.choices && apiResponse.choices[0]?.message?.content) {
    const content = apiResponse.choices[0].message.content
    
    // Look for video URL patterns
    const urlMatch = content.match(/https?:\/\/[^\s]+\.(mp4|mov|avi|webm)/i)
    if (urlMatch) {
      return urlMatch[0]
    }
  }
  
  // Check if response is direct URL
  if (typeof apiResponse === 'string' && apiResponse.match(/https?:\/\/[^\s]+\.(mp4|mov|avi|webm)/i)) {
    return apiResponse
  }
  
  // Check for nested URL structures
  if (apiResponse.output && typeof apiResponse.output === 'string') {
    return apiResponse.output
  }
  
  if (apiResponse.url && typeof apiResponse.url === 'string') {
    return apiResponse.url
  }
  
  return null
}