import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export const SignupCard = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  return (
    <Card className="w-full h-full bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-300">Sign Up</CardTitle>
        <CardDescription className="text-slate-400">Sign up to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input
            className="bg-[#212435] border border-neutral-700
         px-3 py-2 text-sm text-neutral-200 
         placeholder-neutral-500 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
         disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Email"
            value={signupForm.email}
            disabled={false}
            required
            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
          />
          <Input
            className="bg-[#212435] border border-neutral-700
         px-3 py-2 text-sm text-neutral-200 
         placeholder-neutral-500 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
         disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Password"
            type="password"
            value={signupForm.password}
            disabled={false}
            required
            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
          />
          <Input
            className="bg-[#212435] border border-neutral-700
         px-3 py-2 text-sm text-neutral-200 
         placeholder-neutral-500 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
         disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Confirm Password"
            type="password"
            value={signupForm.confirmPassword}
            disabled={false}
            required
            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
          />
          <Button
            disabled={false}
            size={'lg'}
            type="submit"
            className="px-6 py-3 rounded-[8px] font-medium text-white
         bg-gradient-to-r from-[#133dae] via-[#2054c6] to-[#2b6bd3]
         shadow-md
         transition duration-300
         hover:shadow-lg
         hover:scale-0 w-full"
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
