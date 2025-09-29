import { SignupCard } from '@/organisms/Auth/SignupCard'

const Auth = () => {
  return (
    <div className="h-[100vh] flex items-center justify-center bg-[#040512]">
      <div className="md:h-auto md:w-[420px]">
        <SignupCard />
      </div>
    </div>
  )
}

export default Auth
