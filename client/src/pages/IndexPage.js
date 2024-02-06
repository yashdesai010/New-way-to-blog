import React, { useState, useEffect } from 'react';
import Blog from "../Blog";
import PostList from '../PostList';
import AvatarProfileInfo from '../AvatarProfileInfo';
import Deleteaccount from '../Deleteaccount';
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize as not logged in
  // const { current, setUserName, currentprofile, setCurrent } = useContext(UserProfileContext);


  useEffect(() => {
    // Check if the user is logged in by making a request to a server route
    fetch('http://localhost:3001/api/check-auth', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the isLoggedIn state based on the response
        setIsLoggedIn(data.isAuthenticated);
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  // Fetch and render posts conditionally based on the isLoggedIn state
  useEffect(() => {
    if (isLoggedIn) {
      // User is logged in, so fetch and render blog posts
      fetch('http://localhost:3001/api/posts', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setPosts(data);
        })
        .catch(error => {
          console.error('Error fetching blog posts:', error);
        });
    }
    // You can add an else branch to handle other cases, such as displaying a login prompt.
  }, [isLoggedIn]);

  // useEffect(() => {
  //   if(isLoggedIn){
  //   fetch("http://localhost:3001/api/current-user",{
  //     credentials: 'include', // Include cookies for authentication
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setUserName(data.name);
  //     })
  //     .catch((error) => {
  //       console.error('Error getting current user:', error);
  //     });
      
  //   }
  // }, [isLoggedIn]);


  // useEffect(() => {
  //   if (isLoggedIn) {
  //     fetch("http://localhost:3001/allprofilesform", {
  //       credentials: 'include',
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         setCurrent({
  //           image: data.image, // Assuming your API returns the image URL
  //         });
  //       })
  //       .catch((error) => {
  //         console.error('Error getting current user:', error);
  //       });

  //   }
  // }, [isLoggedIn]);







  return (
    <div>
      {isLoggedIn ? (
       
        <>
          {posts.length > 0 && posts.map(post => (
            <Blog {...post} />
          ))}
         
         
          {/* <header>
          <div className='username-container'>

          <div className='username'>
          <Avatar src={currentprofile.image || "https://mui.com/static/images/avatar/1.jpg"}></Avatar>
</div>

<Link to="/profile">
          <p>
Welcome, {current}

</p>
</Link>
</div>

</header> */}
<AvatarProfileInfo/>
<Deleteaccount/>
        </>
        
      ) : (
        // Render content for non-logged-in users, e.g., a login prompt
       <>
                      <PostList />
                      </>

      )}
    </div>
  );
}
