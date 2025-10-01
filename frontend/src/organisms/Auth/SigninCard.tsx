import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const SigninCard = () => {
  const [signinForm, setSigninForm] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  return (
    <Card className="w-full h-full bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-300">Sign In</CardTitle>
        <CardDescription className="text-slate-400">Sign in to access your account</CardDescription>
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
            value={signinForm.email}
            type="email"
            disabled={false}
            required
            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
          />
          <Input
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-neutral-200 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Password"
            type="password"
            value={signinForm.password}
            disabled={false}
            required
            onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
          />

          <Button disabled={false} size={'lg'} type="submit" className="btn-primary w-full">
            Continue
          </Button>
        </form>
        <Separator className="my-4 bg-neutral-700 " />
        <p className="text-center text-sm mt-2 text-slate-500">
          Do not have an account?
          <span
            onClick={() => navigate('/auth/signup')}
            className="text-[#4384ec] ml-1 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
