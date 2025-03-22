import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Feed } from "@/components/Feed"
import { Metadata } from "next"
import { CalendarFeed } from "@/components/CalendarFeed"

export const metadata: Metadata = {
  title: "Purple Konnektiv | Home",
  description: "Welcome to Purple Konnektiv - Connect with the community through Nostr",
}

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card (shows first on mobile) */}
        <Card className="col-span-1 order-first lg:order-last">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Upcoming events and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <Calendar mode="single" className="rounded-md border" /> */}
            <CalendarFeed />
          </CardContent>
        </Card>

        {/* Social Feed Card (shows second on mobile) */}
        <Card className="col-span-1 lg:col-span-2 order-last lg:order-first">
          <CardHeader>
            <CardTitle>Social Feed</CardTitle>
            <CardDescription>Check out the latest posts on nostr</CardDescription>
          </CardHeader>
          <CardContent>
            <Feed />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

