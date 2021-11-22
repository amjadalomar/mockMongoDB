window.addEventListener('DOMContentLoaded', init);

function init() {
    const recipes = [
        '../assets/images/sample-recipes/burger.jpg',
        '../assets/images/sample-recipes/french-toast.jpg',
        '../assets/images/sample-recipes/fried-ice-cream.jpg',
        '../assets/images/sample-recipes/fries.jpg',
        '../assets/images/sample-recipes/hot-coacoa.jpg',
        '../assets/images/sample-recipes/mochi.jpg',
        '../assets/images/sample-recipes/pizza.jpg',
        '../assets/images/sample-recipes/quesa.jpg',
        '../assets/images/sample-recipes/ravioli.jpg',
        '../assets/images/sample-recipes/sushi.jpg',
        '../assets/images/sample-recipes/sweet-rice.jpg',
        '../assets/images/sample-recipes/Ice-Cream-Sundae.jpg'
    ]
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
    createButton.addEventListener('click', function () {
        window.location('createRecipe.html');
})