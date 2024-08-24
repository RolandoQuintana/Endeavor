<script lang="ts">
  import { currentView, selectedItemId, selectedItemType } from '../stores/appState';
  import Sidebar from "../components/Sidebar.svelte";
  import Dashboard from "../pages/dashboard/Dashboard.svelte";
  import Endeavor from "../pages/endeavor/Endeavor.svelte";
  import Tags from "../pages/tags/Tags.svelte";
  
  let view: string;
  let itemId: string | null;
  let itemType: string | null;
  
  currentView.subscribe(v => view = v);
  selectedItemId.subscribe(id => itemId = id);
  selectedItemType.subscribe(type => itemType = type);

  function handleEndeavorDeleted() {
    const event = new CustomEvent('endeavorDeleted', { bubbles: true });
    document.dispatchEvent(event);
  }

  function handleColorChanged(event: CustomEvent<{ id: number; color: string }>) {
    console.log('colorChanged', event.detail);
    const colorChangedEvent = new CustomEvent('colorChanged', { 
      detail: event.detail, 
      bubbles: true 
    });
    document.dispatchEvent(colorChangedEvent);
  }
</script>
  
<div class="app-container">
  <Sidebar />
  <main>
    {#if view === 'dashboard'}
      <Dashboard />
    {:else if view === 'tags'}
      <Tags />
    {:else if itemType === 'endeavor' && itemId}
      <Endeavor on:colorChanged={handleColorChanged} on:endeavorDeleted={handleEndeavorDeleted}/>
    {/if}
  </main>
</div>
  
<style>
  .app-container {
    display: flex;
  }
  main {
    flex-grow: 1;
    padding: 20px;
  }
</style>