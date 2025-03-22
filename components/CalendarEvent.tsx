"use client"

import { Event as NostrEvent } from "nostr-tools"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useProfile } from "nostr-react"

export function CalendarEvent({ event }: { event: NostrEvent }) {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [username, setUsername] = useState<string>("")

  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  })

  useEffect(() => {
    if (userData && userData.name) {
      setUsername(userData.name)
    }
  }, [userData])

  useEffect(() => {
    // Extract event details from tags
    const titleTag = event.tags.find(tag => tag[0] === 'title')
    const startTag = event.tags.find(tag => tag[0] === 'start')
    const endTag = event.tags.find(tag => tag[0] === 'end')
    const locationTag = event.tags.find(tag => tag[0] === 'location')

    if (titleTag && titleTag.length > 1) {
      setTitle(titleTag[1])
    }

    setDescription(event.content)

    // Format dates based on kind (31922 for date-based, 31923 for time-based)
    if (startTag && startTag.length > 1) {
      if (event.kind === 31922) {
        // Date-based event: ISO 8601 format (YYYY-MM-DD)
        setStartDate(formatDateString(startTag[1]))
      } else if (event.kind === 31923) {
        // Time-based event: Unix timestamp in seconds
        setStartDate(formatTimestamp(parseInt(startTag[1])))
      }
    }

    if (endTag && endTag.length > 1) {
      if (event.kind === 31922) {
        // Date-based event
        setEndDate(formatDateString(endTag[1]))
      } else if (event.kind === 31923) {
        // Time-based event
        setEndDate(formatTimestamp(parseInt(endTag[1])))
      }
    }

    if (locationTag && locationTag.length > 1) {
      setLocation(locationTag[1])
    }
  }, [event])

  // Format date string (YYYY-MM-DD) to more readable format
  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return dateStr
    }
  }

  // Format Unix timestamp to readable date and time
  const formatTimestamp = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000)
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    } catch (e) {
      return String(timestamp)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-purple-100 dark:bg-purple-900/30 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Posted by {username}</p>
          </div>
          <Badge variant="outline" className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
            {event.kind === 31922 ? 'All-Day Event' : 'Time-Based Event'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm">
              {startDate}
              {endDate && ` - ${endDate}`}
            </span>
          </div>
          
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>
        
        {description && (
          <div className="mt-2 text-sm whitespace-pre-wrap">
            {description}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm">
          RSVP
        </Button>
        <Button variant="outline" size="sm">
          Add to Calendar
        </Button>
      </CardFooter>
    </Card>
  )
}