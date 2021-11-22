window.addEventListener('DOMContentLoaded', init);

async function init() {
    // Create Recipes (took some code from Lab 5)
    const recipes = [];
    var dataBank;

    async function fetchRecipes() {
        return new Promise((resolve, reject) => {  
            let json = (window.location['pathname'] == "/views/explorePage.html") ? "../assets/dataDel.json" : "../assets/data.json";
            fetch(json)
                .then(response => response.json())
                .then(data => {
                    let ind = 0;
                    for(let recipe in data) {
                        recipes[ind] = data[recipe];
                        ind++;
                    }
                    console.log(data);
                    resolve(true);
                })
                .catch(error => reject(false));
        });
    }

    let fetchSuccessful = await fetchRecipes();

    if (!fetchSuccessful) {
        console.log('Recipe fetch unsuccessful');
        return;
    };

    const recipeGrid = document.querySelector('.recipe-grid');
    const recipeElements = document.querySelectorAll('.recipe');
    const recipeWH = '170vw';
    var pointer = 0;

    fillGrid();

    function fillGrid() {
        // Remove current recipes on display
        for(let i = 0; i < recipeElements.length; i++) {
            if(recipeElements[i].children.length > 0) {
                if(recipeElements[i].children[0].tagName == 'IMG') {
                    recipeElements[i].removeChild(recipeElements[i].children[0]);
                    recipeElements[i].textContent = "\r\n<EMPTY>"
                }
            }
        }

        // Add new recipes to display
        let capacity = pointer;

        for(let i = capacity % recipeElements.length; i < recipeElements.length; i++) {
            if(pointer >= recipes.length) break;
            
            // Create recipe element
            const recipe = document.createElement('img');
            recipe.setAttribute('src', recipes[pointer]);
            recipe.setAttribute('width', recipeWH);
            recipe.setAttribute('height', recipeWH);
            // recipe.style.position = "absolute";
            // recipe.style.marginTop = "-7em";
            // recipe.style.marginLeft = "-5em";


            // recipe.style.xIndex = "200px"


            // Add given recipe
            recipeElements[i].textContent = '\r\n' +  recipes[pointer].slice(32, recipes[pointer].length - 4) + '\r\n\n';
            //recipeElements[i].textContent = '\r\n' + recipes[pointer].substr(32, recipes[pointer].substr(22).length - 4).replace('-', ' ')+'\r\n\n';
            recipeElements[i].appendChild(recipe);

            // Update pointer
            pointer++;
        }

        pointer = capacity + recipeElements.length;
        console.log(pointer);
    }

    const rightButton = document.getElementById('right');
    rightButton.addEventListener('click', e => {
        if (pointer < recipes.length) fillGrid();
    });

    const leftButton = document.getElementById('left');
    leftButton.addEventListener('click', e => {
        if(pointer > recipeElements.length) {
            pointer -= recipeElements.length * 2;
            fillGrid();
        }
    });
}

const createButton = document.getElementById('createButton');
    createButton.addEventListener('click', function() {
        window.location = 'createRecipe.html';
})