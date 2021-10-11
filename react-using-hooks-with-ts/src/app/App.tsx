import React, { useEffect, useRef, useState } from 'react';

import { IconButton, CircularProgress, Backdrop } from '@mui/material';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { FolderOpenOutlined } from '@mui/icons-material';

function App() {

  const ifcContainer = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<IfcViewerAPI | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ifcContainer.current) {
      const ifcContainerElement = ifcContainer.current;
      const ifcViewer = new IfcViewerAPI({ container: ifcContainerElement });
      ifcViewer.addAxes();
      ifcViewer.addGrid();
      setViewer(ifcViewer);
    }
  }, []);
  useEffect(() => {
    if (viewer) {
      window.onmousemove = viewer.IFC.prePickIfcItem;
    }
  }, [viewer]);
  return (
    <div className={'contentWrapper'}>
      <div>
        <input
          type="file"
          id="file"
          accept='.ifc'
          onChange={async (e): Promise<void> => {
            const file = e?.target?.files !== null && e?.target?.files[0];
            if (file) {
              setLoading(true);
              await viewer?.IFC.loadIfc(file, true);
              setLoading(false)
            }
          }}
          className={'fileInput'}
        />
        <label htmlFor="file">
          <IconButton color="primary" aria-label="upload file" component="span">
            <FolderOpenOutlined />
          </IconButton>
        </label>
      </div>
      <div className={'ifcContainer'} ref={ifcContainer} />
      <Backdrop
        className={'backdrop'}
        open={loading}
      >
        <CircularProgress />
      </Backdrop>
    </div>
  );
}

export { App };
