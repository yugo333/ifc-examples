<script>
	import { onMount } from 'svelte';
	import { viewer, modelID, ifcTree, expID } from './IfcStore'
	import PropertyView from './PropertyView.svelte';
	import SpatialTree from './SpatialTree.svelte';

	let fileInput
	var showTree = false
	var showDetails = false

	//Setup loader after dom loads
	onMount(async() => {
		const container = document.getElementById("viewer-container");
		viewer.start(container)
	})

	// load file from local disk
	const loadIfc = async (event) => {
   		await $viewer.IFC.loadIfc(event.target.files[0], true);
		modelID.set($viewer.context.items.ifcModels[0].modelID)
		ifcTree.set($viewer.IFC.getSpatialStructure($viewer.context.items.ifcModels[0].modelID))
	}

	// toggle Spatial Tree visibility
	function toggleTree() {
		showTree = !showTree
	}

	// toggle Property View visibility
	function toggleDetails() {
		showDetails = !showDetails
	}

	// on click set expID store value for use from other components like tree and props
	function setExpressIdShowProps() {
		if ($viewer) {
			const found = $viewer.IFC.pickIfcItem();
			if (found) {
				expID.set(found.id)
			}
		}
	}

</script>

<main>
	<aside class="side-menu" id="side-menu-left">
		<h1>IFC.js - Svelte Example</h1>
		<input style="display:none" type="file" accept=".ifc" on:change={(e)=>loadIfc(e)} bind:this={fileInput}>
		<button on:click={()=>fileInput.click()}>Open File</button>
		{#if $viewer} <!-- Need ifcviewer api loaded before allowing dropbox integration via api-->
		<button on:click={$viewer.openDropboxWindow()}>Dropbox</button>
		{/if}
		{#if ($modelID > -1)} <!-- hide buttons until they are useful (a model is loaded)-->
		<button on:click={$viewer.toggleClippingPlanes()}>Clipping Planes</button>
		<button on:click={toggleTree} class:selected="{showTree}">Tree</button>
		<button on:click={toggleDetails} class:selected="{showDetails}">Details</button>
		{/if}
	</aside>
	{#if (showTree || showDetails)}
	<div class="side-menu-right">
		{#if showTree} 
			<div class="right-menu-item">
				<SpatialTree tree={$ifcTree} ></SpatialTree>
			</div>
		{/if}
		{#if showDetails}
			<div class="right-menu-item">
				<PropertyView></PropertyView>
			</div>
		{/if}
	</div>
	{/if}
	
	<div id="viewer-container" 
		style="width: 100vw; height: 100vh" 
		on:mousemove={$viewer.IFC.prePickIfcItem()} 
		on:keydown={$viewer.removeClippingPlane()}
		on:click={setExpressIdShowProps}
		on:dblclick={$viewer.addClippingPlane()}>
	</div>
</main>

<style>
	h1 {
		color: white;
		font-weight: 100;
		width: 300px;
		margin: 10px;
	}
	.side-menu {
    	z-index: 1;
    	position: fixed;
    	height:100vh;
	}

	#side-menu-left {
	    width: 150px;
	}

	.side-menu-right {
		background-color: transparent;
		z-index: 1;
    	position: fixed;
		right: 10px;
    	height: 100%;
		width: 400px;
		display: flex;
		flex-direction: column;
	}

	.right-menu-item {
		overflow: auto;
		margin: 10px;
		flex: 1;
		padding: 6px;
		border-radius: 6px;
    	border: white 2px solid;
    	color: white;
    }

	.right-menu-item::-webkit-scrollbar {
  		width: 8px;
		height: 8px;
	}

	.right-menu-item::-webkit-scrollbar-track {
  		background: transparent;
	}	

	.right-menu-item::-webkit-scrollbar-thumb {
  		background: #888;
		border-radius: 8px;
	}

	.right-menu-item::-webkit-scrollbar-thumb:hover {
  		background: #555;
	}

	.selected {
		border: blue 3px solid;
	}

</style>