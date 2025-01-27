import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GroupView({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-purple-200 dark:bg-purple-700 rounded-full"></div>
          <h1 className="text-2xl font-bold dark:text-white">Group {params.id}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((img) => (
              <div key={img} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            ))}
          </div>
          <Link href="/gallery" className="text-purple-600 dark:text-purple-400 hover:underline">
            ilLUMINAte Gallery
          </Link>
        </div>
      </div>
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="chat" className="w-full">
            Chat
          </TabsTrigger>
          <TabsTrigger value="posts" className="w-full">
            Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">Chat messages go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">Group posts go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="space-y-2 sm:space-y-0 sm:space-x-4">
        <Button variant="outline" className="w-full sm:w-auto dark:text-white dark:hover:text-purple-300">
          Back
        </Button>
        <Button className="w-full sm:w-auto">New Chat</Button>
        <Button className="w-full sm:w-auto">New Post</Button>
      </div>
    </div>
  )
}

