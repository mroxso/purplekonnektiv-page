"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function SettingsModal() {
  const [language, setLanguage] = useState("en")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="dark:text-white dark:hover:text-purple-300">
          Open Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium dark:text-white">Relays</h3>
            <p className="dark:text-gray-300">Relay information and subscription options go here...</p>
          </div>
          <div>
            <h3 className="text-lg font-medium dark:text-white">Language</h3>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en" className="dark:text-gray-300">
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="de" id="de" />
                <Label htmlFor="de" className="dark:text-gray-300">
                  Deutsch
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode" className="dark:text-gray-300">
              Subscribe to PurpleKonnektiv Relay
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

