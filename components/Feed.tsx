"use client"

import { useNostrEvents } from "nostr-react"
import { PostCard } from "@/components/PostCard"

export function Feed() {
  const { events } = useNostrEvents({
    filter: {
      kinds: [1,20],
      "#t": ["PurpleKonnektiv"]
    },
  });
  
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <PostCard key={event.id} post={event} />
      ))}
    </div>
  )
}