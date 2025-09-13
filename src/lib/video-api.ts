// Video generation API utilities

import { VideoGenerationRequest, VideoGenerationResponse } from '@/types/video';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const MODEL_NAME = 'replicate/google/veo-3';

const API_HEADERS = {
  'customerId': 'cus_SI19yrM95BDIk5',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  try {
    const startTime = Date.now();
    
    // Construct the prompt with settings
    const fullPrompt = buildVideoPrompt(request);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: request.systemPrompt || getDefaultSystemPrompt()
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generationTime = Date.now() - startTime;
    
    // Extract video URL from response
    const videoUrl = extractVideoUrl(data);
    
    if (!videoUrl) {
      throw new Error('No video URL found in API response');
    }

    return {
      success: true,
      videoUrl,
      metadata: {
        duration: request.duration || 10,
        aspectRatio: request.aspectRatio || '16:9',
        style: request.style || 'Cinematic',
        generationTime,
        prompt: request.prompt
      }
    };
  } catch (error) {
    console.error('Video generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function buildVideoPrompt(request: VideoGenerationRequest): string {
  const { prompt, duration = 10, aspectRatio = '16:9', style = 'Cinematic' } = request;
  
  return `Generate a ${duration}-second video in ${aspectRatio} aspect ratio with ${style} style: ${prompt}`;
}

function getDefaultSystemPrompt(): string {
  return `You are an AI video generation assistant. Create high-quality, visually stunning videos based on user prompts. Focus on:
- Clear, smooth motion
- Professional cinematography
- Appropriate lighting and composition
- Coherent visual storytelling
- High production value

Ensure the generated video matches the specified duration, aspect ratio, and style requirements.`;
}

function extractVideoUrl(apiResponse: any): string | null {
  // Handle different possible response formats from the API
  if (apiResponse.choices && apiResponse.choices[0]?.message?.content) {
    const content = apiResponse.choices[0].message.content;
    
    // Look for video URL patterns
    const urlMatch = content.match(/https?:\/\/[^\s]+\.(mp4|mov|avi|webm)/i);
    if (urlMatch) {
      return urlMatch[0];
    }
  }
  
  // Check if response is direct URL
  if (typeof apiResponse === 'string' && apiResponse.match(/https?:\/\/[^\s]+\.(mp4|mov|avi|webm)/i)) {
    return apiResponse;
  }
  
  // Check for nested URL structures
  if (apiResponse.output && typeof apiResponse.output === 'string') {
    return apiResponse.output;
  }
  
  if (apiResponse.url && typeof apiResponse.url === 'string') {
    return apiResponse.url;
  }
  
  return null;
}

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  
  if (prompt.trim().length < 10) {
    return { valid: false, error: 'Prompt must be at least 10 characters long' };
  }
  
  if (prompt.length > 500) {
    return { valid: false, error: 'Prompt must be less than 500 characters' };
  }
  
  return { valid: true };
}