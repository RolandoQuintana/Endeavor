import { getTags, getEndeavors } from '../storage';
const day_event_selector = '.I0UMhf';

let debounceTimeout;

function debounce(func, wait) {
    return function(...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function processEvents(observer) {
    // Disconnect the observer to prevent infinite loop
    if (observer) observer.disconnect();

    const events = document.querySelectorAll(day_event_selector);

    events.forEach(event => {
        const titleElement = event; // The event itself is the title element
        if (titleElement) {
            let title = titleElement.textContent;

            // Extract endeavor and tag
            const endeavorMatch = title.match(/#e:([^#\s]*)/);
            const tagMatch = title.match(/#t:([^#\s]*)/);

            const endeavor = endeavorMatch ? endeavorMatch[1] : null;
            const tag = tagMatch ? tagMatch[1] : null;

            // Remove endeavor and tag from title
            title = title.replace(/#e:[^#\s]*/, '').replace(/#t:[^#\s]*/, '').trim();
            titleElement.textContent = title;

            // Only create chip container if there's an endeavor or tag
            if (tag) {
                // Check if the chip container already exists
                let chipContainer = titleElement.nextElementSibling;
                if (!chipContainer || !chipContainer.classList.contains('chip-container')) {
                    // Create a container for the chips
                    chipContainer = document.createElement('div');
                    chipContainer.className = 'chip-container';
                    chipContainer.style.display = 'fle';
                    chipContainer.style.gap = '4px'; // Adjust gap between chips
                    chipContainer.style.marginRight = '4px'; // Add margin to separate from title
                    titleElement.insertAdjacentElement('beforebegin', chipContainer);
                } else {
                    // Clear existing chips to avoid duplicates
                    chipContainer.innerHTML = '';
                }

                // Create visual elements for endeavor and tag
                // if (endeavor) {
                //     const endeavorElement = document.createElement('span');
                //     endeavorElement.className = 'endeavor-label';
                //     endeavorElement.textContent = endeavor;
                //     endeavorElement.style.borderRadius = '2px';
                //     endeavorElement.style.verticalAlign = 'middle';
                //     endeavorElement.style.fontSize = '90%';
                //     endeavorElement.style.padding = '2px 4px';
                //     endeavorElement.style.backgroundColor = '#e0e0e0'; // Example background color
                //     chipContainer.appendChild(endeavorElement);
                // }

                if (tag) {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag-label';
                    tagElement.textContent = tag;
                    tagElement.style.borderRadius = '5px';
                    tagElement.style.verticalAlign = 'bottom';
                    tagElement.style.fontSize = '90%';
                    tagElement.style.padding = '1px 4px';
                    tagElement.style.color = 'black';
                    tagElement.style.backgroundColor = 'white'; // Example background color
                    chipContainer.appendChild(tagElement);
                }
            }
        }
    });

    // Reconnect the observer
    if (observer) observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
    });
}

const observer = new MutationObserver(debounce((mutations) => {
    processEvents(observer);
}, 300)); // Adjust the debounce delay as needed

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false
});
// Initial processing in case events are already present
processEvents(observer);