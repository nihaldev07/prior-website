/**
 * Video Embed Renderer
 * Renders video file embeds from Admin Panel content on Customer Website
 */
'use client'

import React from 'react'

interface VideoEmbedNodeProps {
  src: string
  width?: number
  height?: number
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
}

export const VideoEmbedNode: React.FC<VideoEmbedNodeProps> = ({
  src,
  width = 640,
  height = 360,
  controls = true,
  autoplay = false,
  loop = false,
}) => {
  if (!src) {
    return (
      <div className="text-red-500 text-center p-4 my-4 border border-red-200 rounded">
        Invalid video URL
      </div>
    )
  }

  return (
    <div className="video-embed-container flex justify-center my-4">
      <video
        src={src}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        preload="none"
        className="rounded-lg max-w-full"
        style={{ height: height ? `${height}px` : 'auto' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoEmbedNode
