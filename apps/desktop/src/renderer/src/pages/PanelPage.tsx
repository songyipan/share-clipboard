import { usePanelType } from '../hooks/usePanelType'
import { SearchPanel } from '../components/search/SearchPanel'
import { NotebookPanel } from '../components/notebook/NotebookPanel'
import { ImagePanel } from '../components/image-panel/ImagePanel'
import { PANEL_TYPES } from '../utils/panel'

export function PanelPage(): React.JSX.Element {
  const panelType = usePanelType()

  const renderPanel = (): React.JSX.Element | null => {
    if (!panelType) return null
    if (panelType === PANEL_TYPES.NOTEBOOK) return <NotebookPanel />
    if (panelType === PANEL_TYPES.IMAGE) return <ImagePanel />
    if (panelType === PANEL_TYPES.SEARCH) return <SearchPanel />
    return null
  }

  return (
    <div style={{ background: 'transparent', height: '100vh', padding: '8px' }}>
      {renderPanel()}
    </div>
  )
}
