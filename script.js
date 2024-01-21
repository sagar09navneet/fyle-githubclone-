document.addEventListener('DOMContentLoaded', function () {
    const username = 'vardhan-rawat'; // replace with the GitHub username you want to fetch repositories for
    const repoContainer = document.querySelector('.repositories');
    const searchInput = document.querySelector('.search-bar');
    const searchBtn = document.querySelector('.search-btn');
    const loader = document.querySelector('.loader');

   
    function showLoader() {
    
    document.body.insertAdjacentHTML('beforeend', '<div class="overlay"><div class="loader"></div></div>');
    setTimeout(hideLoader, 3000); 
}


    function hideLoader() {
    
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }
    }


    // Function to fetch GitHub repositories
    async function fetchRepositories(username) {
        try {
            showLoader();

            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const data = await response.json();

            repoContainer.innerHTML = '';

            for (const repo of data) {
                const repoItem = document.createElement('div');
                repoItem.className = 'repo-item';

                const repoTitle = document.createElement('h3');
                repoTitle.textContent = repo.name;

                const repoDescription = document.createElement('p');
                repoDescription.textContent = repo.description || 'No description available.';

                const topicsContainer = document.createElement('div');
                topicsContainer.className = 'topics';

                // Fetch languages/technologies used in the repository
                const languagesResponse = await fetch(repo.languages_url);
                const languagesData = await languagesResponse.json();
                const languages = Object.keys(languagesData);

                // Loop through the repository languages and create language links
                languages.forEach(language => {
                    const languageLink = document.createElement('a');
                    languageLink.href = '#';
                    languageLink.className = 'topic-box';
                    languageLink.textContent = language;
                    topicsContainer.appendChild(languageLink);
                });

                repoItem.appendChild(repoTitle);
                repoItem.appendChild(repoDescription);
                repoItem.appendChild(topicsContainer);

                repoContainer.appendChild(repoItem);
            }

            hideLoader();
        } catch (error) {
            console.error('Error fetching repositories:', error);
            hideLoader();
        }
    }

    // Search button click event
    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const repoItems = document.querySelectorAll('.repo-item');

        repoItems.forEach(repoItem => {
            const repoTitle = repoItem.querySelector('h3').textContent.toLowerCase();
            const repoDescription = repoItem.querySelector('p').textContent.toLowerCase();

            if (repoTitle.includes(searchTerm) || repoDescription.includes(searchTerm)) {
                repoItem.style.display = 'block';
            } else {
                repoItem.style.display = 'none';
            }
        });
    });

    // Initial fetch on page load
    fetchRepositories(username);
});
