import React, { Fragment, useEffect, createRef, useRef } from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import Dropzone from "react-dropzone";
import { IconButton } from "@material-ui/core";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
const LoadLocalIFC = () => {
  const dropzoneRef = createRef();
  const viewerRef = useRef();
  useEffect(() => {
    const container = document.getElementById("viewer-container");
    const viewerAPI = new IfcViewerAPI({ container });
    viewerAPI.addAxes();
    viewerAPI.addGrid();
    viewerAPI.IFC.setWasmPath("wasm/");
    viewerRef.current = viewerAPI;
  }, []);
  const onDrop = (files) => {
    viewerRef.current.IFC.loadIfc(files[0], true);
  };
  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };
  return (
    <Fragment>
      <aside style={{ width: 50 }}>
        <IconButton onClick={handleClickOpen}>
          <FolderOpenOutlinedIcon />
        </IconButton>
      </aside>
      <Dropzone ref={dropzoneRef} onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      <div
        id="viewer-container"
        style={{
          position: "relative",
          height: "80vh",
          width: "80vw",
        }}
      ></div>
    </Fragment>
  );
};

export default LoadLocalIFC;
