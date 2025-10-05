import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, LucideLoader2, TriangleAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const SigninCard = ({
  signinForm,
  setSigninForm,
  onSigninFormSubmit,
  validationError,
  isPending,
  error,
  isSuccess,
}: any) => {
  const navigate = useNavigate()
  return (
    <Card className="w-full h-full bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-300">Sign In</CardTitle>
        <CardDescription className="text-slate-400">Sign in to access your account</CardDescription>
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
            <p>Successfully signed in. You'll be redirected to the Home page within 5 seconds.</p>
            <LucideLoader2 className="size-9 animate-spin" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSigninFormSubmit}>
          <Input
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-slate-300
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Email"
            value={signinForm.email}
            type="email"
            disabled={isPending}
            required
            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
          />
          <Input
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-slate-300 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Password"
            type="password"
            value={signinForm.password}
            disabled={isPending}
            required
            onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
          />

          <Button disabled={isPending} size={'lg'} type="submit" className="btn-primary w-full">
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
