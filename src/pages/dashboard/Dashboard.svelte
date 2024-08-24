<script lang="ts">
    import { onMount } from 'svelte';
    import { getEndeavors, getTags } from '../../storage';
    import type { Endeavor, Tag } from '../../models';

    let endeavors: Endeavor[] = [];
    let tags: Tag[] = [];

    onMount(() => {
        loadEndeavors();
        loadTags();
    });

    function loadEndeavors() {
        getEndeavors((loadedEndeavors) => {
            endeavors = loadedEndeavors;
        });
    }

    function loadTags() {
        getTags((loadedTags) => {
            tags = loadedTags;
        });
    }
</script>

<style>
    .chip {
        display: inline-flex;
        padding: 0.5em 1em;
        margin: 0.5em;
        border-radius: 16px;
        background-color: #f1f1f1;
        white-space: nowrap;
    }

    .endeavor-chip {
        border: 2px solid;
    }

    .columns {
        display: flex;
        gap: 20px;
    }

    .column {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>

<h2>Dashboard</h2>
<!-- Dashboard content -->

<div class="columns">
    <div class="column">
        <h3>Endeavors</h3>
        {#each endeavors as endeavor}
            <div class="chip endeavor-chip" style="border-color: {endeavor.color};">
                {endeavor.name}
            </div>
        {/each}
    </div>

    <div class="column">
        <h3>Tags</h3>
        {#each tags as tag}
            <div class="chip">
                {tag.name}
            </div>
        {/each}
    </div>
</div>