import React, { useState } from 'react';

const SearchStocks = () => {
  const [keywords, setKeywords] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = '0429cfcb03ba4b01bfc80ff1c280dc16'; // Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apiKey}`);
      const data = await response.json();
      setSearchResults(data.bestMatches || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter stock keywords..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => (
              <li key={result['1. symbol']}>
                <p>
                  Symbol: {result['1. symbol']}<br />
                  Name: {result['2. name']}<br />
                  Type: {result['3. type']}<br />
                  Region: {result['4. region']}<br />
                  Market Open: {result['5. marketOpen']}<br />
                  Market Close: {result['6. marketClose']}<br />
                  Timezone: {result['7. timezone']}<br />
                  Currency: {result['8. currency']}<br />
                  Match Score: {result['9. matchScore']}<br />
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchStocks;
