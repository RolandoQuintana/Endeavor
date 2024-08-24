<script lang="ts">
    import { Time_Event } from '../models';

    export let events: Time_Event[];

    // Function to format date and time
    function formatDateTime(date: Date) {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        // Check if the date is today or tomorrow
        if (date.toDateString() === today.toDateString()) {
            return { datePart: 'Today', timePart: date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }) };
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return { datePart: 'Tomorrow', timePart: date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }) };
        }

        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'short' as 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        const datePart = date.toLocaleDateString(undefined, options);
        const timePart = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
        return { datePart, timePart };
    }
</script>

<div class="event-cards-container">
    {#each events as event (event.id)}
        <div class="event-card">
            <h3>{event.name}</h3>
            {#if event.startDate}
                <p>{formatDateTime(new Date(event.startDate)).datePart}</p> <!-- Convert to Date -->
                {#if event.endDate}
                    <p>{formatDateTime(new Date(event.startDate)).timePart} - {formatDateTime(new Date(event.endDate)).timePart}</p> <!-- Convert to Date -->
                {:else}
                    <p>{formatDateTime(new Date(event.startDate)).timePart}</p> <!-- Convert to Date -->
                {/if}
            {/if}
            {#if event.isRecurring}
                <p>Recurring</p>
            {/if}
        </div>
    {/each}
</div>

<style>
    .event-cards-container {
        overflow-y: auto;
        flex-grow: 1;
        padding-right: 10px;
    }

    .event-card {
        background-color: #f4f4f4; /* Change to your desired color */
        border-radius: 8px;
        padding: 10px; /* Reduce padding for tighter spacing */
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: left; /* Align text to the left */
        display: flex; /* Use flexbox for alignment */
        flex-direction: column; /* Stack items vertically */
        justify-content: flex-start; /* Align items to the top */
        height: auto; /* Ensure height is auto to fit content */
    }

    .event-card h3 {
        margin: 0; /* Remove margin from heading */
    }

    .event-card p {
        margin: 2px 0; /* Reduce margin for paragraphs */
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .event-cards-container::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .event-cards-container {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>