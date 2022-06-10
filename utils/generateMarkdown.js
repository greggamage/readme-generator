function generateMarkdown(data, licenseList) {

  
  return `
  # ${data.title}
  ${data.badge}
  ## Description
  ${data.description}
  ## Table of Contents
  - [Installation](#Installation)
  - [Usage](#Usage)
  - [License](#License)
  - [Contributing](#Contributing)
  - [Tests](#Test-Instructions)
  - [Questions](#Questions)
  ## Installation
  ${data.install_instructions}
  ## Usage
  ${data.usage}
  
  ## License
  This project is covered under the ${data.license.name}
  ## Contributing
  ${data.contribution}
  ## Tests
  ${data.test_instructions}
  ## Questions
  - What Language was this written in? - JavaScript
  - where is the live demo? - YouTube link in the description
  `;
}

module.exports = generateMarkdown;