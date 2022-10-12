console.log("tout marche bien");
import { program } from "commander";
import chalk from "chalk";
import fs, {createReadStream} from "fs";
import inquirer from "inquirer";
import client from "@sanity/client";
// Demander à l'utilisateur d'entrer le nom d'un dossier à la racine

const cl = client({
  projectId: "qwvgy8rr",
  dataset: "production",
  apiVersion: "2021-10-21", // use current UTC date - see "specifying API version"!
  token:
    "skyuEwISGXX3gRkt2NIoMZm96hO15TYKr8xYqgOphT2lFVdlHQQPyrai02pqVjobRycwnUWvoWpOB11dR6Vv0Hq8Yxcod96UCFM04YgFqKpMenkjJRa1Y2IoxyrbxNiac6LSO7eIk6aXYTTCZKmJlmlzP792hYjTA8we5UDP7EqEaD0bXWAx", // or leave blank for unauthenticated usage,
  useCdn: true,
});
inquirer
  .prompt([
    {
      name: "name",
      message: "Entrez le nom d'un dossier:",
    },
    {
        name:"alt", 
        message: "Quel type de projets? : "
    }
  ])
  .then((response) => {
    console.log(response);
    fs.readdir(`${process.cwd()}/${response.name}`, (err, data) => {
      console.log("Fichiers", data);

      for(let element of data){
        const filePath = `${process.cwd()}/${response.name}/${element}`
        cl.assets.upload("image", createReadStream(filePath), {
            filename: element,
          })
          .then((result) => {
            // console.log("je suis la réponse", response)
            console.log('Tout a bien marché')
            const doc = {
                _type: 'projects',
                picture: {
                    _type: "figure", 
                    alt: response.alt, 
                    image: {
                        asset: {
                            _ref: result._id
                        }
                    }
                }
              }
              
              cl.create(doc).then((res) => {
                console.log("Projet enregistré")
              })
          })
          .then(() => {
            console.log("Done!");
          });
      }

    });
  });
