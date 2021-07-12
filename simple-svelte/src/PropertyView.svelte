<script>
    import { IfcPropertyValuesFormatted } from './IfcStore'
</script>

    {#each $IfcPropertyValuesFormatted as pset}
    <h4>{pset.name}</h4>
    <small><i>{pset.description}</i></small><br/>
    <table>
        <thead>
            <tr>
                <th>name</th>
                <th>value</th>
            </tr>
        </thead>
        <tbody>
            {#each pset.props as row}
                <tr>
                    <td>{row.name}</td>
                    <td>{row.value}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <hr/>
    {/each}
    

<style>

    h4 {
        margin-bottom: 4px;
    }
    table, th, td {
		border: 1px solid lightgray;
		border-collapse: collapse;
        width: 100%;
	}

    hr {
        border-top: 1px rgb(214, 214, 214);
        width: 90%;
    }

</style>