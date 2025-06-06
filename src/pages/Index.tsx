
import { useAuthContext } from '@/components/AuthProvider'
import { Dashboard } from '@/components/Dashboard'
import { HeroSection } from '@/components/HeroSection'
import { Header } from '@/components/Header'
import { StatsSection } from '@/components/StatsSection'
import { Footer } from '@/components/Footer'

const Index = () => {
  const { isAuthenticated } = useAuthContext()

  if (isAuthenticated) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <Footer />
    </div>
  )
}

export default Index
