<!-- src/components/EndeavorSelect.svelte -->
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { getTags } from '../storage';

    export let selectedTag = 'None';
    const dispatch = createEventDispatcher();
    let options = [];

    onMount(() => {
        loadTags();
    });

    function loadTags() {
        getTags((loadedTags) => {
            options = [{ name: 'None', color: '' }, ...loadedTags];
            if (options.length > 0) {
                dispatch('mounted', selectedTag);
            }
        });
    }

    function handleChange(event) {
        const selectedOption = options.find(option => option.name === event.target.value);
        dispatch('change', selectedOption);
    }
</script>

<select on:change={handleChange} bind:value={selectedTag}>
    {#each options as option}
        <option value={option.name}>{option.name}</option>
    {/each}
</select>