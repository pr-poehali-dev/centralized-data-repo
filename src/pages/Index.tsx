import { LandingPage } from '@/components/landing'
import { useVisitTracker } from '@/hooks/useVisitTracker'

const Index = () => {
  useVisitTracker()
  return <LandingPage />
}

export default Index