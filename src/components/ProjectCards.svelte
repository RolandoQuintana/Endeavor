<script lang="ts">
    import { Project } from '../models';
    import { addProject, getProjects } from '../storage';

    export let projects: Project[];
    $: console.log('ProjectCards received projects:', projects);

    function loadProjects() {
        getProjects((projects) => {
            projects = projects;
        });
    }
</script>

<div class="project-cards-container">
    {#each projects as project (project.id)}
        <div class="project-card">
            <h3>{project.name}</h3>
            <!-- <p>{project.description}</p> -->
        </div>
    {/each}
</div>

<style>
    .project-cards-container {
        overflow-y: auto;
        flex-grow: 1;
        padding-right: 10px;
    }

    .project-card {
        background-color: #f4f4f4;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .project-cards-container::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .project-cards-container {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>