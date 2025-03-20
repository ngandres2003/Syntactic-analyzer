"use client"

import { useEffect, useRef } from "react"
import { cn } from "../lib/utils"

export default function CodeEditor({ value, onChange, placeholder, className }) {
  const textareaRef = useRef(null)

  // Auto-resize the textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener("input", adjustHeight)
    adjustHeight()

    return () => {
      textarea.removeEventListener("input", adjustHeight)
    }
  }, [])

  return (
    <div className={cn("relative w-full h-full font-mono", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full p-4 resize-none outline-none bg-background text-foreground"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}

