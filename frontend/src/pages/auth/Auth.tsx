const Auth = ({ children }: any) => {
  return (
    <div className="h-[100dvh] flex items-center justify-center p-4 bg-background">
      <div className="w-full md:h-auto max-w-[420px]">{children}</div>
    </div>
  )
}

export default Auth
