"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Plus, X } from "lucide-react"
import { useNostr } from "nostr-react"

// Extend window interface for NIP-07
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>
      signEvent(event: {
        created_at: number
        kind: number
        tags: string[][]
        content: string
      }): Promise<{
        id: string
        pubkey: string
        created_at: number
        kind: number
        tags: string[][]
        content: string
        sig: string
      }>
    }
  }
}

export function CreateCalendarEvent() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [eventType, setEventType] = useState<"date" | "time">("date")
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [customTags, setCustomTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const { connectedRelays } = useNostr()

  // Check if NIP-07 extension is available
  const isNip07Available = typeof window !== 'undefined' && window.nostr

  // Generate UUID v4
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Add custom tag
  const addTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()])
      setNewTag("")
    }
  }

  // Remove custom tag
  const removeTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter(tag => tag !== tagToRemove))
  }

  // Reset form
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation("")
    setStartDate(undefined)
    setEndDate(undefined)
    setStartTime("")
    setEndTime("")
    setCustomTags([])
    setNewTag("")
    setEventType("date")
  }

  // Convert date and time to timestamps or date strings
  const formatDateTime = (date: Date, time?: string): string | number => {
    if (eventType === "date") {
      // Date-based event: return ISO date string (YYYY-MM-DD)
      return date.toISOString().split('T')[0]
    } else {
      // Time-based event: return Unix timestamp
      if (time) {
        const [hours, minutes] = time.split(':').map(Number)
        const dateTime = new Date(date)
        dateTime.setHours(hours, minutes, 0, 0)
        return Math.floor(dateTime.getTime() / 1000)
      }
      return Math.floor(date.getTime() / 1000)
    }
  }

  // Create and publish event
  const handleSubmit = async () => {
    if (!title.trim() || !startDate) {
      alert("Please fill in required fields (title and start date)")
      return
    }

    if (!isNip07Available) {
      alert("NIP-07 browser extension is required to sign events. Please install a compatible Nostr extension like Alby or nos2x.")
      return
    }

    setIsLoading(true)

    try {
      // Build tags array
      const tags: string[][] = [
        ["d", generateUUID()],
        ["title", title.trim()],
        ["t", "PurpleKonnektiv"], // Always add PurpleKonnektiv tag
      ]

      // Add start date/time
      tags.push(["start", formatDateTime(startDate, startTime).toString()])

      // Add end date/time if provided
      if (endDate) {
        tags.push(["end", formatDateTime(endDate, endTime).toString()])
      }

      // Add location if provided
      if (location.trim()) {
        tags.push(["location", location.trim()])
      }

      // Add custom tags
      customTags.forEach(tag => {
        tags.push(["t", tag])
      })

      // Determine event kind
      const kind = eventType === "date" ? 31922 : 31923

      // Create unsigned event
      const unsignedEvent = {
        created_at: Math.floor(Date.now() / 1000),
        kind,
        tags,
        content: description.trim(),
      }

      // Sign with NIP-07
      const signedEvent = await window.nostr!.signEvent(unsignedEvent)
      
      // Publish to relays manually
      const relays = Object.values(connectedRelays)
      let publishedCount = 0
      
      for (const relay of relays) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pub = (relay as any).publish(signedEvent)
          // Simple promise wrapper
          await new Promise<boolean>((resolve) => {
            pub.on('ok', () => {
              publishedCount++
              resolve(true)
            })
            pub.on('failed', (reason: string) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              console.warn(`Failed to publish to ${(relay as any).url}: ${reason}`)
              resolve(false)
            })
            // Timeout after 3 seconds
            setTimeout(() => resolve(false), 3000)
          })
        } catch (error) {
          console.warn(`Error publishing to relay:`, error)
        }
      }
      
      if (publishedCount === 0) {
        throw new Error("Failed to publish to any relay")
      }

      alert("Calendar event created and published successfully!")
      resetForm()
      setOpen(false)

    } catch (error) {
      console.error("Error creating calendar event:", error)
      alert("Failed to create calendar event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Calendar Event</DialogTitle>
          <DialogDescription>
            Create a new calendar event that will be published to the Nostr network and tagged with PurpleKonnektiv.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Type Selection */}
          <div>
            <Label className="text-base font-medium">Event Type</Label>
            <RadioGroup value={eventType} onValueChange={(value) => setEventType(value as "date" | "time")} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date-based (All-day or multi-day event)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="time" />
                <Label htmlFor="time" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Time-based (Specific start/end times)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Card className="mt-1">
                <CardContent className="p-3">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <Label>End Date</Label>
              <Card className="mt-1">
                <CardContent className="p-3">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => !startDate || date < startDate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Time Selection (only for time-based events) */}
          {eventType === "time" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
              className="mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-purple-600">
                  #PurpleKonnektiv
                </Badge>
                {customTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* NIP-07 Warning */}
          {!isNip07Available && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ NIP-07 browser extension is required to sign and publish events. 
                Please install a compatible Nostr extension like Alby or nos2x.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim() || !startDate || !isNip07Available || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}