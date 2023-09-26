const { ipcRenderer } = require('electron');

async function fetchData() {
  const url = 'http://localhost:8088/api/news';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function displayData(data) {
    const newsContainer = document.getElementById('news-container');
  
    // Efface le contenu précédent du conteneur
    newsContainer.innerHTML = '';
  
    // Boucle à travers les données et affiche le champ 'text' de chaque objet
    data.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('tweet-style');  // Ajouter une classe pour le style tweet
      newsItem.textContent = item.text; // Affiche le champ 'text'
      newsContainer.appendChild(newsItem);
    });
  }
  
  

// Fetch data when the window has loaded
window.onload = fetchData;
