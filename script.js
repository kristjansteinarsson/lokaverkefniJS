// Tengja JSON
async function get(jsons){
    try{
        let con = await fetch(jsons);
        return await con.json();
    } catch (error){
        console.log("Error:", error);
    }
}

// Setja upp allt frá JSON
function displayGames(data){
    data.forEach(game =>{

        let gameCard = document.createElement("div");
        gameCard.classList.add("gameCard");

        let gameTitle = document.createElement("h2");
        gameTitle.classList.add("gameTitle");
        gameTitle.textContent = game.Game;

        let gameTitleCard = document.createElement("p");
        gameTitleCard.classList.add("gameTitleCard");
        gameTitleCard.textContent = game.Game;
    
        let gameImage = document.createElement("img");
        gameImage.classList.add("gameImage");
        gameImage.id = 'gameImage';
        gameImage.src = game.Photo;
        gameImage.alt = game.Game;

        let gameImageCard = document.createElement("img");
        gameImageCard.classList.add("gameImageCard");
        gameImageCard.id = 'gameImageCard';
        gameImageCard.src = game.Photo;
        gameImageCard.alt = game.Game;

        let gameInfo = document.createElement("p");
        gameInfo.classList.add("gameInfo");
        gameInfo.textContent = game.Info;

        let gamePrice = document.createElement("p");
        gamePrice.classList.add("gamePrice");
        gamePrice.textContent = "Price: " + game.Price;

        let gamePriceCard = document.createElement("p");
        gamePriceCard.classList.add("gamePriceCard");
        gamePriceCard.textContent = "Price: " + game.Price;

        let gameRelease = document.createElement("p");
        gameRelease.classList.add("gameRelease");
        gameRelease.textContent = "Release Date: " + game.Release;

        let gameReleaseCard = document.createElement("p");
        gameReleaseCard.classList.add("gameReleaseCard");
        gameReleaseCard.textContent = "Release Date: " + game.Release;


        let gameLocationCountry = document.createElement("p");
        gameLocationCountry.classList.add("gameLocationCountry");

        let releasedText = document.createTextNode("Released:");
        gameLocationCountry.appendChild(releasedText);

        let lineBreakCountry = document.createElement("br");
        gameLocationCountry.appendChild(lineBreakCountry);

        let countriesText;
        if (Array.isArray(game.Location.countries)){
            countriesText = document.createTextNode(game.Location.countries.join(", "));
        } else{
            countriesText = document.createTextNode(game.Location.countries);
        }

        gameLocationCountry.appendChild(countriesText);

        let gameLocation = document.createElement("p");
        gameLocation.classList.add("gameLocation");

        let locationText = document.createTextNode("Location:");
        gameLocation.appendChild(locationText);

        let lineBreak = document.createElement("br");
        gameLocation.appendChild(lineBreak);

        let coordinatesText = document.createTextNode(`${game.Location.latitude}, ${game.Location.longitude}`);
        gameLocation.appendChild(coordinatesText);

        gameCard.appendChild(gameImage);
        gameCard.appendChild(gameTitleCard);
        gameCard.appendChild(gamePriceCard);
        gameCard.appendChild(gameReleaseCard);
        

        // gameImageCardText.appendChild(gameTitle);
        // gameImageCardText.appendChild(gamePrice);
        // gameImageCardText.appendChild(gameRelease);
        
        // gameCard.appendChild(gameImageCardText);

        gameCard.addEventListener('click', (event) =>{
            event.stopPropagation();
            console.log("Clicked on", game.Game);

            disableHeader();
            
            document.getElementById('overlay').style.display = 'flex';
            
            let gameDetailsOverlay = document.getElementById('gameDetailsOverlay');
            gameDetailsOverlay.innerHTML = '';
            
            let closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.classList.add('closeButton');
            closeButton.addEventListener('click', () =>{
                document.getElementById('overlay').style.display = 'none';
                enableHeader();
            });
            
            document.addEventListener('keydown', (event) =>{
                if (event.key === 'Escape'){
                    document.getElementById('overlay').style.display = 'none';
                    enableHeader();
                }
            });           
        
            gameDetailsOverlay.appendChild(closeButton);

            function disableHeader(){
                document.querySelector('header').style.pointerEvents = 'none';
                document.querySelector('header').style.filter = 'blur(5px)';
                document.body.style.overflow = 'hidden';
            }
            
            function enableHeader(){
                document.querySelector('header').style.pointerEvents = 'auto';
                document.querySelector('header').style.filter = 'blur(0px)';
                document.body.style.overflow = 'auto';
            }
            
            let gameImageAndText = document.createElement('div');
            gameImageAndText.classList.add('gameImageAndText');
            
            gameImageAndText.appendChild(gameImageCard);

            let gameTitleInfo = document.createElement('div');
            gameTitleInfo.classList.add('gameTitleInfo');

            gameTitleInfo.appendChild(gameTitle);
            gameTitleInfo.appendChild(gameInfo);

            gameImageAndText.appendChild(gameTitleInfo);

            let mapContainer = document.createElement('div');
            mapContainer.setAttribute('id', 'map');
            mapContainer.classList.add("gameMap");
            mapContainer.style.height = '250px';
            
            gameImageAndText.appendChild(mapContainer);

            let gameDetails = document.createElement('div');
            gameDetails.classList.add('gameDetails');

            gameDetails.appendChild(gamePrice);
            gameDetails.appendChild(gameRelease);

            let gameDetailsCountries = document.createElement('div');
            gameDetailsCountries.classList.add('gameCountryDetails')

            gameDetailsCountries.appendChild(gameLocationCountry);
            // gameDetailsCountries.appendChild(gameLocation);
            
            gameDetailsOverlay.appendChild(gameImageAndText);
            
            let hr = document.createElement('hr');
            gameDetailsOverlay.appendChild(hr);

            gameDetailsOverlay.appendChild(gameDetails);
            gameDetailsOverlay.appendChild(gameDetailsCountries);

            

            var map = L.map('map').setView([parseFloat(game.Location.longitude), parseFloat(game.Location.latitude)], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add a marker to the map
            var marker = L.marker([game.Location.latitude, game.Location.longitude]).addTo(map);
            marker.bindPopup("Nintendo Co., Ltd.").openPopup();
        });

        document.getElementById("gamesContainer").appendChild(gameCard);
    });
}

// Kort


// Dagatal
document.addEventListener("DOMContentLoaded", async function(){
    const gameData = await get("vidburdir.json");

    flatpickr("#dateRangePicker",{
        mode: "range",
        dateFormat: "d-m-Y",
        onClose: function(selectedDates){
            const startDate = selectedDates[0];
            const endDate = selectedDates[1];
            filterGames(gameData, startDate, endDate);
        }
    });

    displayGames(gameData);
});

function filterGames(data, startDate, endDate){
    const filteredData = data.filter(game =>{
        const releaseDate = new Date(game.Release.split('/').reverse().join('-'));
        return !startDate || !endDate || (releaseDate >= startDate && releaseDate <= endDate);
    });
    document.getElementById("gamesContainer").innerHTML = "";
    displayGames(filteredData);
}

// Price Slider

// Search Bar
document.getElementById("searchBar").addEventListener("input", async function(){

    const searchGame = this.value.toLowerCase();

    const gameData = await get("vidburdir.json");
    filterGamesBySearch(gameData, searchGame);
});

function filterGamesBySearch(data, searchGame){
    const filteredData = data.filter(game =>{
        console.log("Checking:", game.Game.toLowerCase(), "for", searchGame);
        return game.Game.toLowerCase().includes(searchGame);
    });

    document.getElementById("gamesContainer").innerHTML = "";
    displayGames(filteredData);
}