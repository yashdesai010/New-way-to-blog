/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
} from 'mdb-react-ui-kit';

export default function ProfileForm() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    address: '',
    image: '',
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  useEffect(() => {
    // Check if an image is selected
    if (image) {
      // Call the function to handle image upload
      handleSaveChanges();
    }
  }, [image]);

  // useEffect(() => {
  //   const savedUserData = localStorage.getItem('userData');

  //   if (savedUserData) {
  //     setUserData(JSON.parse(savedUserData));
  //   } else {
  //     fetchUserData();
  //   }
  // }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/allprofilesform', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const handleEditClick = () => {
    setFullName(userData.fullName);
    setEmail(userData.email);
    setPhone(userData.phone);
    setProfession(userData.profession);
    setAddress(userData.address);

    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('profession', profession);
      formData.append('address', address);
      formData.append('image', image);

      const response = await fetch('http://localhost:3001/profilesform', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log('Profile updated successfully!');
        fetchUserData();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }

    setIsEditModalOpen(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleProfessionChange = (e) => {
    setProfession(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };


  return (
    <section>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <label className="form-label" htmlFor="customFile"></label>
                <input type="file" className="form-control" id="customFile" onChange={handleImageChange} />
                <MDBCardImage
                  src={image ? URL.createObjectURL(image) : (userData.image || 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp')}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid
                />
                <p className="text-muted mb-1">{userData.profession}</p>
                <p className="text-muted mb-4">{userData.address}</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn outline className="ms-1">
                    Message
                  </MDBBtn>
                </div>
                <MDBBtn outline onClick={handleEditClick}>
                  <MDBIcon icon="edit" className="me-2" />
                  Edit Profile
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData.fullName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData.phone}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Profession</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData.profession}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData.address}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {isEditModalOpen && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <MDBModalHeader toggle={handleModalClose}>Edit Profile</MDBModalHeader>
                <MDBModalBody>
                  <MDBInput label="Full Name" value={fullName} onChange={handleFullNameChange} />
                  <br></br>
                  <MDBInput type="email" label="Email" value={email} onChange={handleEmailChange} />
                  <br></br>
                  <MDBInput label="Phone" value={phone} onChange={handlePhoneChange} />
                  <br></br>
                  <MDBInput label="Profession" value={profession} onChange={handleProfessionChange} />
                  <br></br>
                  <MDBInput label="Address" value={address} onChange={handleAddressChange} />
                  <br></br>
                  <div className="d-grid gap-2">
                    <MDBBtn color="primary" onClick={handleSaveChanges}>
                      Save Changes
                    </MDBBtn>
                    <MDBBtn color="secondary" onClick={handleModalClose}>
                      Cancel
                    </MDBBtn>
                  </div>
                </MDBModalBody>
              </div>
            </div>
          </div>
        )}
      </MDBContainer>
    </section>
  );
}
