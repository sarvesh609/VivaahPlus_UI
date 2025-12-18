// our-story/story-script.js

document.addEventListener('DOMContentLoaded', () => {
    const storyModal = document.getElementById('storyModal');
    const storyModalDialog = document.getElementById('storyModalDialog');
    
    let isContentLoaded = false;

    // 1. Function to Load Content from story.html
    const loadStoryContent = async () => {
        try {
            const response = await fetch('story.html');
            if (!response.ok) {
                throw new Error('Failed to load story content.');
            }
            const htmlContent = await response.text();
            
            // Insert the fetched content into the dialog container
            storyModalDialog.innerHTML = htmlContent;
            isContentLoaded = true;
            
        } catch (error) {
            console.error("Error loading 'Our Story' modal:", error);
            storyModalDialog.innerHTML = '<div class="alert alert-danger">Could not load Our Story. Please try again.</div>';
        }
    };
    
    // 2. Event Listener to trigger content loading ONLY when the modal is first opened
    if (storyModal) {
        storyModal.addEventListener('show.bs.modal', () => {
            if (!isContentLoaded) {
                loadStoryContent();
            }
        });
    }
});