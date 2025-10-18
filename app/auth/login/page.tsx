"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signIn } from "next-auth/react"


export default function Page() {
    const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage("")

  const res = await signIn("credentials", {
    redirect: false, // ← crucial: prevents redirect
    identifier,
    password,
  })

  if (res?.error) {
    // Map common NextAuth errors to user-friendly messages
    let errorMessage = "Invalid email/username or password."
    if (res.error === "CredentialsSignin") {
      errorMessage = "Invalid email/username or password."
    } else if (res.error === "CallbackRouteError") {
      // If you throw custom errors in authorize(), they appear here
      errorMessage = "Authentication failed. Please try again."
    }
    setMessage(`❌ ${errorMessage}`)
  } else if (res?.ok) {
    // Successful login — now redirect manually
    window.location.href = "/home"
  }

  setLoading(false)
}


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Identifier */}
            <div className="grid gap-3">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Email or Username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                className="rounded-md"
              />
            </div>

            {/* Password */}
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="ml-auto text-sm underline hover:opacity-80"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="rounded-md"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full rounded-md" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>

            {/* Message */}
            {message && <p className="mt-3 text-center text-sm">{message}</p>}

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
      </div>
    </div>
  )
}