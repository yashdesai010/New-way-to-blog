// import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
// import { useLocation } from 'react-router-dom'; // Import useLocation from React Router

// const Profileview = () => {
//     const location = useLocation(); // Get the location object
//     const userData = location.state?.profileData; // Retrieve authorProfile from location state
//    // console.log("Location State:", location.state); // Check the entire location state
//    console.log("Profile Data:", userData); 
//   return (
//     <MDBContainer className="mt-4">
//       {userData && (
//         <MDBRow className="justify-content-center">
//           <MDBCol md="6">
//             <MDBCard>
//               <MDBCardImage position="top" src={userData.image} alt="User Image" fluid />
//               <MDBCardBody>
//                 <MDBCardTitle>Profile Information</MDBCardTitle>
//                 <MDBCardText>
//                   <strong>Full Name:</strong> {userData.fullName}
//                   <br />
//                   <strong>Email:</strong> {userData.email}
//                   <br />
//                   <strong>Phone:</strong> {userData.phone}
//                   <br />
//                   <strong>Profession:</strong> {userData.profession}
//                   <br />
//                   <strong>Address:</strong> {userData.address}
//                 </MDBCardText>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       )}
//     </MDBContainer>
//   );
// };

// export default Profileview;
import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';

const ProfileView = () => {
  const location = useLocation();
  const userData = location.state?.profileData;

  const [posts, setPosts] = useState([]);
  const [authorPosts, setAuthorPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts/all');
        const data = await response.json();
        setPosts(data); // Set posts data in state
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
  }, []);
  
  
  useEffect(() => {
    console.log("Updating author posts...", userData, posts);
    if (userData?.userId && posts.length > 0) {
      const filteredPosts = posts.filter(post => post.userId === userData.userId);
      setAuthorPosts(filteredPosts);
    }
  }, [userData, posts]);
  

  return (
    
    <MDBContainer className="mt-4">
      {userData && (
        <MDBRow className="justify-content-center">
          <MDBCol md="6">
            <MDBCard>
              <MDBCardImage position="top" src={userData.image} alt="User Image" fluid />
              <MDBCardBody>
                <MDBCardTitle>Profile Information</MDBCardTitle>
                <MDBCardText>
                  <strong>Full Name:</strong> {userData.fullName}
                  <br />
                  <strong>Email:</strong> {userData.email}
                  <br />
                  <strong>Phone:</strong> {userData.phone}
                  <br />
                  <strong>Profession:</strong> {userData.profession}
                  <br />
                  <strong>Address:</strong> {userData.address}
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      )}

{authorPosts.length > 0 && (
        <div className="mt-4">

          <h2>Author's Posts</h2>
          {authorPosts.map(post => (
            <MDBCard key={post.id} className="mt-3" style={{ width: '18rem' }}>
              <MDBCardImage src={post.image} alt="Post Image" position="top" />
              <MDBCardBody>
                <MDBCardTitle>{post.title}</MDBCardTitle>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      )}
    </MDBContainer>
  );
};

export default ProfileView;

