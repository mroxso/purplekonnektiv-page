import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((event) => (
            <Card key={event}>
              <CardHeader>
                <CardTitle>Event {event}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Event details go here...</p>
                <Link href={`/calendar/${event}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link href="/calendar">
          <Button className="mt-4">Calendar View</Button>
        </Link>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Groups</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((group) => (
            <Card key={group}>
              <CardHeader>
                <CardTitle>Group {group}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Group description goes here...</p>
                <Link href={`/group/${group}`}>
                  <Button variant="link">View Group</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link href="/create-group">
          <Button className="mt-4">Create Group</Button>
        </Link>
      </section>
    </div>
  )
}

