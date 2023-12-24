const { logDOM } = require("@testing-library/react");
const path = require("path");

// Function to fetch and log CSV contents
function logCSVFile() {
  // Get the absolute path to the CSV file
  const csvFilePath = path.resolve("./", `products.csv`);

  // Use the file:// protocol for local files
  const fileUrl = `file://${csvFilePath}`;

  fetch(fileUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(csvData => {
      console.log(csvData); // Log the CSV contents
      // You might want to parse the CSV data here if needed
      // For instance, you could use a CSV parsing library like Papaparse
      // Example: parse CSV data using Papaparse library
      // let parsedData = Papa.parse(csvData, { header: true });
      // console.log(parsedData);
    })
    .catch(error => console.error('There was a problem fetching the CSV file:', error));
}

logCSVFile();
