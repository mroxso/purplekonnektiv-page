"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { nip19, Event as NostrEvent } from "nostr-tools"
import { useProfile } from "nostr-react"
import { useState, useEffect } from "react"
import { getImageUrlFromKind20Event } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function PostCard({ post }: { post: NostrEvent }) {
  // Format pubkey to show only first 4 and last 4 characters
  const formatPubkey = (pubkey: string) => {
    const npub = nip19.npubEncode(pubkey);
    if (npub.length <= 8) return npub;
    return `${npub.slice(0, 8)}...${npub.slice(-4)}`;
  }

  // Format timestamp to local date time without seconds
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
  }

  // Extract image URLs from post content
  const extractImageUrls = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    return content.match(urlRegex) || [];
  }
  
  // Remove image URLs from the displayed content
  const removeImageUrls = (content: string, imageUrls: string[]) => {
    let cleanContent = content;
    imageUrls.forEach(url => {
      cleanContent = cleanContent.replace(url, '');
    });
    // Clean up any extra whitespace or multiple line breaks
    return cleanContent.replace(/(\n\s*\n\s*\n)+/g, '\n\n').trim();
  }

  const [username, setUsername] = useState(formatPubkey(post.pubkey))
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [displayContent, setDisplayContent] = useState(post.content)

  const { data: userData } = useProfile({
    pubkey: post.pubkey,
  });

  useEffect(() => {
    if (userData && userData.name) {
      setUsername(userData.name)
    }
  }, [userData])

  useEffect(() => {
    if (post.content && post.kind === 1) {
      const urls = extractImageUrls(post.content);
      setImageUrls(urls);
      setDisplayContent(removeImageUrls(post.content, urls));
    } else {
      setDisplayContent(post.content);
    }
  }, [post.content, post.kind])

  return (
    <Card>
      <CardHeader className="bg-purple-100 dark:bg-purple-900/30 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{username}</h3>
            <p className="text-sm text-muted-foreground">{formatTimestamp(post.created_at)}</p>
          </div>
          <Badge variant="outline" className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
            {post.kind === 1 ? 'Note' : post.kind === 20 ? 'Media' : `Kind ${post.kind}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 whitespace-pre-wrap">
        {displayContent && displayContent.trim() !== '' && (
          <p className="mb-4 break-words">
            {displayContent}
          </p>
        )}
        
        {imageUrls.length > 0 && (
          <div className={`grid gap-2 ${imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mb-4`}>
            {imageUrls.map((url, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden aspect-video">
                <img
                  src={url}
                  alt="Post image"
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
        
        {(post.kind === 20) && (
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img
              src={getImageUrlFromKind20Event(post.tags)}
              alt="Post image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
      {/* <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Repeat2 className="h-4 w-4" />
          <span>{post.shares}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter> */}
    </Card>
  )
}