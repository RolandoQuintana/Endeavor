<!-- src/components/EndeavorSelect.svelte -->
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { getEndeavors } from '../storage';

    export let selectedEndeavor;
    const dispatch = createEventDispatcher();
    let options = [];

    onMount(async () => {
        await loadEndeavors();
    });

    async function loadEndeavors() {
        const loadedEndeavors = await getEndeavors();
        options = [{ name: 'None', color: '' }, ...loadedEndeavors];
        if (options.length > 0) {
                // Ensure the dropdown value is set to selectedEndeavor
            selectedEndeavor = selectedEndeavor;
            dispatch('mounted', { selectedEndeavor });
        }
    }

    function handleChange(event) {
        const selectedOption = options.find(option => option.name === event.target.value);
        dispatch('change', selectedOption);
    }
</script>

<select on:change={handleChange} bind:value={selectedEndeavor}>
    {#each options as option}
        <option value={option.name}>{option.name}</option>
    {/each}
</select>