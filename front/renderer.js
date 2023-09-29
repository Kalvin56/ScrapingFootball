const { ipcRenderer } = require('electron');
const { exec } = require('child_process');
const btn = document.getElementById('btn-custom');

const execCommand = () => {
  exec('scrapnews',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
}


const onClickScript = () => {
  execCommand()
  btn.disabled = true;
  setInterval(function(){fetchData()},45000);
}

async function fetchData() {
  btn.disabled = false;
  const url = process.env.API_URL+'/news';

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

    data.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
  
      const img = document.createElement('img');
      img.src = "data:image/png;base64,"+item.image; // Remplacez par le champ correspondant de votre objet
  
      const text = document.createElement('p');
      text.textContent = item.text; // Remplacez par le champ correspondant de votre objet
  
      itemDiv.appendChild(img);
      itemDiv.appendChild(text);
  
      newsContainer.appendChild(itemDiv);
    });
  }
  
  

// Fetch data when the window has loaded
window.onload = fetchData;
