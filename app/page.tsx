import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Upcoming Events</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((event) => (
            <Card key={event} className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Event {event}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="dark:text-gray-300">Event details go here...</p>
                <Link href={`/calendar/${event}`}>
                  <Button variant="link" className="dark:text-purple-300">
                    View Details
                  </Button>
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
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Groups</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((group) => (
            <Card key={group} className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Group {group}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="dark:text-gray-300">Group description goes here...</p>
                <Link href={`/group/${group}`}>
                  <Button variant="link" className="dark:text-purple-300">
                    View Group
                  </Button>
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

