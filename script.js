let currentJoke = '';
let selectedCategory = '';
let isLoading = false;

const jokeBtn = document.getElementById('jokeBtn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const categorySelect = document.getElementById('categorySelect');

async function getJoke() {
    if (isLoading) return;

    isLoading = true;
    jokeBtn.disabled = true;
    loader.classList.add('active');
    errorMessage.classList.remove('show');

    try {
        let url = 'https://v2.jokeapi.dev/joke/';

        if (selectedCategory) {
            url += selectedCategory;
        } else {
            // Random category
            const categories = ['General', 'Programming', 'Knock-knock'];
            url += categories[Math.floor(Math.random() * categories.length)];
        }

        // Add parameters to filter out adult jokes
        url += '?safe-mode';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const data = await response.json();

        // Check if the API returned an error
        if (data.error) {
            throw new Error('No jokes available for this category');
        }

        // Handle both single and two-part jokes
        if (data.type === 'single') {
            currentJoke = data.joke;
        } else if (data.type === 'twopart') {
            currentJoke = `${data.setup}\n\n${data.delivery}`;
        }

        displayJoke(currentJoke);
    } catch (error) {
        showError('Error fetching joke: ' + error.message);
        console.error('Error:', error);
    } finally {
        isLoading = false;
        jokeBtn.disabled = false;
        loader.classList.remove('active');
    }
}

function displayJoke(joke) {
    const jokeElement = document.getElementById('joke');
    jokeElement.textContent = joke;
}

function shareJoke() {
    if (!currentJoke) {
        showError('No joke to copy! Get a joke first.');
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(currentJoke).then(() => {
        showSuccess('Joke copied to clipboard! 📋');
    }).catch(() => {
        showError('Failed to copy to clipboard');
    });
}

function changeCategory() {
    selectedCategory = categorySelect.value;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');

    // Auto-hide error after 4 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 4000);
}

function showSuccess(message) {
    // Create a success message element
    let successMessage = document.getElementById('successMessage');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.id = 'successMessage';
        successMessage.className = 'copy-success';
        document.querySelector('.joke-generator').appendChild(successMessage);
    }

    successMessage.textContent = message;
    successMessage.classList.add('show');

    // Auto-hide success after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Load a joke on page load
document.addEventListener('DOMContentLoaded', () => {
    getJoke();
});
