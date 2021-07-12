import { writable, derived } from 'svelte/store';
import { IfcViewerAPI } from 'web-ifc-viewer';

function createIfcViewer() {
	const { subscribe, set, update } = writable(null);

	return {
		subscribe,
		start: (container) => set(startViewer(container))
	};
}

function startViewer(container) {
    let newViewer = new IfcViewerAPI({container});
    newViewer.addAxes();
    newViewer.addGrid();
    newViewer.setWasmPath("wasm/");
    return newViewer
}

export const viewer = createIfcViewer()

export const modelID = writable(-1)

export const ifcTree = writable({})

export const expID = writable(0)

export const IfcItemProperties = derived(
	[viewer, modelID, expID],
	([$viewer, $modelID, $expId]) => $viewer.getProperties($modelID, $expId, true)
);

export const IfcPropertyValuesFormatted = derived(
    IfcItemProperties,
    $IfcItemProperties => getPropertyGroups($IfcItemProperties)
)

function getPropertyGroups(props) {
    const psets = props.psets.map((p) => {
      return { name: 'Property set', description: 'Properties defined by the user', props: getProps(p) };
    });
    delete props.psets;
    const type = props.type.map((p) => {
      return { name: 'Type properties', description: 'Properties defined by the type of element', props: getProps(p) };
    });
    delete props.type;
    props = {
      name: 'Native properties',
      description: 'Properties contained in the IFC class',
      props: getProps(props)
    };
    return [props, ...psets, ...type];
  }

function getProps(props) {
    for (let i in props) {
      props[i] = getProp(props[i]);
    }
    return Object.keys(props).map((p) => {
      return { name: p, value: props[p] };
    });
}

function getProp(prop) {
    if (prop == null || prop == undefined) return 'undefined';
    if (prop.value != undefined) return '' + prop.value;
    if (typeof prop == 'number') return '' + prop;
    return 'undefined';
}