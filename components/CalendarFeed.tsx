"use client"

import { useNostrEvents } from "nostr-react"
import { CalendarEvent } from "@/components/CalendarEvent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CalendarFeed() {
  // Load date-based calendar events (kind 31922)
  const { events: dateEvents } = useNostrEvents({
    filter: {
      kinds: [31922],
      limit: 20,
    //   "#t": ["PurpleKonnektiv", "purplekonnektiv"]
    },
  });

  // Load time-based calendar events (kind 31923)
  const { events: timeEvents } = useNostrEvents({
    filter: {
      kinds: [31923],
      limit: 20,
    //   "#t": ["PurpleKonnektiv", "purplekonnektiv"]
    },
  });
  
  // Combine and sort all events chronologically
  const allEvents = [...dateEvents, ...timeEvents].sort((a, b) => {
    // Get start dates from tags
    const aStartTag = a.tags.find(tag => tag[0] === 'start')
    const bStartTag = b.tags.find(tag => tag[0] === 'start')
    
    if (!aStartTag || !bStartTag) return 0
    
    // For time-based events (kind 31923), start tag is a timestamp
    // For date-based events (kind 31922), start tag is a date string
    let aValue, bValue
    
    if (a.kind === 31923 && aStartTag[1]) {
      aValue = parseInt(aStartTag[1])
    } else if (a.kind === 31922 && aStartTag[1]) {
      aValue = new Date(aStartTag[1]).getTime() / 1000
    } else {
      aValue = 0
    }
    
    if (b.kind === 31923 && bStartTag[1]) {
      bValue = parseInt(bStartTag[1])
    } else if (b.kind === 31922 && bStartTag[1]) {
      bValue = new Date(bStartTag[1]).getTime() / 1000
    } else {
      bValue = 0
    }
    
    return aValue - bValue
  });
  
  // Filter for upcoming events (start date in the future)
  const upcomingEvents = allEvents.filter(event => {
    const startTag = event.tags.find(tag => tag[0] === 'start')
    if (!startTag || !startTag[1]) return false
    
    let startTimestamp
    if (event.kind === 31923) {
      // Time-based event: Unix timestamp
      startTimestamp = parseInt(startTag[1])
    } else {
      // Date-based event: ISO date string
      startTimestamp = new Date(startTag[1]).getTime() / 1000
    }
    
    return startTimestamp > (Date.now() / 1000)
  });
  
  // Filter for past events
  const pastEvents = allEvents.filter(event => {
    const startTag = event.tags.find(tag => tag[0] === 'start')
    if (!startTag || !startTag[1]) return false
    
    let startTimestamp
    if (event.kind === 31923) {
      startTimestamp = parseInt(startTag[1])
    } else {
      startTimestamp = new Date(startTag[1]).getTime() / 1000
    }
    
    return startTimestamp <= (Date.now() / 1000)
  });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <CalendarEvent key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No upcoming events found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          {pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <CalendarEvent key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No past events found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}