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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white mb-2 sm:mb-0">Calendar</h2>
          <Button variant="outline" className="dark:text-white dark:hover:text-purple-300">
            List View
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <Input type="search" placeholder="Search events" className="mt-4 dark:bg-gray-800 dark:text-white" />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Event Details</h2>
        {selectedEvent ? (
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Event {selectedEvent}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">Event details go here...</p>
            </CardContent>
          </Card>
        ) : (
          <p className="dark:text-gray-300">Select an event to view details</p>
        )}
        <div className="mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" className="w-full sm:w-auto dark:text-white dark:hover:text-purple-300">
            Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto dark:text-white dark:hover:text-purple-300">
              Home
            </Button>
          </Link>
          <Button className="w-full sm:w-auto">Add Appointment</Button>
        </div>
      </section>
    </div>
  )
}

