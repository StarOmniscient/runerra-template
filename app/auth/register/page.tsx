"use client"

import { useState } from "react"
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
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; username?: string }>({})
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState<{
        length: boolean;
        uppercase: boolean;
        number: boolean;
        special: boolean;
    }>({
        length: false,
        uppercase: false,
        number: false,
        special: false,
    })

    const validatePassword = (value: string) => {
        const criteria = {
            length: value.length >= 16,
            uppercase: /[A-Z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[!@#$%^&*]/.test(value),
        }

        setErrors(criteria)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setFieldErrors({})
        


        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username }),
            })

            const data = await res.json()

            if (!res.ok) {
                // handle unique constraint errors
                if (data.error?.includes("email")) setFieldErrors((prev) => ({ ...prev, email: "Email already in use" }))
                if (data.error?.includes("userName")) setFieldErrors((prev) => ({ ...prev, username: "Username already in use" }))
                throw new Error("Please fix the errors below")
            }

            setMessage("✅ Account created! You can now sign in.")
            router.push("/auth/login")
            setEmail("")
            setPassword("")
            setUsername("")
            setErrors({
                length: false,
                uppercase: false,
                number: false,
                special: false,
            })
        } catch (err: any) {
            setMessage(`❌ ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const isPasswordValid =
        errors.length &&
        errors.uppercase &&
        errors.number &&
        errors.special;
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create account</CardTitle>
                            <CardDescription>
                                Enter your email, username, and password to create an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Username */}
                                <div className="grid gap-3">
                                    <Label htmlFor="userName">Username</Label>
                                    <Input
                                        id="userName"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Your username"
                                        required
                                        disabled={loading}
                                    />
                                    {fieldErrors.username && <p className="text-sm text-red-500">{fieldErrors.username}</p>}
                                </div>

                                {/* Email */}
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="m@example.com"
                                        required
                                        disabled={loading}
                                    />
                                    {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        type="button"
                                        className="ml-auto text-sm underline hover:opacity-80"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            validatePassword(e.target.value)
                                            if (!passwordTouched) setPasswordTouched(true)
                                        }}
                                        onFocus={() => {
                                            if (!passwordTouched) setPasswordTouched(true)
                                        }}
                                        required
                                        disabled={loading}
                                    />
                                    {passwordTouched && (
  <ul className="text-sm list-disc pl-5 space-y-1">
    <li className={cn("transition-colors", errors.length ? "text-green-500" : "text-red-500")}>
      At least 16 characters
    </li>
    <li className={cn("transition-colors", errors.uppercase ? "text-green-500" : "text-red-500")}>
      At least 1 uppercase letter
    </li>
    <li className={cn("transition-colors", errors.number ? "text-green-500" : "text-red-500")}>
      At least 1 number
    </li>
    <li className={cn("transition-colors", errors.special ? "text-green-500" : "text-red-500")}>
      At least 1 special character
    </li>
  </ul>
)}
                                </div>

                                {/* Submit */}
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!isPasswordValid || loading}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </Button>
                                </div>

                                {/* Feedback */}
                                {message && <p className="mt-3 text-center text-sm">{message}</p>}

                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <a href="/auth/login" className="underline underline-offset-4">
                                        Sign in
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
