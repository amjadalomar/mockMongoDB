// recipecard: 
// image, title

// view page:
// image, title, author, cooking time, servings, ingredients, instructions, tags,
// ***user specific: user created tags, favorited? (boolean)

db.createCollection("recipes", {
   validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [ "title", "image", "author", "servings", "cookingTime", "ingredients", "instructions", "tags" ],
        properties: {
            name: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            image: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            author: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            servings: {
                bsonType: "int",
                minimum: 1,
                description: "must be an int that is at least 1 and is required"
            },
            cookingTime: {
                bsonType: "int",
                description: "must be a int if the field exists"
            },
            ingredients: {
                bsonType: ["array"],
                minItems: 1,
                uniqueItems: true,
                items: {
                    bsonType: "string",
                    description: "Each ingredient must be a string and is required",

                }
            },
            instructions: {
                bsonType: ["array"],
                minItems: 1,
                uniqueItems: true,
                items: {
                    bsonType: "string",
                    description: "each array index must be a string and is required",

                }
            },
            tags: {
                bsonType: ["array"],
                minItems: 1,
                uniqueItems: true,
                items: {
                    bsonType: "string",
                    description: "each array index must be a string and is required",

                }
            }
         }
      }
   }
});

db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [ "username", "password", "savedRecipes" ],
         properties: {
            username: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            password: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            savedRecipes: {
                bsonType: "object",
                required: ["id", "favorited", "tags"],
                minItems: 0,
                uniqueItems: true,
                properties: {
                    id: {
                        bsonType: "string",
                        description: "must be a string and is required",
                    },
                    favorited: {
                        bsonType: "boolean",
                        description: "must be a boolean and is required"
                    },
                    tags: {
                        bsonType: ["array"],
                        minItems: 0,
                        uniqueItems: true, 
                        items: {
                            bsonType: "string",
                            description: "each must be a string and is required"
                        }
                    }
                }
            }
         }
      }
   }
});