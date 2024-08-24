import select from '../components/select.svelte';
import selectTag from '../components/selectTag.svelte';

function myMain() {
    console.log('createTask.js loaded');
    function checkForTaskDialog() {
        console.log('checkForTaskDialog');
        const taskDialog = document.querySelector('div[role="dialog"].ecHOgf');
        if (taskDialog && !taskDialog.querySelector('.endeavor-select')) {
            console.log('Task dialog found');
            appendEndeavorSelect(taskDialog);
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
                const titleElement = taskDialog.querySelector('input[aria-label="Add title and time"]');
                if (titleElement) {
                    // Remove any existing appended endeavor
                    titleElement.value = titleElement.value.replace(/#endeavor:[^#]*/, '').trim();
                    // Append the new selected endeavor at the end
                    titleElement.value += ` #e:${selectedEndeavor.name}`;
                    titleElement.setAttribute('value', titleElement.value);
                    titleElement.innerHTML = titleElement.value; // Update innerHTML
                    titleElement.blur(); // Remove focus
                    titleElement.focus(); // Refocus
                }
            });

            // Add event listener for tag selection
            select_tag.$on('change', (event) => {
                const selectedTag = event.detail;
                const titleElement = taskDialog.querySelector('input[aria-label="Add title and time"]');
                if (titleElement) {
                    // Remove any existing appended tag
                    titleElement.value = titleElement.value.replace(/#tag:[^#]*/, '').trim();
                    // Append the new selected tag at the end
                    titleElement.value += ` #t:${selectedTag.name}`;
                    titleElement.setAttribute('value', titleElement.value);
                    titleElement.innerHTML = titleElement.value; // Update innerHTML
                    titleElement.blur(); // Remove focus
                    titleElement.focus(); // Refocus
                }
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