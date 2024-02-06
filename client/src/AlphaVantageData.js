import React, { useState, useEffect } from 'react';

const AlphaVantageData = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch the articles data and set it to state
    fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=0429cfcb03ba4b01bfc80ff1c280dc16')
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index}>
          <h2> <div dangerouslySetInnerHTML={{ __html: article.title }}/></h2>
          <p>{article.description}</p>
          <p>Author: {article.author}</p>
          <img src={article.urlToImage} alt="Article" />
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          <p>Published At: {article.publishedAt}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default AlphaVantageData;
