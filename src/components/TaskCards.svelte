<script lang="ts">
    import { Task } from '../models';

    export let tasks: Task[];
</script>

<div class="task-cards-container">
    {#each tasks as task (task.id)}
        <div class="task-card">
            <h3>{task.name}</h3>
            {#if task.dueDate}
                <p>Due: {task.dueDate}</p>
            {/if}
        </div>
    {/each}
</div>

<style>
    .task-cards-container {
        overflow-y: auto;
        flex-grow: 1;
        padding-right: 10px;
    }

    .task-card {
        background-color: #f4f4f4;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .task-cards-container::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .task-cards-container {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>