"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNostrEvents } from "nostr-react"
import { PostCard } from "@/components/PostCard"

export function Feed() {
  const [activeTab, setActiveTab] = useState("all")

  const { events, isLoading } = useNostrEvents({
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