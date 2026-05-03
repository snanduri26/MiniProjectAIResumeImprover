"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [resume, setResume] = useState("")
  const [improved, setImproved] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  // 📥 Load history
  const fetchHistory = async () => {
    const res = await fetch("/api/history")
    const data = await res.json()
    setHistory(data)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // 🚀 Improve resume
  const improveResume = async () => {
    setLoading(true)

    const res = await fetch("/api/improve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ resume })
    })

    const data = await res.json()
    setImproved(data.improved)

    setLoading(false)
    fetchHistory() // refresh history
  }

  // 📋 Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(improved)
    const [copied, setCopied] = useState(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(improved)
  setCopied(true)

  setTimeout(() => setCopied(false), 1500)
}
  }

  return (
    <main className="p-6 grid grid-cols-3 gap-6 h-screen bg-gray-50">

      {/* LEFT PANEL - INPUT */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-xl font-bold">Your Resume</h2>

        <Textarea
          className="h-[300px]"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume..."
        />

		<Button onClick={improveResume} disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <span>Improving...</span>
    </div>
  ) : (
    "Improve"
  )}
</Button>
		
      </div>

      {/* CENTER PANEL - OUTPUT */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-xl font-bold">Improved Resume</h2>

        <Card className="p-4 h-[300px] overflow-auto shadow-md rounded-2xl">
          {loading ? (
            <p>⏳ Generating...</p>
          ) : (
            <p className="whitespace-pre-wrap">{improved}</p>
          )}
        </Card>

        {improved && (
          <Button onClick={copyToClipboard}>
            {copied ? "Copied ✅" : "Copy"}
          </Button>
        )}
      </div>

      {/* RIGHT PANEL - HISTORY */}
      <div className="col-span-1 space-y-4 overflow-auto">
        <h2 className="text-xl font-bold">History</h2>

        {history.map((item) => (
  <Card key={item.id} className="p-3 space-y-2 cursor-pointer hover:bg-gray-100"
  onClick={() => {
    setResume(item.original)
    setImproved(item.improved)
  }}>

    <p className="text-sm font-semibold">Original:</p>
    <p className="text-xs">{item.original}</p>

    <p className="text-sm font-semibold">Improved:</p>
    <p className="text-xs">{item.improved}</p>

    <Button
      variant="destructive"
      size="sm"
      onClick={async (e) => {
        e.stopPropagation() // prevents card click issues

        await fetch(`/api/history/${item.id}`, {
          method: "DELETE"
        })

        fetchHistory()
      }}
    >
      Delete
    </Button>

  </Card>
))}
      </div>

    </main>
  )
}