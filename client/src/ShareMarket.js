// import React, { useEffect, useState } from 'react';

// export default function ShareMarket() {
//   const [marketData, setMarketData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const url = 'https://share-market-news-api-india.p.rapidapi.com/marketNews';
//       const options = {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': 'e47e38bf84msh5dd17d6e8986d1cp15c2aajsnbaa9b678bc5f',
//           'X-RapidAPI-Host': 'share-market-news-api-india.p.rapidapi.com'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         console.log(result); // Check the structure of the response in the browser console
//         setMarketData(result);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

  

//   return (
//     <div>
//       {marketData.length > 0 ? (
//         <div>
//           {marketData.map((data, index) => (
//             <div key={index}>
//               <h1>{data.Title}</h1>
//               <p>Source: {data.Source}</p>
//               <p>URL: {data.URL}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }
