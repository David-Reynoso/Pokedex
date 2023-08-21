// Fetch Pokemon names
const mainApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=250&offset=0';
fetch(mainApiUrl)
  .then(response => response.json())
  .then(pokemonNames => {
    let pokemonHTML = "";
    let totalPokemons = pokemonNames.count;
    // Fetch Pokemon Details through name
    for (let {name} of pokemonNames.results){
        const additionalApiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
        fetch(additionalApiUrl)
        .then(response => response.json())
        .then(pokemonDetails => {
          
          // Formatting of name, type, stats, ID, img, etc..
          name = pokemonDetails.name;
          let pokemonName = name[0].toUpperCase()+name.slice(1);

          type = pokemonDetails.types.map((type) => type.type.name[0].toUpperCase()+type.type.name.slice(1)).join(', ');

          stats = pokemonDetails.stats.map((stat) => stat.base_stat).join(', ');

          let pokemonHeight = pokemonDetails.height;
          let pokemonWeight = pokemonDetails.weight;

          let pokemonDescriptionURL = pokemonDetails.species.url;

          pokemonAbilities = pokemonDetails.abilities.map((ability) => ability.ability.name[0].toUpperCase()+ability.ability.name.slice(1)).join(', ');
    
          let numDigits = pokemonDetails.id.toString();
          var newID;
          slength = numDigits.length;
          if(slength == 1){
            newID = "00"+numDigits;
          }
          else if(slength == 2){
            newID = "0"+numDigits;
          }
          else{
            newID = numDigits;
          }
          
          let pokemonImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+newID+".png";

          // HTML for every loop
          pokemonHTML += `
                <div id="${newID}" class="pokemon-card" onclick="detailsTrigger('${newID}', '${pokemonName}', '${type}', '${pokemonImg}', '${stats}', '${pokemonHeight}', '${pokemonWeight}', '${pokemonAbilities}', '${pokemonDescriptionURL}')">
                    <div class="pokemon-card-id-container">
                        <p id="id-number" class="pokemon-id-number">${newID}</p>
                    </div>
                    <div class="pokemon-card-lower">
                        <div class="pokemon-card-img-container">
                            <img class="pokemon-img" src="${pokemonImg}" alt="Pokemon ${pokemonName}">
                        </div>
                        <div class="pokemon-basic-info">
                            <p style="display:none;"></p>
                            <p id="pokemon-name">${pokemonName}</p>
                            <p id="pokemon-type-title">Type</p>
                            <p id="pokemon-type">${type}</p>
                        </div>
                    </div>
                </div>
                  `
                  
            document.querySelector("#pokedex-table").innerHTML = pokemonHTML
            Promise.all([mainApiUrl, additionalApiUrl]);
        });
   
    }
    
        // LOAD MORE FUNCTION
        var cardDisplay = document.getElementsByClassName("pokemon-card");
        var loadBtn = document.querySelector("#load-more-btn");
        var initialLoad = 10;
        loadBtn.addEventListener('click', function(){
          for (var i = initialLoad; i<initialLoad+20; i++){
            if(cardDisplay[i]){
            cardDisplay[i].style.display = 'block';
            }
          }
          initialLoad += 20;
          if(initialLoad >= 250){
            loadBtn.style.display = 'none';
          }
        })

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
 
  // MODAL: Pokemon Details
  function detailsTrigger(pokemoncardID, pokemoncardName, pokemoncardType, pokemonImg, stats, pokemonHeight, pokemonWeight, pokemonAbilities, pokemonDescriptionURL) {
    var stat = stats.split(', ')

    // For getting pokemon's weakness
    var typeArray = pokemoncardType.split(', ');
    let weakness = [];
    for (var pokeType of typeArray) {
      
      if (pokeType == "Normal"){
        weakness += "Rock, Ghost, Steel, ";
      }
      else if (pokeType == "Fighting"){
        weakness += "Flying, Poison, Psychic, Bug, Ghost, Fairy, ";
      }
      else if (pokeType == "Flying"){
        weakness += "Rock, Steel, Electric, ";
      }
      else if (pokeType == "Poison"){
        weakness += "Poison, Ground, Rock, Ghost, Steel, "; 
      }
      else if (pokeType == "Ground"){
        weakness += "Flying, Bug, Grass, ";
      }
      else if (pokeType == "Rock"){
        weakness += "Fighting, Ground, Steel, ";
      }
      else if (pokeType == "Bug"){
        weakness += "Fighting, Flying, Poison, Ghost, Steel, Fire, Fairy, ";
      }
      else if (pokeType == "Ghost"){
        weakness += "Normal, Dark, ";
      }
      else if (pokeType == "Steel"){
        weakness += "Steel, Fire, Water, Electric, ";
      }
      else if (pokeType == "Fire"){
        weakness += "Rock, Fire, Water, Dragon, ";
      }
      else if (pokeType == "Water"){
        weakness += "Water, Grass, Dragon, ";
      }
      else if (pokeType == "Grass"){
        weakness += "Flying, Poison, Bug, Steel, Fire, Grass, Dragon, ";
      }
      else if (pokeType == "Electric"){
        weakness += "Ground, Grass, Electric, Dragon, ";
      }
      else if (pokeType == "Psychic"){
        weakness += "Steel, Psychic, Dark, ";
      }
      else if (pokeType == "Ice"){
        weakness += "Steel, Fire, Water, Ice, ";
      }
      else if (pokeType == "Dragon"){
        weakness += "Steel, Fairy, ";
      }
      else if (pokeType == "Fairy"){
        weakness += "Poison, Steel, Fire, ";
      }
      else if (pokeType == "Fairy"){
        weakness += "Fighting, Dark, Fairy, ";
      }
      else{
        weakness +="";
      }
    }
    // For checking if there's a duplicated value inside the weakness array
    var pokemonWeakness = weakness.split(', ')
    function removeDuplicatesFromArray(array) {
      const seen = {};
      const uniqueArray = [];
  
      for (const value of array) {
          if (!seen[value]) {
              seen[value] = true;
              uniqueArray.push(value);
          }
      }
  
      return uniqueArray;
  }
  const uniqueWeaknesses = removeDuplicatesFromArray(pokemonWeakness).join(', ').slice(0, -2);

    // For fetching other pokemon details (Description, Category)
    fetch(pokemonDescriptionURL)
    .then(descriptionResponse => descriptionResponse.json())
    .then(pokemonDescriptions => {

      let pokemonDescription = pokemonDescriptions.flavor_text_entries['9'].flavor_text;
      let pokemonCategory = pokemonDescriptions.genera['7'].genus;
    
    // Pokemon Details (Modal)
    Swal.fire({
      width: "1000",
      title: pokemoncardName + "<h5 style='color: #b3b3b3;'> #"+pokemoncardID+"</h5>",
      html:
      `
      <div class='modalContainer'>
        <div class='leftPanel'>
          <div class='leftPanel-img-container'>
            <img class='leftPanel-img' src="`+pokemonImg+`" alt="`+pokemoncardName+`">
          </div>
          <div class='leftPanel-lowerpart'>
            <p class="pokemonStats-title">- Stats -</p>
            <div class="statsContainer">
              <div class="statsContainer-left">
                <p class="pokemon-stat"><span style="color:#bfbfbf;">HP:</span>&nbsp;`+stat[0]+`</p>
                <p class="pokemon-stat"><span style="color:#bfbfbf;">Attack:</span>&nbsp;`+stat[1]+`</p>
                <p class="pokemon-stat"><span style="color:#bfbfbf;">Defense:</span>&nbsp;`+stat[2]+`</p>
              </div>
              <div class="statsContainer-right">
                <p class="pokemon-stat sp"><span title="Special Attack" style="color:#bfbfbf;">S Attack: </span>&nbsp; `+stat[3]+`</p>
                <p class="pokemon-stat sp"><span title="Special Defense" style="color:#bfbfbf;">S Defense: </span>&nbsp; `+stat[4]+`</p>
                <p class="pokemon-stat sp"><span style="color:#bfbfbf;">Speed:</span>&nbsp;`+stat[5]+`</p>
              </div>
            </div>
          </div>
        </div>
        <div class='rightPanel'>
          <div class='rightPanel-upper'>
            <p class='pokemon-description'>`+pokemonDescription+`</p>
          </div>
          <div class='rightPanel-middle'>
            <div class='height-weight-section'>
              <p class='pokemonHeight phw'>Height: <span style="font-weight: bolder; color: black;">`+pokemonHeight+`</span></p>
              <p class='pokemonWeight phw'>Weight: <span style="font-weight: bolder; color: black;">`+pokemonWeight+`</span></p>
            </div>
            <div class='species-section'>
              <p class='pokemonSpecies' >Category: </p>
              <p class='pokemonSpecies' style="font-weight: bolder; color: black;">`+pokemonCategory+`</p>
            </div>
            <div class='abilities-section'>
              <p class='pokemonAbilities' >Abilities</p>
              <p class='pokemonAbilities' style="margin-top: -10px;font-weight: bolder; color: black;">`+pokemonAbilities+`</p>
            </div>
          </div>
          <div class='rightPanel-lower'>
            <div class='pokemon-type'>
              <p id='pokemon-type-title' style="background-color: green !important; color: white !important; margin-top: 10px;">Type</p>
              <p class='pokemonType awd' style="font-weight: bold;">`+pokemoncardType+`</p>
            </div>
            <div class='pokemon-weakness'>
              <p id='pokemon-type-title' style="margin-top:-10px; background-color: rgba(199, 5, 5, 0.8) !important; color: white !important; font-size: 16px">Weak Against</p>
              <p class='pokemonWeak' style="font-size: 14px; color: white; margin-top:5px;">`+uniqueWeaknesses+`</p>
            </div>
          </div>
        </div>
      </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      }).then((result) => {
      })
    })
}

// Search Function
document.getElementById("searchInput").addEventListener("input", function() {
const searchValue = this.value.toLowerCase();
const divs = document.getElementsByClassName("pokemon-card");

if (searchValue === "") {
  location.reload(); // Reload the page if the search box is cleared
} 
else {
  Array.from(divs).forEach(function(div) {
    const pokemonId = div.querySelector("p:nth-child(1)"); // Get the first <p> element (Pokemon ID)
    const pokemonName = div.querySelector("p:nth-child(2)"); // Get the second <p> element (Pokemon Name)
    const loadBtn = document.getElementById("load-more-btn");
  
    if (pokemonName || pokemonId) {
        const nameText = pokemonName.textContent.toLowerCase(); // Get the text content of the <p> element in lowercase
        const idText = pokemonId.textContent.toLowerCase();

        if (nameText.includes(searchValue) || idText.includes(searchValue)) {
            div.style.display = "block"; // Show the div if the search matches
            loadBtn.style.display = "none";

        } else {
            div.style.display = "none"; // Hide the div if the search doesn't match
            loadBtn.style.display = "none";
        }
    }
  });
}
});

// For sorting pokemon cards by ID or Name
document.getElementById("sortSelect").addEventListener("change", function() {
  const sortBy = this.value; // Get the selected value

  const divContainer = document.getElementById("pokedex-table"); // Container div for Pokemon Cards
  const divs = Array.from(divContainer.getElementsByClassName("pokemon-card")); // Get all divs (Pokemon Cards)
 
  // Ascending order of ID sort
  if (sortBy == "id"){
    divs.sort(function(a, b) {
        const aValue = a.querySelector(`p:nth-child(1)`).textContent.toLowerCase();
        const bValue = b.querySelector(`p:nth-child(1)`).textContent.toLowerCase();
        
        return aValue.localeCompare(bValue);
    });
  }
  // Descending order of ID sort
  else if(sortBy == "id rev"){
    divs.sort(function(b, a) {
      const aValue = a.querySelector(`p:nth-child(1)`).textContent.toLowerCase();
      const bValue = b.querySelector(`p:nth-child(1)`).textContent.toLowerCase();
      
      return aValue.localeCompare(bValue);
    });
  }
  // Ascending order of Name sort
  else if(sortBy == "name"){
    divs.sort(function(a, b) {
      const aValue = a.querySelector(`p:nth-child(2)`).textContent.toLowerCase();
      const bValue = b.querySelector(`p:nth-child(2)`).textContent.toLowerCase();
      
      return aValue.localeCompare(bValue);
    });
  }
  // Descending order of Name sort
  else if(sortBy == "name rev"){
    divs.sort(function(b, a) {
      const aValue = a.querySelector(`p:nth-child(2)`).textContent.toLowerCase();
      const bValue = b.querySelector(`p:nth-child(2)`).textContent.toLowerCase();
      
      return aValue.localeCompare(bValue);
    });
  }
  
  divs.forEach(function(div) {
      divContainer.appendChild(div); // Re-append the sorted divs to the container
  });
});
