import select from '../components/select.svelte';
import selectTag from '../components/selectTag.svelte';

let event_edit_page_selector = '.p9lUpf';

function myMain() {
    console.log('editEvent.js loaded');
    function checkForTaskDialog() {
        console.log('checkForEditDialog');
        const editDialog = document.querySelector(event_edit_page_selector);
        if (editDialog && !editDialog.querySelector('.endeavor-select')) {
            console.log('Edit dialog found');
            appendEndeavorSelect(editDialog);
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

    function extractTagFromTitle(title) {
        const match = title.match(/#t:([^#\s]*)/);
        return match ? match[1] : 'None';
    }

    function extractEndeavorFromTitle(title) {
        const match = title.match(/#e:([^#\s]*)/);
        return match ? match[1] : 'None';
    }

    function updateTitleFieldWithTag(field, newTagValue) {
        if (field) {
            // Remove any existing appended tag
            field.value = field.value.replace(/#t:[^#]*/, '').trim();
            if (newTagValue !== 'None') {
                // Append the new selected tag at the end
                field.value += ` #t:${newTagValue}`;
            }

            // Set the value property directly
            field.value = field.value;

            // Dispatch input and change events
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));

            // Optionally, blur and focus to trigger any additional event listeners
            field.blur();
            field.focus();
        }
    }

    function updateTitleFieldWithEndeavor(field, newEndeavorValue) {
        if (field) {
            // Remove any existing appended endeavor
            field.value = field.value.replace(/#e:[^#]*/, '').trim();
            if (newEndeavorValue !== 'None') {
                // Append the new selected endeavor at the end
                field.value += ` #e:${newEndeavorValue}`;
            }

            // Set the value property directly
            field.value = field.value;

            // Dispatch input and change events
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));

            // Optionally, blur and focus to trigger any additional event listeners
            field.blur();
            field.focus();
        }
    }

    function appendEndeavorSelect(editDialog) {
        const tablist = editDialog.querySelector('.UXzdrb');
        if (tablist) {
            console.log('tablist found: Edit event page');
            const siblingDiv = document.querySelector('button[aria-label="Save"]');
            const selectTagContainer = document.createElement('div');
            selectTagContainer.className = 'tag-select';
            if (siblingDiv) {
                siblingDiv.parentNode.insertBefore(selectTagContainer, siblingDiv.nextSibling);
            }

            const selectEndeavorContainer = document.createElement('div');
            selectEndeavorContainer.className = 'endeavor-select';
            if (siblingDiv) {
                siblingDiv.parentNode.insertBefore(selectEndeavorContainer, siblingDiv.nextSibling);
            }

            const eventEditTitle = editDialog.querySelector('input[aria-label="Title"]');
            const currentEndeavor = extractEndeavorFromTitle(eventEditTitle ? eventEditTitle.value : '');
            const currentTag = extractTagFromTitle(eventEditTitle ? eventEditTitle.value : '');

            // Render the Svelte component
            const selectEndeavor = new select({
                target: selectEndeavorContainer,
                props: {
                    selectedEndeavor: currentEndeavor // Pass the prop here
                }
            });

            const select_tag = new selectTag({
                target: selectTagContainer,
                props: {
                    selectedTag: currentTag // Pass the prop here
                }
            });

            // Add event listener for endeavor selection
            selectEndeavor.$on('change', (event) => {
                const selectedEndeavor = event.detail;
                const taskTitle = editDialog.querySelector('input[aria-label="Title"]');
                const eventTitle = editDialog.querySelector('input[aria-label="Add title"]');
                updateTitleFieldWithEndeavor(taskTitle, selectedEndeavor.name);
                updateTitleFieldWithEndeavor(eventTitle, selectedEndeavor.name);
                updateColorPicker(selectedEndeavor.color);
            });

            // Add event listener for tag selection
            select_tag.$on('change', (event) => {
                const selectedTag = event.detail;
                const taskTitle = editDialog.querySelector('input[aria-label="Title"]');
                const eventTitle = editDialog.querySelector('input[aria-label="Add title"]');
                updateTitleFieldWithTag(taskTitle, selectedTag.name);
                updateTitleFieldWithTag(eventTitle, selectedTag.name);
            });

            // Set the dropdowns based on the current title values when the component is mounted
            selectEndeavor.$on('mounted', (event) => {
                const { selectedEndeavor } = event.detail;
                selectEndeavor.$set({ selectedEndeavor }); // Manually set the dropdown value
            });

            select_tag.$on('mounted', (event) => {
                const taskTitle = editDialog.querySelector('input[aria-label="Title"]');
                const eventTitle = editDialog.querySelector('input[aria-label="Add title"]');
                const currentTag = extractTagFromTitle(taskTitle ? taskTitle.value : eventTitle.value);
                select_tag.$set({ selectedTag: currentTag }); // Set the dropdown value
            });
        } else {
            console.error('Tablist not found: Edit event page');
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