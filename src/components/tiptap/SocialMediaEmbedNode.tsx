/**
 * Social Media Embed Renderer
 * Renders social media embeds from Admin Panel content on Customer Website
 */
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports with SSR disabled to prevent hydration mismatches
// react-social-media-embed components use browser APIs and script injection
// which are incompatible with server-side rendering
const FacebookEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.FacebookEmbed),
  { ssr: false }
)

const InstagramEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.InstagramEmbed),
  { ssr: false }
)

const LinkedInEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.LinkedInEmbed),
  { ssr: false }
)

const PinterestEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.PinterestEmbed),
  { ssr: false }
)

const TikTokEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.TikTokEmbed),
  { ssr: false }
)

const XEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.XEmbed),
  { ssr: false }
)

const YouTubeEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.YouTubeEmbed),
  { ssr: false }
)

interface SocialMediaEmbedNodeProps {
  src: string
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'pinterest' | 'x'
  width?: number
}

export const SocialMediaEmbedNode: React.FC<SocialMediaEmbedNodeProps> = ({
  src,
  platform,
  width = 500,
}) => {
  // Limit max width for responsiveness
  const embedWidth = Math.min(width, 650)

  const renderEmbed = () => {
    switch (platform) {
      case 'youtube':
        return (
          <div className="flex justify-start my-4">
            <YouTubeEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'facebook':
        return (
          <div className="flex justify-start my-4">
            <FacebookEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'instagram':
        return (
          <div className="flex justify-start my-4">
            <InstagramEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'tiktok':
        return (
          <div className="flex justify-start my-4">
            <TikTokEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'linkedin':
        return (
          <div className="flex justify-start my-4">
            <LinkedInEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'pinterest':
        return (
          <div className="flex justify-start my-4">
            <PinterestEmbed url={src} width={embedWidth} />
          </div>
        )

      case 'x':
        return (
          <div className="flex justify-start my-4">
            <XEmbed url={src} width={embedWidth} />
          </div>
        )

      default:
        return (
          <div className="text-red-500 text-center p-4 my-4 border border-red-200 rounded">
            Unsupported embed platform: {platform}
          </div>
        )
    }
  }

  return <div className="social-media-embed-container">{renderEmbed()}</div>
}

export default SocialMediaEmbedNode
