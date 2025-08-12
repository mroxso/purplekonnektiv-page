"use client"

import { useNostrEvents } from "nostr-react"
import { CalendarEvent } from "@/components/CalendarEvent"
import { CreateCalendarEvent } from "@/components/CreateCalendarEvent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function CalendarFeed() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Load date-based calendar events (kind 31922)
  const { events: dateEvents } = useNostrEvents({
    filter: {
      kinds: [31922],
      limit: 20,
      "#t": ["PurpleKonnektiv", "purplekonnektiv"]
    },
  });

  // Load time-based calendar events (kind 31923)
  const { events: timeEvents } = useNostrEvents({
    filter: {
      kinds: [31923],
      limit: 20,
      "#t": ["PurpleKonnektiv", "purplekonnektiv"]
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

  // Extract and count all tags from events
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    allEvents.forEach(event => {
      const tTags = event.tags.filter(tag => tag[0] === 't' && tag[1]);
      tTags.forEach(tag => {
        const tagValue = tag[1].toLowerCase();
        counts[tagValue] = (counts[tagValue] || 0) + 1;
      });
    });
    
    return counts;
  }, [allEvents]);
  
  // Get most used tags (sorted by frequency)
  const mostUsedTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Limit to top 10 most used tags
      .map(([tag]) => tag);
  }, [tagCounts]);
  
  // Filter events based on selected tag
  const filteredEvents = useMemo(() => {
    if (!selectedTag) return allEvents;
    
    return allEvents.filter(event => {
      const eventTags = event.tags
        .filter(tag => tag[0] === 't')
        .map(tag => tag[1]?.toLowerCase());
      
      return eventTags.includes(selectedTag.toLowerCase());
    });
  }, [allEvents, selectedTag]);
  
  // Filter for upcoming events (start date in the future)
  const upcomingEvents = filteredEvents.filter(event => {
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
  const pastEvents = filteredEvents.filter(event => {
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

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Clear filter if already selected
    } else {
      setSelectedTag(tag); // Set new filter
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Event Button */}
      <CreateCalendarEvent />
      {/* Tag filters */}
      {mostUsedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="text-sm text-muted-foreground mr-2 flex items-center">
            Filter by tag:
          </div>
          {mostUsedTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTag === tag ? "bg-purple-600" : "hover:bg-purple-100 dark:hover:bg-purple-900/30"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
              {selectedTag === tag && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
          {selectedTag && (
            <Badge
              variant="outline"
              className="cursor-pointer ml-2 hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={() => setSelectedTag(null)}
            >
              Clear filter
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

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
              {selectedTag 
                ? `No upcoming events found with tag #${selectedTag}.` 
                : "No upcoming events found."}
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
              {selectedTag 
                ? `No past events found with tag #${selectedTag}.` 
                : "No past events found."}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}