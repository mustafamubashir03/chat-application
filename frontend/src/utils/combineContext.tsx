const combineContext = (...providers: any) => {
  /**
   * This combines multiple context providers together and gives a single context provider
   */
  return ({ children }: { children: React.ReactNode }) => {
    return providers?.reduceRight((accumulator: any, CurrentProvider: any) => {
      return <CurrentProvider>{accumulator}</CurrentProvider>
    }, children)
  }
}

export default combineContext
