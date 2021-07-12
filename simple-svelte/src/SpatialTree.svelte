<script context="module">
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>

<script>
    import { expID } from './IfcStore'
    export let tree
    console.log(tree)
    const {type, expressID, children} = tree    

    let expanded = _expansionState[expressID] || false
	const toggleExpansion = () => {
		expanded = _expansionState[expressID] = !expanded
	}
	$: arrowDown = expanded

</script>

    <ul>
        <li>
            {#if children.length > 0}
                <span on:click={toggleExpansion} class="title" class:selected="{$expID === expressID}">
                    <span class="arrow" class:arrowDown>&#x25b6</span>
                    {type + ' - ' + expressID} 
                </span>
                <div class="info" on:click={()=>expID.set(expressID)}>ℹ</div>
                {#if expanded}
                    {#each children as child}
                        <svelte:self tree={child} />
                    {/each}
                {/if}
            {:else}
                <span>
                    <span class="no-arrow"/>
                    {type + ' - ' + expressID}
                </span>
                <div class="info" on:click={()=>expID.set(expressID)}>ℹ</div>
            {/if}
        </li>
    </ul>

<style>

    ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem; 
		user-select: none;
	}

    .selected {
        color: lightblue;
    }

    .no-arrow { padding-left: 1.0rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
		/* transition: transform 200ms; */
	}
    .title {
        cursor: pointer;
    }

	.arrowDown { transform: rotate(90deg); }

    .info {
        cursor: pointer;
        display: inline-block;
        color: rgb(67, 67, 250);
        padding-left: 6px;
    }
</style>