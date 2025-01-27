import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GroupView({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-purple-200 rounded-full"></div>
          <h1 className="text-2xl font-bold">Group {params.id}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((img) => (
              <div key={img} className="w-8 h-8 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <Link href="/gallery" className="text-purple-600 hover:underline">
            ilLUMINAte Gallery
          </Link>
        </div>
      </div>
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Chat messages go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Group posts go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="space-x-4">
        <Button variant="outline">Back</Button>
        <Button>New Chat</Button>
        <Button>New Post</Button>
      </div>
    </div>
  )
}

