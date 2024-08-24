import Options from "../components/Options.svelte";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
    const openAppButton = document.getElementById("openApp");
    if (openAppButton) {

        openAppButton.addEventListener('click', () => {
            chrome.tabs.create({ url: "src/background/app.html" });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
