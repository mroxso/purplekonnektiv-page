"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Feed } from "@/components/Feed"
import { CalendarFeed } from "@/components/CalendarFeed"

export function CombinedFeed() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-4">
        <Feed />
      </TabsContent>
      
      <TabsContent value="events" className="mt-4">
        <CalendarFeed />
      </TabsContent>
    </Tabs>
  )
}