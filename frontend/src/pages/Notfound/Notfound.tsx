import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export const Notfound = () => {
  const navigate = useNavigate()
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mb-8">
          <h2 className="mt-6 text-6xl font-extrabold text-gray-100">404</h2>
          <p className="mt-2 text-3xl font-bold text-gray-100">Page not found</p>
          <p className="mt-2 text-sm text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Button onClick={() => navigate(-1)} variant={'primary'}>
            Go back
          </Button>
        </div>
      </div>
      <div className="mt-16 w-full max-w-2xl"></div>
    </div>
  )
}
