const inquirer = require('inquirer')
const genMarkdown = require('./utils/generateMarkdown.js')
const fs = require('fs')
const axios = require('axios')

const questions = [
    {
        type: 'input',
        name: 'title', 
        message: "Project Title:"
    },
    {
        type: 'input',
        name: 'description',
        message: "Project Description: "
    },
    {
        type: 'input', 
        name: 'install_instructions',
        message: "Installation Instructions: "
    },
    {
        type: 'input',
        name: 'usage',
        message: "Usage Information: ",
    },
    {
        type: 'input',
        name: 'contribution',
        message: "Contribution Guidelines: ",
    },
    {
        type: 'input',
        name: 'test_instructions',
        message: "Test Instructions: ",
    },
    {
        type: 'list',
        name: 'licenses',
        message: 'choose a license: ',
        choices: ['licenses'],
        filter(val) {
            return val.toLowerCase()
        }
    }

];

// List of licenses from git
const badges = {
  "agpl-3.0":     "[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)",
  "apache-2.0":   "[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)",
  "bsd-2-clause": "[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)",
  "bsd-3-clause": "[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)",
  "bsl-1.0":      "[![License](https://img.shields.io/badge/License-BSL%201.0-green)](https://opensource.org/licenses/BSL-1.0)",
  "cc0-1.0":      "[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)",
  "epl-2.0":      "[![License](https://img.shields.io/badge/License-EPL_1.0-red.svg)](https://opensource.org/licenses/EPL-1.0)",
  "gpl-2.0":      "[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)",
  "gpl-3.0":      "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)",
  "lgpl-2.1":     "[![License: LGPL v3](https://img.shields.io/badge/License-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)",
  "mit":          "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",
  "mpl-2.0":      "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)",
  "unlicense":    "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)"
}



let licenseList = []

// this function collects license data and appends previous data
function writeToFile(filename, data) {
    data.licenseName = {};
    data.badge = ""
    
    for(let i = 0; i < licenseList.length; i++) {
        if(data.licenses === licenseList[i].spdx_id.toLowerCase()) {
        data.license = licenseList[i]
        data.badge = badges[data.licenses]
        break;
        }
    }

    // Write the generated markdown to the file
    fs.writeFile(filename, genMarkdown(data, licenseList), (err) => {
        if(err) { console.log("Failed to write readme: " + err) }
    });
}

// function to axios get all licenses from a link
function init() {
    axios.get('https://api.github.com/licenses').then(res => {
        licenseList = res.data; 

        for(let i = 0; i < licenseList.length; i++) {
            questions[6].choices[i] = licenseList[i].spdx_id
        }


        inquirer.prompt(questions).then(answers => {
            writeToFile("readme.md", answers)
        }).catch(err => {
            console.log("Error! " + err)
        })
    }).catch(err => {
        console.log(`Error getting list of licenses:  ${err}`)
    })
    //fills list with all licenses through for loop and appends answer to readme
    
}

// function call to initialize program
init();
