import React, {  useEffect, useRef, useState } from 'react';
import {IconButton, createStyles, makeStyles, CircularProgress, Backdrop} from '@material-ui/core';
import { IfcViewerAPI } from 'web-ifc-viewer';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';

const useStyle = makeStyles(() => createStyles({

  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden'
  },
  ifcContainer: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  fileInput: {
    display: 'none',
  },
  backdrop:{
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    alignContent: "center"
  }
}));
function App() {
  const classes = useStyle();

  const ifcContainer = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<IfcViewerAPI | null>(null);
  const [loading, setLoading] =useState(false)

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
      viewer.IFC.setWasmPath('../../');
      window.addEventListener('mousemove', viewer.IFC.pickIfcItem);
    }
  }, [viewer]);
  return (
      <div className={classes.contentWrapper}>
        <div>
          <input
              type="file"
              id="file"
              accept='.ifc'
              onChange={async (e): Promise<void> => {
                const file =e?.target?.files!==null&& e?.target?.files[0];
                if (file) {
                  setLoading(true);
                  await viewer?.IFC.loadIfc(file, true);
                  setLoading(false)
                }
              }}
              className={classes.fileInput}
          />
          <label htmlFor="file">
            <IconButton color="primary" aria-label="upload file" component="span">
              <FolderOpenOutlinedIcon />
            </IconButton>
          </label>
        </div>
        <div className={classes.ifcContainer} ref={ifcContainer}/>
        <Backdrop
            className={classes.backdrop}
            open={loading}
        >
          <CircularProgress/>
        </Backdrop>
      </div>
  );
}

export default App;
