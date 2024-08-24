<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { addTag, deleteTag, getTags } from '../../storage';
    import type { Tag } from '../../models';

    let newTag: Tag = { name: '' }; // Assuming Tag has a 'name' property
    let tags = writable<Tag[]>([]);

    onMount(() => {
        // Load existing tags from storage
        getTags((storedTags: Tag[]) => {
            tags.set(storedTags);
        });
    });

    function addNewTag() {
        if (newTag.name.trim()) {
            newTag.name = newTag.name.replace(/\s+/g, '_'); // Replace spaces with underscores
            addTag(newTag, () => {
                getTags((updatedTags: Tag[]) => {
                    tags.set(updatedTags);
                });
            });
            newTag = { name: '' }; // Reset newTag
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            addNewTag();
        }
    }

    function removeTag(tagToDelete: Tag) {
        deleteTag(tagToDelete, () => {
            getTags((updatedTags: Tag[]) => {
                tags.set(updatedTags);
            });
        });
    }
</script>

<style>
    .chip {
        display: inline-flex;
        align-items: center;
        padding: 0 10px;
        height: 32px;
        font-size: 14px;
        border-radius: 16px;
        background-color: #e0e0e0;
        margin: 5px;
    }

    .chip .icon {
        margin-left: 8px;
        cursor: pointer;
    }

    .chip .icon:hover {
        color: #ff0000;
    }

    .chip-list {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        padding: 0;
    }

    .chip-list li {
        margin: 5px;
    }
</style>

<main>
    <h1>Tags</h1>
    <input type="text" bind:value={newTag.name} placeholder="Enter a new tag" on:keydown={handleKeydown} />
    <button on:click={addNewTag}>Add Tag</button>

    <ul class="chip-list">
        {#each $tags as tag}
            <li class="chip">
                {tag.name} <span class="icon" on:click={() => removeTag(tag)}>➖</span>
            </li>
        {/each}
    </ul>
</main>