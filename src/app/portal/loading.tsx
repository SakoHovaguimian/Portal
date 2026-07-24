import { strings } from '@/content/strings'
import { LoadingState } from '@/components/feedback/loadingState'

export default function PortalLoading() {
  return <LoadingState label={strings.shared.loading} />
}
