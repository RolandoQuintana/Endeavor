<script lang="ts">
    import { onMount } from 'svelte';
    import { Endeavor } from '../models';
    import { addEndeavor, getEndeavors } from '../storage';
    import { currentView, selectedItemId, selectedItemType } from '../stores/appState';
    
    let endeavors: Endeavor[] = [];
    
    function addNewEndeavor() {
        const name = prompt('Enter Endeavor name:');
        if (name) {
            const formattedName = name.replace(/\s+/g, '_'); // Replace spaces with underscores
            const endeavor = new Endeavor(Date.now(), formattedName);
            addEndeavor(endeavor, () => {
                loadEndeavors();
                selectEndeavor(endeavor.id); // Navigate to the new endeavor's page
            });
        }
    }
    
    export function loadEndeavors() {
        getEndeavors((loadedEndeavors) => {
            endeavors = loadedEndeavors;
        });
    }
    
    function selectEndeavor(id: number) {
        currentView.set('endeavor');
        selectedItemId.set(id.toString());
        selectedItemType.set('endeavor');
    }

    function goToDashboard() {
        currentView.set('dashboard');
    }

    function goToTags() {
        currentView.set('tags');
    }
    
    onMount(() => {
        loadEndeavors();
        document.addEventListener('endeavorDeleted', handleEndeavorDeleted);
        document.addEventListener('colorChanged', handleColorChanged);
    });

    function handleEndeavorDeleted() {
        loadEndeavors();
    }

    function handleColorChanged(event: CustomEvent<{ id: number; color: string }>) {
        const { id, color } = event.detail;
        const endeavor = endeavors.find(e => e.id === id);
        if (endeavor) {
            endeavor.color = color;
            console.log(`Endeavor color changed: ${endeavor.name} - ${color}`); // Add console log to verify
            loadEndeavors();
        }
    }
</script>
    
<div class="sidebar">
    <div class="user-section">
        <img src="path_to_user_avatar.jpg" alt="User avatar" class="avatar">
        <span class="username">Rolando</span>
    </div>
    <nav>
        <ul class="nav-list">
            <li>
                <button class="nav-link" on:click={goToDashboard}>
                    <span class="icon">🏠</span> Dashboard
                </button>
            </li>
            <li>
                <button class="nav-link" on:click={goToTags}>
                    <span class="icon">🏷️</span> Tags
                </button>
            </li>
        </ul>
    </nav>
    <div class="section-header">
        <h2 class="section-title">My Endeavors</h2>
        <button class="add-endeavor-button" on:click={addNewEndeavor}>
            <span class="plus-icon">+</span>
        </button>
    </div>
    <ul class="project-list">
        {#each endeavors as endeavor}
            <li>
                <button on:click={() => selectEndeavor(endeavor.id)}>
                    <span class="icon">#</span> {endeavor.name}
                    <span class="color-circle" style="background-color: {endeavor.color};"></span>
                </button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .sidebar {
        background-color: #fafafa;
        color: #202020;
        padding: 20px;
        height: 100vh;
        width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    }

    .user-section {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .username {
        font-weight: bold;
    }

    .button-container {
        margin-bottom: 20px;
    }

    .add-task {
        background-color: #db4c3f;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        text-align: left;
    }

    .plus-icon {
        margin-right: 5px;
    }

    .nav-list, .project-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .nav-list li, .project-list li {
        margin-bottom: 10px;
    }

    .nav-list a,
    .nav-list .nav-link {
        text-decoration: none;
        color: #202020;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 5px;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        font: inherit;
    }

    .nav-list a:hover,
    .nav-list .nav-link:hover {
        background-color: #eeeeee;
    }

    .icon {
        margin-right: 10px;
        font-size: 16px;
    }

    .count {
        margin-left: auto;
        background-color: #eeeeee;
        padding: 2px 5px;
        border-radius: 10px;
        font-size: 12px;
    }

    .count.highlight {
        background-color: #ff9a14;
        color: white;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .section-title {
        font-size: 14px;
        text-transform: uppercase;
        color: #808080;
        margin: 0;
    }

    .add-endeavor-button {
        background: none;
        border: none;
        color: #808080;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }

    .add-endeavor-button:hover {
        background-color: #eeeeee;
        color: #202020;
    }

    .plus-icon {
        line-height: 1;
    }

    .project-list button {
        background: none;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
    }

    .color-circle {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-left: 10px;
    }
</style>