/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer.prompt([
{
    name: "URL",
    type: 'input',
}])
.then((ans) => {
    const url = ans.URL;
    var image = qr.image(url);

    image.pipe(fs.createWriteStream("image.png"));

    fs.writeFile("janis.txt", url, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

