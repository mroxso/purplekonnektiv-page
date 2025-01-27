import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/placeholder.svg" alt="User Avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">User Name</h1>
          <p className="text-gray-500">npub1234...5678</p>
          <p className="text-gray-500">wallet1234...5678</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge variant="secondary">PK Subscriber</Badge>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((message) => (
            <Card key={message}>
              <CardHeader>
                <CardTitle>Message {message}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Message content goes here...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

