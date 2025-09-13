'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GenerationSettings, VIDEO_STYLES, ASPECT_RATIOS, DURATION_OPTIONS } from '@/types/video'

interface SettingsPanelProps {
  settings: GenerationSettings
  onSettingsChange: (settings: GenerationSettings) => void
  disabled?: boolean
}

export function SettingsPanel({ settings, onSettingsChange, disabled }: SettingsPanelProps) {
  const updateSetting = (key: keyof GenerationSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-gray-300">Duration</Label>
            <Select
              value={settings.duration.toString()}
              onValueChange={(value) => updateSetting('duration', parseInt(value))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value.toString()}
                    className="text-white hover:bg-white/10"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label className="text-gray-300">Aspect Ratio</Label>
            <Select
              value={settings.aspectRatio}
              onValueChange={(value) => updateSetting('aspectRatio', value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem 
                    key={ratio.value} 
                    value={ratio.value}
                    className="text-white hover:bg-white/10"
                  >
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label className="text-gray-300">Style</Label>
            <Select
              value={settings.style}
              onValueChange={(value) => updateSetting('style', value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {VIDEO_STYLES.map((style) => (
                  <SelectItem 
                    key={style} 
                    value={style}
                    className="text-white hover:bg-white/10"
                  >
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}