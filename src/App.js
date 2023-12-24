import React, { useState, useEffect } from 'react';
import productsCSV from './data/products.csv';

const parseCSVData = (data) => {
  const lines = data.split('\n');
  const headers = lines[0].split(',');
  const parsedData = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const entry = {};
    for (let j = 0; j < headers.length; j++) {
      // Add a check for undefined values[j]
      if (values[j] !== undefined) {
        entry[headers[j]] = values[j].replace(/"/g, ''); // Remove double quotes
      } else {
        entry[headers[j]] = ''; // Set to empty string or handle it as needed
      }
    }
    parsedData.push(entry);
  }

  return parsedData;
};


const App = () => {
  const [csvData, setCsvData] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(productsCSV);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        setCsvData(data);
      } catch (error) {
        console.error('Error fetching CSV file:', error);
        setError('Failed to fetch data');
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    setData(parseCSVData(csvData));
  }, [csvData]);

 
  const executeQuery = (selectedQuery) => {
    try {
      let results = [];
      switch (selectedQuery) {
        case 'null':
          results=JSON.stringify("Run query to see results");
          break;
        case 'SELECT * FROM products':
          results = data; // Simulating "SELECT * FROM products" query
          break;
        case 'SELECT productName, unitPrice FROM products':
          results = data.map(({ productName, unitPrice }) => ({ productName, unitPrice }));
          break;
        case 'SELECT * FROM products WHERE unitPrice > 50':
          results = data.filter((item) => parseFloat(item.unitPrice) > 50);
          break;
        case 'SELECT * FROM products ORDER BY unitPrice ASC':
          results = [...data].sort((a, b) => parseFloat(a.unitPrice) - parseFloat(b.unitPrice));
          break;
        case 'SELECT * FROM products ORDER BY unitsInStock DESC':
          results = [...data].sort((a, b) => parseFloat(b.unitsInStock) - parseFloat(a.unitsInStock));
          break;
        case 'SELECT COUNT(*) FROM products':
          results = [{ 'Count': data.length }];
          break;
        case 'SELECT * FROM products WHERE unitPrice BETWEEN 20 AND 40':
          results = data.filter((item) => parseFloat(item.unitPrice) >= 20 && parseFloat(item.unitPrice) <= 40);
          break;
        case 'SELECT AVG(unitPrice) AS AveragePrice, SUM(unitsInStock) AS TotalStock FROM products':
          const avgPrice = data.reduce((total, item) => total + parseFloat(item.unitPrice), 0) / data.length;
          const totalStock = data.reduce((total, item) => total + parseFloat(item.unitsInStock), 0);
          results = [{ 'AveragePrice': avgPrice, 'TotalStock': totalStock }];
          break;
        default:
          setError('Query not supported');
          break;
      }
      setQueryResults(results);
    } catch (err) {
      setError('Error executing the query');
      console.error(err);
    }
  };


  const [selectedQuery, setSelectedQuery] = useState('');
  const executeSelectedQuery = () => {
    executeQuery(selectedQuery);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Remaining JSX code remains the same */}
      <select onChange={(e) => {
    setSelectedQuery(e.target.value);
    executeQuery(null);
    }}>
        <option value="">Select a Query</option>
        <option value="SELECT * FROM products">SELECT * FROM products</option>
        <option value="SELECT productName, unitPrice FROM products">SELECT productName, unitPrice FROM products</option>
        <option value="SELECT * FROM products WHERE unitPrice > 50">SELECT * FROM products WHERE unitPrice {'>'} 50</option>
        <option value="SELECT * FROM products ORDER BY unitPrice ASC">SELECT * FROM products ORDER BY unitPrice ASC</option>
        <option value="SELECT * FROM products ORDER BY unitsInStock DESC">SELECT * FROM products ORDER BY unitsInStock DESC</option>
        <option value="SELECT COUNT(*) FROM products">SELECT COUNT(*) FROM products</option>
        <option value="SELECT * FROM products WHERE unitPrice BETWEEN 20 AND 40">SELECT * FROM products WHERE unitPrice BETWEEN 20 AND 40</option>
        <option value="SELECT AVG(unitPrice) AS AveragePrice, SUM(unitsInStock) AS TotalStock FROM products">SELECT AVG(unitPrice) AS AveragePrice, SUM(unitsInStock) AS TotalStock FROM products</option>
        {/* Add more predefined queries as options */}
      </select>

       {/* Button to execute the selected query */}
       <button onClick={executeSelectedQuery} disabled={!selectedQuery}>
        Run Query
      </button>

      {/* Display query results */}
      <div>
        <h2>Results</h2>
        {queryResults.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(queryResults[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults.map((result, index) => (
                <tr key={index}>
                  {Object.values(result).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Please click on "Run Query" button to see results!</p>
        )}
      </div>
    </div>
  );
};

export default App;
