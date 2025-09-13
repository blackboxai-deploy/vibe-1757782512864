// TypeScript interfaces for video generation app

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  style?: string;
  systemPrompt?: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  metadata?: {
    duration: number;
    aspectRatio: string;
    style: string;
    generationTime: number;
    prompt: string;
  };
}

export interface VideoGeneration {
  id: string;
  prompt: string;
  videoUrl: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: Date;
  metadata: {
    duration: number;
    aspectRatio: string;
    style: string;
    generationTime?: number;
  };
}

export interface GenerationSettings {
  duration: number;
  aspectRatio: string;
  style: string;
  systemPrompt: string;
}

export const VIDEO_STYLES = [
  'Cinematic',
  'Documentary',
  'Animation',
  'Abstract',
  'Nature',
  'Urban',
  'Fantasy',
  'Sci-Fi'
] as const;

export const ASPECT_RATIOS = [
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Square (1:1)', value: '1:1' }
] as const;

export const DURATION_OPTIONS = [
  { label: '5 seconds', value: 5 },
  { label: '10 seconds', value: 10 },
  { label: '15 seconds', value: 15 }
] as const;

export type VideoStyle = typeof VIDEO_STYLES[number];
export type AspectRatio = typeof ASPECT_RATIOS[number]['value'];
export type Duration = typeof DURATION_OPTIONS[number]['value'];