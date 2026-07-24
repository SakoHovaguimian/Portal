import { ServerEnvironment } from '@/config/environment'
import { SettingsPage } from '@/modules/portal/components/settingsPage'

export default function PortalSettingsPage() {
  return (
    <SettingsPage
      authMode={ServerEnvironment.authMode}
      realtimeMode={ServerEnvironment.realtimeMode}
      apiUrl={ServerEnvironment.apiBaseUrl}
    />
  )
}
