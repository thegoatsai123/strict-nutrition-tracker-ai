
import React, { useState, useRef } from 'react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface FoodRecognitionUploadProps {
  onImageUpload: (file: File) => void
  isProcessing?: boolean
  prediction?: { className: string; confidence: number } | null
}

export const FoodRecognitionUpload: React.FC<FoodRecognitionUploadProps> = ({
  onImageUpload,
  isProcessing = false,
  prediction = null
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      })
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onImageUpload(file)
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

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
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
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {prediction && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-700">
                      {prediction.className}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </div>
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
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </AnimatedButton>
        
        <AnimatedButton
          variant="gradient"
          className="flex-1"
          onClick={() => {
            // Camera functionality would go here
            toast({
              title: "Camera Feature",
              description: "Camera functionality will be implemented with ML model integration.",
            })
          }}
          disabled={isProcessing}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </AnimatedButton>
      </div>

      {isProcessing && (
        <div className="text-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600" />
          <p className="text-sm text-gray-600">
            Analyzing your food image...
          </p>
        </div>
      )}
    </div>
  )
}
