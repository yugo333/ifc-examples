import "./App.css";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Backdrop, CircularProgress, IconButton } from "@material-ui/core";
import React from "react";
import Dropzone from "react-dropzone";
import BcfDialog from "./components/BcfDialog";
import { TypeList, TypeListName } from "./typeList";

//Icons
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import CropIcon from "@material-ui/icons/Crop";

// https://zenn.dev/masamiki/articles/c9a34119acfd6c

class App extends React.Component {
  state = {
    bcfDialogOpen: false,
    loaded: false,
    loading_ifc: false,
    ite: [
      <p className="floor" key={1}>
        default
      </p>,
    ],

    //
    GlobalId: null,
    Name: null,
    ObjectType: null,
    PredefinedType: null,
    //
    classType: [],
    //
    objTypeToggle: true,
  };

  constructor(props) {
    super(props);
    this.dropzoneRef = React.createRef();
  }

  componentDidMount() {
    const container = document.getElementById("viewer-container");
    const viewer = new IfcViewerAPI({ container });
    viewer.axes.setAxes();
    viewer.grid.setGrid();
    viewer.IFC.setWasmPath("../../");

    this.viewer = viewer;
    this.scene = this.viewer.context.scene.scene;
    this.render = this.viewer.context.renderer.renderer;

    window.onmousemove = this.viewer.prepickIfcItem;
    window.ondblclick = this.viewer.clipper.createPlane();
  }

  onDrop = async (files) => {
    this.setState({ loading_ifc: true });
    await this.viewer.IFC.loadIfc(files[0], true);

    const models = this.viewer.context.items.ifcModels;

    //   console.log(this.viewer.context.items.ifcModels);
    // it use first model
    const firstModel = await models[0];
    await this.viewer.plans.computeAllPlanViews(firstModel.modelID);
    const planes = await this.viewer.plans.planLists[firstModel.modelID];

    this.ite = [
      <p
        key={"default"}
        className="floor"
        onClick={() => {
          this.onItemClick("default");
        }}
      >
        default
      </p>,
    ];

    this.items = (await planes)
      ? Object.keys(planes).map((plane, i) => {
          const title = decode(plane);
          this.ite.push(
            <p
              key={plane}
              className="floor"
              onClick={() => {
                this.onItemClick(plane);
              }}
            >
              floor:{title}
            </p>
          );
          return { floor: plane };
        })
      : [];

    this.typeArray = [];

    await TypeList.forEach(async (item, index) => {
      const ids = await this.viewer.IFC.getAllItemsOfType(0, item, false);
      if (ids.length > 1) {
        await this.typeArray.push(
          <p className="type" key={item} onClick={() => this.objectType(item)}>
            {TypeListName[index]}
          </p>
        );
      }
    });
    await setTimeout(async () => {
      await this.setState({
        loaded: true,
        loading_ifc: false,
        ite: this.ite,
        classType: this.typeArray,
      });
    }, 3000);
  };

  handleToggleClipping = () => {
    this.viewer.clipper.active = !this.viewer.clipper.active;
  };

  handleClickOpen = () => {
    this.dropzoneRef.current.open();
  };

  handleOpenBcfDialog = () => {
    this.setState({
      ...this.state,
      bcfDialogOpen: true,
    });
  };

  handleCloseBcfDialog = () => {
    this.setState({
      ...this.state,
      bcfDialogOpen: false,
    });
  };

  handleOpenViewpoint = (viewpoint) => {
    this.viewer.currentViewpoint = viewpoint;
  };

  //   hover時の各パーツ選択
  handleMouseMove = async () => {
    if (this.state.loaded && this.state.objTypeToggle) {
      await this.viewer.IFC.selector.prePickIfcItem();
      //   await console.log(this.viewer.IFC.selector);
      //   await console.log(this.viewer.IFC.selector.prePickIfcItem());
    }
  };

  handleDblclick = async () => {
    if (this.state.loaded) {
      let value = {};
      const models = this.viewer.context.items.ifcModels;
      if (models.length === 0) return;

      if (this.viewer.clipper.active) {
        this.viewer.clipper.createPlane();
      } else {
        const result = await this.viewer.IFC.selector.pickIfcItem(true);
        if (!result) return;
        const { modelID, id } = result;
        const props = await this.viewer.IFC.getProperties(
          modelID,
          id,
          true,
          true
        );
        value = JSON.parse(JSON.stringify(props));
        // console.log(this.viewer);
        // console.log(value);
        // await console.log(await this.viewer.IFC.getSpatialStructure(modelID));
        // console.log(value.Name.value);
        // console.log(value.ObjectType);
        // console.log(value.PredefinedType);
        const name = decode(value.Name.value);

        const objectType =
          value.ObjectType === null ? null : decode(value.ObjectType.value);

        const predefinedType = value.PredefinedType
          ? decode(value.PredefinedType.value)
          : null;

        this.setState({
          Name: name,
          ObjectType: objectType,
          GlobalId: value.GlobalId.value,
          PredefinedType: predefinedType,
        });
      }
    }
  };

  //   平面に変更する
  onItemClick = async (item) => {
    if (item === "default") {
      this.viewer.plans.exitPlanView(true);
      this.viewer.edges.toggle("0");
      return;
    }
    const models = this.viewer.context.items.ifcModels;
    if (models.length === 0) return;

    // it use first model
    const firstModel = models[0];
    await this.viewer.plans.goTo(firstModel.modelID, String(item), true);
    this.viewer.context.items.ifcModels.forEach((model) =>
      this.viewer.edges.toggle(`${model.modelID}`)
    );
    // this.viewer.shadowDropper.shadows[0].root.visible = false;
    // this.viewer.filler.fills[0].visible = false;
  };

  // 選択物以外は投下させる
  objectType = async (type) => {
    //object Type 表示時はhover アクション止める
    this.setState({ objTypeToggle: false });
    // defaultなら元に戻すだけ
    if (type === "default") {
      this.viewer.IFC.selector.unHighlightIfcItems();
      this.setState({ objTypeToggle: true });
      return;
    }

    // 選択項目以外のopacityと色を設定
    this.viewer.IFC.selector.defHighlightMat =
      await this.viewer.IFC.selector.initializeDefMaterial(0xff0000, 0);
    this.viewer.IFC.selector.defPreselectMat =
      await this.viewer.IFC.selector.initializeDefMaterial(0xff0000, 0);
    this.viewer.IFC.selector.defSelectMat =
      await this.viewer.IFC.selector.initializeDefMaterial(0xff0000, 0);

    // 選択物のハイライト
    await this.viewer.IFC.selector.unHighlightIfcItems();
    const ids = await this.viewer.IFC.getAllItemsOfType(0, type, false);
    await this.viewer.IFC.selector.highlightIfcItemsByID(0, ids);

    // console.log(this.viewer.IFC);
  };

  render() {
    return (
      <>
        <BcfDialog
          open={this.state.bcfDialogOpen}
          onClose={this.handleCloseBcfDialog}
          onOpenViewpoint={this.handleOpenViewpoint}
        />
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
          <aside style={{ width: 50 }}>
            <IconButton onClick={this.handleClickOpen}>
              <FolderOpenOutlinedIcon />
            </IconButton>
            <IconButton onClick={this.handleToggleClipping}>
              <CropIcon />
            </IconButton>
          </aside>
          <Dropzone ref={this.dropzoneRef} onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <div
              id="viewer-container"
              onMouseMove={this.handleMouseMove}
              onDoubleClick={this.handleDblclick}
              style={{ position: "relative", height: "100%", width: "100%" }}
            />
          </div>
        </div>
        <Backdrop
          style={{
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            alignContent: "center",
          }}
          open={this.state.loading_ifc}
        >
          <CircularProgress />
        </Backdrop>
        <div className="listParent">
          list
          <div className="list">{this.state.ite}</div>
        </div>
        <div className="typeList">
          Object Type
          <div className="ot">
            <p className="type" onClick={() => this.objectType("default")}>
              default
            </p>
            {this.state.classType}
          </div>
        </div>
        <div className="modelDetail">
          <p>name: {this.state.Name}</p>
          <p>globalID: {this.state.GlobalId}</p>
          <p>objectType: {this.state.ObjectType}</p>
          <p>predefinedType: {this.state.PredefinedType}</p>
        </div>
      </>
    );
  }
}

export default App;

export function decode(text) {
  // \英数字\　を取得
  //   https://dencode.com/ja/string
  // https://www.rapidtables.org/ja/convert/number/hex-to-ascii.html
  // https://jsprimer.net/basic/string-unicode/

  const allText = new RegExp(/\\(?=.*?[a-zA-Z])(?=.*?\d)[a-zA-Z\d]{4,}\\/, "g");
  // textが16進数であれば値を取得し、そうでなければreturnする
  const beforeText = text.match(allText);
  if (beforeText === null) return text;

  let newText = "";
  const Unicode = new RegExp(/(?=.*?[a-zA-Z])(?=.*?\d)[a-zA-Z\d]{4}/, "g");
  const UnicodeNumber = new RegExp(/[0-9]{4}/, "g");
  let checkText = "";

  // beforeTextは複数取得する場合があるのでmap
  beforeText.forEach((t) => {
    // const bt = t.replace(/\\/g, "").toLowerCase();
    // 同じ文字か連続する場合があるので、簡易的に条件分岐
    if (checkText === t) {
      return;
    }
    checkText = t;
    // 取得したtをさらに4文字づつにする
    let eachUnicode = t.match(Unicode);
    // tが数字だけの場合Unicodeではnullになるので
    if (eachUnicode === null) {
      eachUnicode = t.match(UnicodeNumber);
    }

    eachUnicode.forEach((code) => {
      // 4文字にした16進数を日本語に変換する
      newText += String.fromCodePoint(`0x${code}`);
    });
  });

  return newText;
}
