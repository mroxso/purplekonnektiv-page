"use client"

import { Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Event as NostrEvent } from "nostr-tools"
import { useProfile } from "nostr-react"
import { useState, useEffect } from "react"

export function PostCard({ post }: { post: NostrEvent }) {

  const [username, setUsername] = useState(post.pubkey)

  const { data: userData } = useProfile({
    pubkey: post.pubkey,
  });

  useEffect(() => {
    if (userData && userData.username) {
      setUsername(userData.username)
    }
  }, [userData])

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
          <span className="text-xs text-muted-foreground">{post.created_at}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 whitespace-pre-wrap">
        {post.content && (
          <p className="mb-4 break-words">
            {post.content}
          </p>
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
      <CardFooter className="p-4 pt-0 flex justify-between">
        {/* <Button variant="ghost" size="sm" className="flex items-center gap-1">
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
        </Button> */}
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}