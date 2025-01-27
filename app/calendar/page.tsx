"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <Button variant="outline">List View</Button>
        </div>
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        <Input type="search" placeholder="Search events" className="mt-4" />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Event Details</h2>
        {selectedEvent ? (
          <Card>
            <CardHeader>
              <CardTitle>Event {selectedEvent}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Event details go here...</p>
            </CardContent>
          </Card>
        ) : (
          <p>Select an event to view details</p>
        )}
        <div className="mt-4 space-x-4">
          <Button variant="outline">Back</Button>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
          <Button>Add Appointment</Button>
        </div>
      </section>
    </div>
  )
}

