import { DataPanelState, InlineLoading } from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

export function AccountToolsLoading() {
  return (
    <DataPanelState>
      <InlineLoading message={copy.common.loadingTitle} />
    </DataPanelState>
  );
}
