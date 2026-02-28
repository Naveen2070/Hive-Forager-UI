import { createFileRoute } from '@tanstack/react-router'
import { UnderConstruction } from '@/components/shared/UnderConstruction.tsx'

export const Route = createFileRoute('/_app/movies/$movieId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnderConstruction/>
}
