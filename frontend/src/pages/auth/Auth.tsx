const Auth = ({ children }: any) => {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <div className="md:h-auto max-w-[420px]">{children}</div>
    </div>
  )
}

export default Auth
