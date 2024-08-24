<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';

    export let defaultColor: string = '';
    const dispatch = createEventDispatcher();

    const colors = [
        { name: 'Tomato', value: '#D50000' },
        { name: 'Flamingo', value: '#E67C73' },
        { name: 'Tangerine', value: '#F4511E' },
        { name: 'Banana', value: '#F6BF26' },
        { name: 'Sage', value: '#33B679' },
        { name: 'Basil', value: '#0B8043' },
        { name: 'Peacock', value: '#039BE5' },
        { name: 'Blueberry', value: '#3F51B5' },
        { name: 'Lavender', value: '#7986CB' },
        { name: 'Grape', value: '#8E24AA' },
        { name: 'Graphite', value: '#616161' }
    ];

    let selectedColor = defaultColor || colors[0].value;
    let dropdownOpen = false;

    // Reactive statement to update selectedColor when defaultColor changes
    $: if (defaultColor !== selectedColor) {
        selectedColor = defaultColor;
    }

    function selectColor(color: string) {
        selectedColor = color;
        defaultColor = color;
        dropdownOpen = false;
        dispatch('colorSelected', { color });
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function closeDropdown() {
        dropdownOpen = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Element;
        if (!target.closest('.dropdown')) {
            closeDropdown();
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDropdown();
        }
    }

    function handleColorKeyDown(event: KeyboardEvent, color: string) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectColor(color);
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--selected-color, #D50000);
        cursor: pointer;
        border: 1px solid #ccc;
    }

    .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        z-index: 1;
        padding: 10px;
    }

    .dropdown.open .dropdown-menu {
        display: block;
    }

    .color-option {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        margin: 5px;
        display: inline-block;
    }
</style>

<div class="dropdown" class:open={dropdownOpen}>
    <div
        class="dropdown-toggle"
        style="--selected-color: {selectedColor}; background-color: {selectedColor};"
        on:click={toggleDropdown}
        on:keydown={handleKeyDown}
        tabindex="0"
        role="button"
        aria-label="Select color"
    ></div>
    <div class="dropdown-menu">
        {#each colors as color}
            <div
                class="color-option"
                style="background-color: {color.value};"
                on:click={() => selectColor(color.value)}
                on:keydown={(event) => handleColorKeyDown(event, color.value)}
                tabindex="0"
                role="button"
                aria-label={`Select color ${color.name}`}
            ></div>
        {/each}
    </div>
</div>