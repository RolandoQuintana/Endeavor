<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import type { Endeavor } from '../../models';
    import { getEndeavors } from '../../storage';
    import { selectedItemId, currentView, selectedItemType } from '../../stores/appState';
    import ProjectCards from '../../components/ProjectCards.svelte';
    import EventCards from '../../components/EventCards.svelte';
    import TaskCards from '../../components/TaskCards.svelte';
    import { Project, Time_Event, Task } from '../../models';
    import { addProject, getProjects, addEvent, getEvents, addTask, getTasks, updateEndeavor, deleteEndeavor } from '../../storage';
    import { get } from 'svelte/store';
    import { GoogleCalendarService } from '../../services/googleCalendarService';
    import ColorPicker from '../../components/ColorPicker.svelte';

    const googleCalendarService = new GoogleCalendarService();

    let endeavor: Endeavor | null = null;
    let eventSaved: boolean = false;
    let selectedColor: string | null = null;
    let defaultColor: string = '';

    const dispatch = createEventDispatcher();

    $: fetchEndeavor($selectedItemId);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'storeEventDetails') {
            eventSaved = true;
        }
    });

    function fetchEndeavor(id: string | null) {
        if (id) {
            getEndeavors((endeavors) => {
                endeavor = endeavors.find(e => e.id.toString() === id) || null;
                if (endeavor) {
                    loadProjects(endeavor.id);
                    loadEvents(endeavor.id);
                    loadTasks(endeavor.id);
                    selectedColor = endeavor.color || '';
                    defaultColor = endeavor.color || '';
                }
            });
        }
    }

    function handleColorSelected(event: CustomEvent) {
        selectedColor = event.detail.color;
        if (endeavor) {
            endeavor.color = selectedColor;
            updateEndeavor(endeavor, () => {
                console.log('Endeavor color updated in storage');
                if (endeavor) { // Add null check
                    console.log('Dispatching colorChanged event');
                    dispatch('colorChanged', { id: endeavor.id, color: selectedColor }); // Dispatch custom event
                }
            });
        }
    }

    function addNewProject() {
        const name = prompt('Enter Project name:');
        if (name && endeavor) {
            const project = new Project({
                id: Date.now(),
                name: name,
                endeavorId: endeavor.id
            });
            
            addProject(project, () => {
                loadProjects(endeavor!.id);
            });
        }
    }

    async function addNewEvent() {
        const response = await googleCalendarService.createBlankEvent();
        const eventID = response.id;
        const urlID = response.url_id;
        while (!eventSaved) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (eventID) {
            const event = await googleCalendarService.getEventByID(eventID);
            eventSaved = false;
            const timeEvent = googleEventToTimeEvent(event);

            addEvent(timeEvent, () => {
                loadEvents(endeavor!.id);
            });
        }
    }

    function googleEventToTimeEvent(event: any) {
        return new Time_Event({
            id: event.id,
            name: event.summary,
            endeavorId: endeavor!.id,
            startDate: event.start.dateTime,
            endDate: event.end.dateTime
        });
    }

    function addNewTask() {
        const name = prompt('Enter Task name:');
        if (name && endeavor) {
            const task = new Task({
                id: Date.now(),
                name: name,
                endeavorId: endeavor.id
            });
            
            addTask(task, () => {
                loadTasks(endeavor!.id);
            });
        }
    }

    function loadProjects(endeavorId: number) {
        getProjects((projects) => {
            if (endeavor) {
                endeavor.projects = projects.filter(p => p.endeavorId === endeavorId);
                endeavor = endeavor;
            }
        });
    }

    function loadEvents(endeavorId: number) {
        getEvents((events) => {
            if (endeavor) {
                endeavor.events = events.filter(e => e.endeavorId === endeavorId);
                endeavor = endeavor;
            }
        });
    }

    function loadTasks(endeavorId: number) {
        getTasks((tasks) => {
            if (endeavor) {
                endeavor.tasks = tasks.filter(t => t.endeavorId === endeavorId);
                endeavor = endeavor;
            }
        });
    }

    function deleteCurrentEndeavor() {
        if (endeavor) {
            const confirmDelete = confirm('Are you sure you want to delete this endeavor?');
            if (confirmDelete) {
                deleteEndeavor(endeavor.id, () => {
                    dispatch('endeavorDeleted'); // Dispatch custom event
                    currentView.set('dashboard');
                    selectedItemId.set(null);
                    selectedItemType.set(null);
                });
            }
        }
    }
</script>

{#if endeavor}
    <div class="endeavor-header">
        <h1>{endeavor.name}</h1>
        <button class="delete-button" on:click={deleteCurrentEndeavor}>Delete Endeavor</button>
    </div>
{/if}

{#if endeavor}
    <ColorPicker on:colorSelected={handleColorSelected} {defaultColor} />
{/if}

{#if selectedColor}
    <p>Selected Color: <span style="background-color: {selectedColor}; padding: 5px 10px; border-radius: 5px;">{selectedColor}</span></p>
{/if}

<style>
    .sections-container {
        display: flex;
        flex-direction: row;
        gap: 20px;
        height: calc(100vh - 100px);
    }

    .section {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .section-header {
        display: flex;
        align-items: left;
        margin-bottom: 10px;
    }

    .section-header h2 {
        margin: 0;
        margin-right: 10px;
    }

    .add-button {
        background-color: #db4c3f;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        transition: background-color 0.2s ease;
    }

    .add-button:hover {
        background-color: #c53727;
    }

    .plus-icon {
        font-size: 18px;
    }

    .color-picker {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-top: 10px;
    }

    .color-option {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
    }

    .endeavor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .delete-button {
        background-color: #db4c3f;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        transition: background-color 0.2s ease;
    }

    .delete-button:hover {
        background-color: #c53727;
    }
</style>