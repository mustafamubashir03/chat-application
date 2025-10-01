import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import { LucideLoader2, TriangleAlert } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
export const SignupCard = ({
  signupForm,
  setSignupForm,
  validationError,
  onSignupFormSubmit,
  error,
  isPending,
  isSuccess
}: any) => {
  const navigate = useNavigate()
  return (
    <Card className="w-full h-full bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-300">Sign up</CardTitle>
        <CardDescription className="text-slate-400">Sign up to access your account</CardDescription>
        {validationError && (
          <div className="bg-red-950 p-2 rounded-md flex items-center gap-x-2 text-sm text-red-300 mb-4  mt-2">
            <TriangleAlert className="size-5" />
            <p>{validationError}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-950 p-2 rounded-md flex items-center gap-x-2 text-sm text-red-300 mb-4  mt-2">
            <TriangleAlert className="size-5" />
            <p>{error.message}</p>
          </div>
        )}
        {isSuccess && (
          <div className="bg-green-950 p-4 rounded-md flex items-start gap-x-2 text-sm text-green-300 mb-4  mt-2 ">
            <CheckCircle className="size-9" />
            <p>Successfully signed up. You'll be redirected to the login page within 5 seconds.</p>
            <LucideLoader2 className="size-9 animate-spin" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSignupFormSubmit}>
          <Input
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-neutral-200 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Username"
            value={signupForm?.username}
            type="text"
            disabled={isPending}
            required
            onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
          />
          <Input
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-neutral-200 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Email"
            value={signupForm?.email}
            type="email"
            disabled={isPending}
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
            value={signupForm?.password}
            disabled={isPending}
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
            value={signupForm?.confirmPassword}
            disabled={isPending}
            required
            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
          />
          <Button disabled={false} size={'lg'} type="submit" className="btn-primary w-full">
            Continue
          </Button>
        </form>
        <Separator className="my-4 bg-neutral-700 " />
        <p className="text-center text-sm mt-2 text-slate-500">
          Already have an account?
          <span
            onClick={() => navigate('/auth/signin')}
            className="text-[#4384ec] ml-1 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
