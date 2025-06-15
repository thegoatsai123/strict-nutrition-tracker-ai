import React, { useState, useRef } from 'react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Brain, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useFoodRecognition } from '@/hooks/useFoodRecognition'
import { Badge } from '@/components/ui/badge'
import { EnhancedFoodRecognition } from './EnhancedFoodRecognition'

interface FoodRecognitionUploadProps {
  onImageUpload: (file: File) => void
  isProcessing?: boolean
  prediction?: { className: string; confidence: number } | null
  enhanced?: boolean
}

export const FoodRecognitionUpload: React.FC<FoodRecognitionUploadProps> = ({
  onImageUpload,
  isProcessing = false,
  prediction = null,
  enhanced = true
}) => {
  const [showEnhanced, setShowEnhanced] = useState(enhanced);

  // If enhanced mode is requested, show the enhanced component
  if (showEnhanced) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Enhanced AI Recognition</span>
            <Badge variant="secondary">Advanced</Badge>
          </div>
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={() => setShowEnhanced(false)}
          >
            Use Basic Mode
          </AnimatedButton>
        </div>
        <EnhancedFoodRecognition />
      </div>
    );
  }

  // Keep existing basic implementation as fallback
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { recognizeFood, isProcessing: isRecognizing, lastResult, getAvailableProviders } = useFoodRecognition()

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      })
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive"
      })
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    onImageUpload(file)
    await recognizeFood(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const currentProcessing = isProcessing || isRecognizing
  const currentPrediction = lastResult?.success && lastResult.predictions[0] ? lastResult.predictions[0] : prediction

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Camera className="h-4 w-4" />
          <span>Basic Recognition Mode</span>
        </div>
        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={() => setShowEnhanced(true)}
          className="text-xs"
        >
          <Zap className="h-3 w-3 mr-1" />
          Try Enhanced
        </AnimatedButton>
      </div>

      {/* ML Provider Status */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Brain className="h-4 w-4" />
        <span>Available Models:</span>
        {getAvailableProviders().map((provider, index) => (
          <Badge key={provider} variant="secondary" className="text-xs">
            {provider}
          </Badge>
        ))}
      </div>

      {/* Upload Area */}
      <GlassCard
        className={cn(
          "relative p-8 border-2 border-dashed transition-all duration-300 cursor-pointer",
          dragOver ? "border-green-400 bg-green-50/50 scale-105" : "border-gray-300",
          "hover:border-green-400 hover:bg-green-50/30"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center space-y-4">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={previewUrl} 
                  alt="Food preview" 
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
                {currentProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {currentPrediction && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-700 capitalize">
                      {currentPrediction.className}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(currentPrediction.confidence * 100)}%
                  </div>
                  {lastResult && (
                    <div className="text-xs text-gray-500">
                      Provider: {lastResult.provider} • {lastResult.processingTime}ms
                    </div>
                  )}
                </div>
              )}

              {lastResult && !lastResult.success && (
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Recognition failed</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Upload Food Image
                </p>
                <p className="text-gray-600">
                  Drop your image here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Basic ML recognition • Max 10MB
                </p>
              </div>
            </>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <AnimatedButton
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={currentProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </AnimatedButton>
        
        <AnimatedButton
          variant="gradient"
          className="flex-1"
          onClick={() => {
            toast({
              title: "Camera Feature",
              description: "Camera functionality ready for integration.",
            })
          }}
          disabled={currentProcessing}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </AnimatedButton>
      </div>

      {currentProcessing && (
        <div className="text-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600" />
          <p className="text-sm text-gray-600">
            AI analyzing your food image...
          </p>
        </div>
      )}
    </div>
  )
}
