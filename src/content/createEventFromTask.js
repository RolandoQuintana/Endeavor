import select from '../components/select.svelte';
import selectTag from '../components/selectTag.svelte';
import { getEndeavors } from '../storage';
function myMain() {
    console.log('createEventFromTask.js loaded');
    function checkForTaskDialog() {
        console.log('checkForSelectTaskDialog');
        const taskDialog = document.querySelector('div[role="dialog"].ecHOgf');
        if (taskDialog && !taskDialog.querySelector('.event-from-task')) {
            console.log('Select task dialog found');
            appendEndeavorSelect(taskDialog);
        }
    }

    function updateColorPicker(color) {
        const colorPickerButton = document.querySelector('div[jsname="QPiGnd"]');
        if (colorPickerButton) {
            // Open the color picker dropdown
            colorPickerButton.click();

            // Wait for the dropdown to open and then select the color
            setTimeout(() => {
                const colorOptions = document.querySelectorAll('div[jsname="Ly0WL"]');
                colorOptions.forEach(option => {
                    if (option.getAttribute('data-color') === color) {
                        option.click();
                        console.log('Selected color:', color);
                    }
                });
            }, 500); // Adjust the timeout as necessary
        }
    }

    function appendEndeavorSelect(taskDialog) {
        const tablist = taskDialog.querySelector('.hMdQi');
        if (tablist) {
            const eventFromTaskContainer = document.createElement('div');
            eventFromTaskContainer.className = 'event-from-task';
            tablist.appendChild(eventFromTaskContainer);


            const selectTagContainer = document.createElement('div');
            selectTagContainer.className = 'tag-select';
            tablist.appendChild(selectTagContainer);

            // Add the button to create an event from the task
            const createEventButton = document.createElement('button');
            createEventButton.className = 'create-event-button';
            createEventButton.textContent = 'Create Event from Task';
            createEventButton.style.cursor = 'pointer';
            createEventButton.addEventListener('click', async () => {
                const taskTitleElement = taskDialog.querySelector('#rAECCd'); // Update the selector to target the specific element

                if (taskTitleElement) {
                    const taskTitle = taskTitleElement.textContent;
                    console.log('Task Title:', taskTitle);

                    // Copy the task title to the clipboard
                    await navigator.clipboard.writeText(taskTitle);
                    console.log('Task title copied to clipboard');

                    const createButton = document.querySelector('div[role="button"][aria-label="Create"]');
                    if (createButton) {
                        createButton.click();

                        // Wait for a brief moment and then click the "Event" element
                        setTimeout(() => {
                            const eventElement = document.querySelector('span[role="menuitem"][aria-label="Event"]');
                            if (eventElement) {
                                // Create a new mouse event
                                const event = new MouseEvent('mousedown', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true
                                });
                                eventElement.dispatchEvent(event);

                                // Create a new mouse event
                                const event2 = new MouseEvent('mouseup', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true
                                });
                                eventElement.dispatchEvent(event2);

                                console.log('Event element clicked');

                                // Wait for the input to be focused and then paste the task title
                                setTimeout(async () => {
                                    const activeElement = document.activeElement;
                                    if (activeElement && activeElement.tagName === 'INPUT') {
                                        const inputElement = activeElement;
                                        const clipboardText = await navigator.clipboard.readText();
                                        inputElement.value = clipboardText;
                                        console.log('Task title pasted');

                                        // Extract the endeavor from the task title
                                        const endeavorMatch = taskTitle.match(/#e:([^#\s]*)/);
                                        const endeavor = endeavorMatch ? endeavorMatch[1] : 'None';
                                        console.log('Extracted Endeavor:', endeavor);

                                        // Check and select the endeavor in the dropdown
                                        const endeavorSelect = document.querySelector('.endeavor-select select');
                                        if (endeavorSelect) {
                                            const options = Array.from(endeavorSelect.options);
                                            const matchingOption = options.find(option => option.value === endeavor);
                                            if (matchingOption) {
                                                endeavorSelect.value = endeavor;
                                                console.log('Endeavor selected:', endeavor);
                                                const endeavors = await getEndeavors();
                                                const thisEndeavor = endeavors.find(e => e.name === endeavor);
                                                if (thisEndeavor) {
                                                    updateColorPicker(thisEndeavor.color);
                                                }
                                            } else {
                                                console.log('Endeavor not found in options');
                                            }
                                        } else {
                                            console.error('Endeavor select element not found');
                                        }
                                    } else {
                                        console.error('Focused input element not found');
                                    }
                                }, 1000); // Adjust the timeout as necessary
                            } else {
                                console.error('Event element not found');
                            }
                        }, 500); // Adjust the timeout as necessary
                    } else {
                        console.error('Create button not found');
                    }
                } else {
                    console.error('Task title element not found');
                }
            });

            tablist.appendChild(createEventButton);
        } else {
            console.error('Tablist not found');
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                checkForTaskDialog();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkForTaskDialog();
}

window.addEventListener("load", myMain, false);