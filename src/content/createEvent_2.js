import select from '../components/select.svelte';
import selectTag from '../components/selectTag.svelte';

function myMain() {
    console.log('createEvent_2.js loaded');
    function checkForTaskDialog() {
        console.log('checkForTaskDialog');
        const taskDialog = document.querySelector('div[role="dialog"].ecHOgf');
        if (taskDialog && !taskDialog.querySelector('.endeavor-select')) {
            console.log('Task dialog found');
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
        const tablist = taskDialog.querySelector('div[role="tablist"][jsname="I0Fcpe"].A6sfdc.YzQjIf');
        if (tablist) {
            const selectEndeavorContainer = document.createElement('div');
            selectEndeavorContainer.className = 'endeavor-select';
            tablist.appendChild(selectEndeavorContainer);

            // Render the Svelte component
            const selectEndeavor = new select({
                target: selectEndeavorContainer,
                props: {
                    selectedEndeavor: 'None'
                }
            });

            const selectTagContainer = document.createElement('div');
            selectTagContainer.className = 'tag-select';
            tablist.appendChild(selectTagContainer);

            const select_tag = new selectTag({
                target: selectTagContainer,
                props: {
                    selectedTag: 'None'
                }
            });

            // Add event listener for endeavor selection
            selectEndeavor.$on('change', (event) => {
                const selectedEndeavor = event.detail;
                const taskTitle = taskDialog.querySelector('input[aria-label="Add title and time"]');
                const eventTitle = taskDialog.querySelector('input[aria-label="Add title"]');
                if (taskTitle) {
                    // Remove any existing appended endeavor
                    taskTitle.value = taskTitle.value.replace(/#endeavor:[^#]*/, '').trim();
                    // Append the new selected endeavor at the end
                    taskTitle.value += ` #e:${selectedEndeavor.name}`;
                    taskTitle.setAttribute('value', taskTitle.value);
                    taskTitle.innerHTML = taskTitle.value; // Update innerHTML
                    taskTitle.blur(); // Remove focus
                    taskTitle.focus(); // Refocus
                }
                if (eventTitle) {
                    // Remove any existing appended endeavor
                    eventTitle.value = eventTitle.value.replace(/#endeavor:[^#]*/, '').trim();
                    // Append the new selected endeavor at the end
                    eventTitle.value += ` #e:${selectedEndeavor.name}`;
                    eventTitle.setAttribute('value', eventTitle.value);
                    eventTitle.innerHTML = eventTitle.value; // Update innerHTML
                    eventTitle.blur(); // Remove focus
                    eventTitle.focus(); // Refocus
                }
                updateColorPicker(selectedEndeavor.color);

            });

            // Add event listener for tag selection
            select_tag.$on('change', (event) => {
                const selectedTag = event.detail;
                const taskTitle = taskDialog.querySelector('input[aria-label="Add title and time"]');
                const eventTitle = taskDialog.querySelector('input[aria-label="Add title"]');
                
                function updateTitleField(field) {
                    if (field) {
                        // Remove any existing appended tag
                        field.value = field.value.replace(/#t:[^#]*/, '').trim();
                        if (selectedTag.name !== 'None') {
                            // Append the new selected tag at the end
                            field.value += ` #t:${selectedTag.name}`;
                        }
                        field.setAttribute('value', field.value);
                        field.innerHTML = field.value; // Update innerHTML
                        field.blur(); // Remove focus
                        field.focus(); // Refocus
                    }
                }

                updateTitleField(taskTitle);
                updateTitleField(eventTitle);
            });
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