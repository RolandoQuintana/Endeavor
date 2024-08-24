import select from '../components/select.svelte';

console.log('Content script loaded');

// Main function to initialize the event listener for the Save button
function myMain(evt) {
    let selectedEndeavor = '';
    let selectedColor = '';

    // Function to extract the current endeavor from the description
    function getCurrentEndeavor() {
        const descriptionField = document.querySelector('div[aria-label="Description"]');
        if (descriptionField) {
            const match = descriptionField.innerHTML.match(/#endeavor:([^<]*)/);
            return match ? match[1] : 'None';
        }
        return 'None';
    }

    // Function to check for the div element with class "UXzdrb"
    function checkForDiv() {
        const parentDiv = document.querySelector('.UXzdrb');
        if (parentDiv && !parentDiv.querySelector('select')) {
            console.log('UXzdrb div found');
            // If the div element is found, create a container for the Svelte component
            const container = document.createElement('div');

            // Find the sibling div element that comes before the div with class "UXzdrb"
            const siblingDiv = document.querySelector('button[aria-label="Save"]');

            if (siblingDiv) {
                // Insert the container after the sibling div
                siblingDiv.parentNode.insertBefore(container, siblingDiv.nextSibling);

                // Render the Svelte component into the container
                const endeavorSelect = new select({
                    target: container,
                    props: {
                        selectedEndeavor: getCurrentEndeavor()
                    }
                });

                // Listen for the 'mounted' event to set the default selected value
                endeavorSelect.$on('mounted', (event) => {
                    selectedEndeavor = event.detail;
                    console.log('Default selected endeavor:', selectedEndeavor);
                });

                // Listen for the 'change' event to update the selected value and event description
                endeavorSelect.$on('change', (event) => {
                    selectedEndeavor = event.detail.name;
                    selectedColor = event.detail.color;
                    console.log('Selected endeavor changed to:', selectedEndeavor);
                    console.log('Selected color changed to:', selectedColor);

                    // Update the description field in the form
                    const descriptionField = document.querySelector('div[aria-label="Description"]');
                    if (descriptionField) {
                        const currentDescription = descriptionField.innerHTML;
                        const newDescription = currentDescription.match(/#endeavor:/)
                            ? currentDescription.replace(/#endeavor:[^<]*/, `#endeavor:${selectedEndeavor}`)
                            : `<div>#endeavor:${selectedEndeavor}</div>${currentDescription}`;
                        descriptionField.innerHTML = newDescription;
                        console.log('Updated event description with endeavor:', selectedEndeavor);
                    }

                    // Update the color field in the form
                    updateColorPicker(selectedColor);
                });
            }
        }
    }

    // Function to update the color picker
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

    // Function to check for the Save button and add the event listener
    function checkForSaveButton() {
        const saveButton = document.querySelector('button[aria-label="Save"]');
        if (saveButton && !saveButton.hasAttribute('data-listener-added')) {
            console.log('Save button found');
            // If the Save button is found, add the event listener
            saveButton.addEventListener('click', () => {
                // Wait for a short time to allow the event details to be populated
                setTimeout(() => {
                    // Log the selected endeavor
                    console.log('Selected endeavor on save:', selectedEndeavor);
                    chrome.runtime.sendMessage({ action: 'storeEventDetails', endeavor: selectedEndeavor, color: selectedColor });
                }, 1000); // Adjust the timeout as necessary
            });

            // Mark the button to indicate that the listener has been added
            saveButton.setAttribute('data-listener-added', 'true');
        }
    }

    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                checkForDiv();
                checkForSaveButton();
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial checks in case the div and button are already present
    checkForDiv();
    checkForSaveButton();
}

// Set up the listener for the window load event
window.addEventListener("load", myMain, false);