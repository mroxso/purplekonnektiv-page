"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { nip19, Event as NostrEvent } from "nostr-tools"
import { useProfile } from "nostr-react"
import { useState, useEffect } from "react"
import Image from "next/image"

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
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        {/* <Avatar>
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar> */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-semibold">{username}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(post.created_at)}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 whitespace-pre-wrap">
        {displayContent && displayContent.trim() !== '' && (
          <p className="mb-4 break-words">
            {displayContent}
          </p>
        )}
        
        {imageUrls.length > 0 && (
          <div className={`grid gap-2 ${imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mb-4`}>
            {imageUrls.map((url, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden aspect-video">
                <Image
                  src={url}
                  alt="Post image"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* {(post.kind === 20) && (
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={post.content || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full object-cover rounded-lg"
            />
          </div>
        )} */}
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