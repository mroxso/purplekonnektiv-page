import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialFeed } from "@/components/social-feed"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2/3 Card (Left) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Feed</CardTitle>
            <CardDescription>Check out the latest posts from your network</CardDescription>
          </CardHeader>
          <CardContent>
            <SocialFeed />
          </CardContent>
        </Card>

        {/* 1/3 Card (Right) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Your upcoming events and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" className="rounded-md border" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

