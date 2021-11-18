// view page:
// image, title, author, cooking time, servings, ingredients, instructions, tags,
// ***user specific: user created tags, favorited? (boolean), author

module.exports = { createRecipeObject };

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

function createRecipeObject(data)
{
    const title = getTitle(data);
    const cookingTime = searchForKey(data, 'totalTime');
    const servingsYield = getYield(data);
    const ingredientsArr = searchForKey(data, 'recipeIngredient');
    const ingredientsList = createIngredientList(ingredientsArr);
    const instructions = getInstructions(data);
    const image = getImage(data);

    let recipeObject = 
    {
        title: title,
        cookingTime: cookingTime,
        servings: servingsYield,
        ingredients: ingredientsList,
        instructions: instructions,
        image: image,
        //author: tbd,
        //anything else
    }

    addToDB( recipeObject );

}

<<<<<<< HEAD
//TODO: make this work after the fetch happens
function addToDB (recipe)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("MockDB");
    // var myobj = [
    //   { name: 'John', address: 'Highway 71'},
    //   { name: 'Peter', address: 'Lowstreet 4'},
    //   { name: 'Amy', address: 'Apple st 652'},
    //   { name: 'Hannah', address: 'Mountain 21'},
    //   { name: 'Michael', address: 'Valley 345'},
    //   { name: 'Sandy', address: 'Ocean blvd 2'},
    //   { name: 'Betty', address: 'Green Grass 1'},
    //   { name: 'Richard', address: 'Sky st 331'},
    //   { name: 'Susan', address: 'One way 98'},
    //   { name: 'Vicky', address: 'Yellow Garden 2'},
    //   { name: 'Ben', address: 'Park Lane 38'},
    //   { name: 'William', address: 'Central st 954'},
    //   { name: 'Chuck', address: 'Main Road 989'},
    //   { name: 'Viola', address: 'Sideway 1633'}
    // ];
    dbo.collection("recipes").insertOne(recipe, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

=======
>>>>>>> ec9d89285a97de878ec7701c1fdcedc560c13d7d
/**
 * Recursively search for a key nested somewhere inside an object
 * @param {Object} object the object with which you'd like to search
 * @param {String} key the key that you are looking for in the object
 * @returns {*} the value of the found key
 */
 function searchForKey(object, key) {
    var value;
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = searchForKey(object[k], key);
        return value !== undefined;
      }
    });
    return value;
  }
  
  /**
   * Extract the title of the recipe from the given recipe schema JSON obejct
   * @param {Object} data Raw recipe JSON to find the image of
   * @returns {String} If found, returns the recipe title
   */
  function getTitle(data) {
    if (data.name) return data.name;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Recipe') {
          if (data['@graph'][i]['name']) return data['@graph'][i]['name'];
        };
      }
    }
    return null;
  }
  
  /**
   * Extract a usable image from the given recipe schema JSON object
   * @param {Object} data Raw recipe JSON to find the image of
   * @returns {String} If found, returns the URL of the image as a string, otherwise null
   */
  function getImage(data) {
    if (data.image?.url) return data.image.url;
    if (data.image?.contentUrl) return data.image.contentUrl;
    if (data.image?.thumbnail) return data.image.thumbnail;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'ImageObject') {
          if (data['@graph'][i]['url']) return data['@graph'][i]['url'];
          if (data['@graph'][i]['contentUrl']) return data['@graph'][i]['contentUrl'];
          if (data['@graph'][i]['thumbnailUrl']) return data['@graph'][i]['thumbnailUrl'];
        };
      }
    }
    return null;
  }
  
  /**
   * Extract the URL from the given recipe schema JSON object
   * @param {Object} data Raw recipe JSON to find the URL of
   * @returns {String} If found, it returns the URL as a string, otherwise null
   */
  function getUrl(data) {
    if (data.url) return data.url;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Recipe') return data['@graph'][i]['@id'];
      }
    };
    return null;
  }
  
  /**
   * Similar to getUrl(), this function extracts the organizations name from the
   * schema JSON object. It's not in a standard location so this function helps.
   * @param {Object} data Raw recipe JSON to find the org string of
   * @returns {String} If found, it retuns the name of the org as a string, otherwise null
   */
  function getOrganization(data) {
    if (data.publisher?.name) return data.publisher?.name;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'WebSite') {
          return data['@graph'][i].name;
        }
      }
    };
    return null;
  }
  
  /**
   * Converts ISO 8061 time strings to regular english time strings.
   * Not perfect but it works for this lab
   * @param {String} time time string to format
   * @return {String} formatted time string
   */
  function convertTime(time) {
    let timeStr = '';
  
    // Remove the 'PT'
    time = time.slice(2);
  
    let timeArr = time.split('');
    if (time.includes('H')) {
      for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i] == 'H') return `${timeStr} hr`;
        timeStr += timeArr[i];
      }
    } else {
      for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i] == 'M') return `${timeStr} min`;
        timeStr += timeArr[i];
      }
    }
  
    return '';
  }
  
  /**
   * Takes in a list of ingredients raw from imported data and returns a neatly
   * formatted comma separated list.
   * @param {Array} ingredientArr The raw unprocessed array of ingredients from the
   *                              imported data
   * @return {String} the string comma separate list of ingredients from the array
   */
  function createIngredientList(ingredientArr) {
    let finalIngredientList = '';
  
    /**
     * Removes the quantity and measurement from an ingredient string.
     * This isn't perfect, it makes the assumption that there will always be a quantity
     * (sometimes there isn't, so this would fail on something like '2 apples' or 'Some olive oil').
     * For the purposes of this lab you don't have to worry about those cases.
     * @param {String} ingredient the raw ingredient string you'd like to process
     * @return {String} the ingredient without the measurement & quantity 
     * (e.g. '1 cup flour' returns 'flour')
     */
    function _removeQtyAndMeasurement(ingredient) {
      return ingredient.split(' ').splice(2).join(' ');
    }
  
    ingredientArr.forEach(ingredient => {
      ingredient = _removeQtyAndMeasurement(ingredient);
      finalIngredientList += `${ingredient}, `;
    });
  
    // The .slice(0,-2) here gets ride of the extra ', ' added to the last ingredient
    return finalIngredientList.slice(0, -2);
  }

  /**
 * Extract the yield of the recipe from the given recipe schema JSON obejct
 * @param {Object} data Raw recipe JSON to find the image of
 * @returns {String} If found, returns the recipe yield
 */
function getYield(data) {
    if (data.recipeYield) return data.recipeYield;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Recipe') {
          if (data['@graph'][i]['recipeYield']) {
            if (Array.isArray(data['@graph'][i]['recipeYield'])) {
              return data['@graph'][i]['recipeYield'][0];
            } else if (typeof data['@graph'][i]['recipeYield'] == 'string') {
              return data['@graph'][i]['recipeYield'];
            }
          }
        }
      }
    }
    return null;
  }

  /**
 * Extract the instructions of the recipe from the given recipe schema JSON obejct.
 * This ones a bit messy and optimally should be refactored but it works.
 * @param {Object} data Raw recipe JSON to find the image of
 * @returns {Array} If found, returns the recipe instructions
 */
function getInstructions(data) {
    if (data.recipeInstructions) {
      if (typeof data.recipeInstructions == 'string') {
        return data.recipeInstructions.split('. ');
      }
      return data.recipeInstructions;
    };
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Recipe') {
          if (data['@graph'][i]['recipeInstructions'] == 'string') {
            return data['@graph'][i]['recipeInstructions'].split('. ');
          }
          if (data['@graph'][i]['recipeInstructions'][0]['itemListElement']) {
            const instructionArr = [];
            data['@graph'][i]['recipeInstructions'].forEach(instrObj => {
              instrObj.itemListElement.forEach(instruction => {
                instructionArr.push(instruction.text);
              });
            });
            return instructionArr;
          } else {
            return data['@graph'][i]['recipeInstructions'].map(instr => instr.text);
          }
        };
      }
    }
    return null;
  }