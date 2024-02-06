const cors=require('cors')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ dest: 'uploads/' }); // Destination folder for image upload
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from Mongoose

cloudinary.config({
  cloud_name: 'dgs28jxmy',
  api_key: '187853253275597',
  api_secret: 'yHFd6kiM4V9v-dXPyMmww7Q6MNQ',
});


var nodemailer = require('nodemailer');
const crypto = require('crypto');
const { info } = require('console');
const { async } = require('q');
require('dotenv').config();


const app=express();
const server = http.createServer(app);
const socketIo = require('socket.io');

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const mongodbUri = process.env.MONGODB_URI;
const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const secretKey=process.env.SECRET_KEY


app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json());

app.use(cookieParser());

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });


const commentSchema = new mongoose.Schema({
  text: String, // Comment text
  createdDate: { type: Date, default: Date.now }, // Comment creation date (defaults to the current date and time)
  name: String, // Store the name of the user who authored the comment
  postId: mongoose.Schema.Types.ObjectId, // Add this field to store the post ID
  text: String,
  userid:mongoose.Schema.Types.ObjectId,
  postId: mongoose.Schema.Types.ObjectId, // Add this field to store the post ID
 
});

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;



// Define the Profile schema
const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  profession: {
    type: String,
  },
  address: {
    type: String,
  },
  userId:{
    type:String,
  },
  image:{
    type:String,
  }
  // Add more fields as needed
  
});

// Create the Profile model
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;





const UserModel = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName:String,
  isVerified: { type: Boolean, default: false }, // Added field for email verification
  verificationToken: String, // Added field for storing the verification token
 
  posts: [
    {
      userId:String,
      content: String,
      image: String,
      title: String,
      summary: String,
      firstName: String,
      lastName:String,
      createdDate: { type: Date, default: Date.now },
      claps: { type: Number, default: 0 },
      likedBy: { type: Array, default: [] },
      category:String,
      
      comments: [
        {
          text: String, // Comment text
          createdDate: { type: Date, default: Date.now }, // Comment creation date
          name: String, // Store the name of the user who authored the comment
          userid:String,
        },
      ],
    },
  ],
}));

const feedbackSchema = new mongoose.Schema({
  name: String,
  feedbackText: String,
});

// Create a model
const Feedback = mongoose.model('Feedback', feedbackSchema);


// app.post('/SignUp', async (req, res) => {
//   const { username, password, firstName,lastName } = req.body;

//   // Check if the email address already exists
//   const existingUser = await UserModel.findOne({ username });
//   if (existingUser) {
//     return res.status(400).json({ message: 'Email address is already in use' });
//   }

//   // If the email address is not found, proceed with registration
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new UserModel({ lastName,firstName, username, password: hashedPassword });
//   user.save();

//   res.json({ message: 'User registered successfully' });
// });
app.post('/SignUp', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address is already in use' });
    }
const hashedPassword = await bcrypt.hash(password, 10);
 const token = crypto.randomBytes(20).toString('hex');

    const newUser = new UserModel({ lastName, firstName, username, verificationToken: token,password:hashedPassword });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yashdesai9978@gmail.com',
        pass: 'zntxvylcongrlrkb',
      },
    });

    const mailOptions = {
      from: 'yashdesai9978@gmail.com',
      to: username,
      subject: 'Verify your email',
      text: `Please click the following link to verify your email: http://localhost:3001/verifyEmail/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'User registered successfully. Verification email sent.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Endpoint to verify email
app.get('/verifyEmail/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await UserModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Log the token stored in the database for the user

    // Mark the user as verified (update the user model accordingly)
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});





// app.post('/SignIn', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await UserModel.findOne({ username });
// const passok=bcrypt.compareSync(password,user.password)
// if(passok){
//     jwt.sign({username,id:user._id,firstname:user.firstName,lastName:user.lastName},secretKey,{},(err,token)=>{
//         if(err) throw err;
//         res.cookie('token',token).json({
//           id:user._id,
//           username,
//           firstName:user.firstName,
//           lastName:user.lastName,
//         });
//         res.json({ token });
//         console.log(token);
//     })
// }
// else{
//     res.status(400).json("Something went Wrong");
// }
// });

app.post('/SignIn', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'User is not verified' });
    }

    const passok = bcrypt.compareSync(password, user.password);

    if (passok) {
      jwt.sign(
        { username, id: user._id, firstname: user.firstName, lastName: user.lastName,isVerified:user.isVerified },
        secretKey,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json({
            id: user._id,
            username,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerified:user.isVerified,
          });
        }
      );
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});


app.get('/profile', (req, res) => {
  const{token}=req.cookies;
  jwt.verify(token,secretKey,{},(err,info)=>{
    if(err) throw err;
    res.json(info)
    
  })
});
app.post('/api/comments',authenticateUser, async (req, res) => {
  try {
    const { postId, name, text } = req.body;
    const username = req.user.username;
    const userid=req.user._id;

    // Find the post by its ID
    const post = await UserModel.findOne({ 'posts._id': postId });

    if (!post) {
      console.error('Post not found for ID:', postId);
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment associated with the post
    const newComment = {
      name:username, // Use the provided name for guest comments
      text,
      postId,
      userid:userid,
      
    };

    // Save the comment to the database
    const comment = new CommentModel(newComment);
    await comment.save();

    // Make sure that 'comments' is initialized as an empty array
    if (!post.posts.comments) {
      post.posts.comments = [];
    }

    // Add the newly created comment to the post's comments array
    post.posts.comments.push(comment);

    // Save the updated post to the database
    await post.save();

    // Find the newly created comment by its ID
    const createdComment = await CommentModel.findById(comment._id).select('-__v');


    return res.status(201).json({ message: 'Comment submitted successfully', comment: createdComment, });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Error saving comment' });
  }
});

app.get('/api/comments/:postId',async (req, res) => {
  try {
    const { postId } = req.params;

    // Find comments for the specified post ID
    const comments = await CommentModel.find({ postId });
    // Check if comments were found
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    // Send the retrieved comments as a JSON response
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});


app.put('/profilesform', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you can get the user ID from the authenticated request
    const { fullName, email, phone, profession, address } = req.body;

    // Find the user
    const user = await UserModel.findById(userId);

    // If the user is not found, return an error response
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the profile associated with the user's ID
    const userProfile = await Profile.findOne({ user: userId });

    // If the profile is not found, return an error response
    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update the profile fields
    userProfile.fullName = fullName;
    userProfile.email = email;
    userProfile.phone = phone;
    userProfile.profession = profession;
    userProfile.address = address;

    // Save the updated profile
    await userProfile.save();

    res.json(userProfile); // Return the updated profile as a JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get user profile by user ID
app.post('/profilesform', upload.single('image'), authenticateUser, async (req, res) => {
  try {
    const { fullName, email, phone, profession, address } = req.body;
    const userId = req.user._id;

    let imageUrl; // Variable to store the image URL

    // Check if there's an image in the request
    if (req.file) {
      const image = req.file; // Use req.file to access the uploaded file

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path);

      // Set the image URL to the newly uploaded image
      imageUrl = result.secure_url;

      // Remove the temporary file created by multer
      fs.unlinkSync(image.path);
    }

    // Update the user profile with the new image URL or the existing image URL
    const profile = await Profile.findOneAndUpdate(
      { userId: userId },
      {
        fullName,
        email,
        phone,
        profession,
        address,
        ...(imageUrl && { image: imageUrl }), // Include image only if it exists
      },
      { new: true, upsert: true }
    );

    res.json({ profile, imageUrl });
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/allprofilesform', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ userId });

    if (profile) {
      const { fullName, email, phone, profession, address, image } = profile;

      res.json({
        fullName,
        email,
        phone,
        profession,
        address,
        image, // Include the image URL in the response
      });
    } else {
      console.error('User profile not found');
      res.status(404).send('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/userprofile', async (req, res) => {
  try {
    const { firstName } = req.query;
    const user = await UserModel.findOne({ firstName }); // Assuming you have a UserModel
    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    const profile = await Profile.findOne({ userId: user._id });

    if (profile) {
      const { fullName, email, phone, profession, address, image,userId } = profile;

      res.json({
        userId,
        fullName,
        email,
        phone,
        profession,
        address,
        image, // Include the image URL in the response
      });
    } else {
      console.error('User profile not found');
      res.status(404).send('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/userprofilecomment', async (req, res) => {
  try {
    const { username } = req.query;

    const user = await UserModel.findOne({ username }); // Assuming you have a UserModel
    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    const profile = await Profile.findOne({ userId: user._id });

    if (profile) {
      const { fullName, email, phone, profession, address, image } = profile;

      res.json({
        fullName,
        email,
        phone,
        profession,
        address,
        image, // Include the image URL in the response
      });
    } else {
      console.error('User profile not found');
      res.status(404).send('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).send('Internal Server Error');
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.post('/like-post',authenticateUser, async (req, res) => {
  const { postId, userId } = req.body;

  try {
    // Find the post by ID
    const post = await UserModel.findOne({ 'posts._id': postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the specific post within the user's posts array
    const specificPost = post.posts.id(postId);

    if (!specificPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user ID is already in the liked by array for this post
    if (specificPost.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Post already liked by this user' });
    }

    // Update the liked by array for the post
    specificPost.likedBy.push(userId);
    specificPost.claps += 1; // Increment claps

    // Save the updated post
    await post.save();
    
    //SOCKET
    io.emit('post-liked', { postId, userId }); // Emit event with relevant data

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Socket.IO connections

// app.post('/clap', authenticateUser, async (req, res) => {
//   const { postId } = req.query;

//   try {
//     // Find all users who have the post with the given postId in their posts array
//     const users = await UserModel.find({ 'posts._id': postId });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: 'Post not found in any user posts' });
//     }

//     // Increment the claps count for the specific post in each user's posts array
//    const updatedpost= users.forEach(async user => {
//       const postIndex = user.posts.findIndex(post => String(post._id) === postId);
//       if (postIndex !== -1) {
//         user.posts[postIndex].claps += 1;
//         await user.save();
//       }
//     });

//     res.status(200).json({ message: 'Clap added successfully',updatedpost });
//   } catch (error) {
//     console.error('Error adding clap:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




// Assuming you have a User model defined with Mongoose

app.get('/user/liked-posts', async (req, res) => {
  try {
    const users = await UserModel.find({}); // Fetch all users

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const likedPostsByUsers = [];

    for (const user of users) {
      const likedPosts = user.posts.filter(post => post.claps > 0); // Extract liked posts for each user
      likedPostsByUsers.push({ userId: user._id, likedPosts }); // Store liked posts and user ID
    }

    res.status(200).json(likedPostsByUsers);
  } catch (error) {
    console.error('Error fetching liked posts for users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/feedback', async (req, res) => {
  const { name, feedbackText } = req.body;
  try {
    const newFeedback = new Feedback({ name, feedbackText });
    await newFeedback.save();
    res.status(201).send('Feedback saved successfully');
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Error saving feedback');
  }
});




app.post('/logout',(req,res)=>{
  res.cookie('token', '').json('ok');
})

function authenticateUser(req, res, next) {

  const token=req.cookies.token;

  if (!token) {
    // Handle unauthorized access, such as sending a 401 Unauthorized response
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // Handle token verification errors, such as sending a 401 Unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Set the user information in the request object
    req.user = {
      _id: decoded.id, // Include the user ID in req.user
      username: decoded.username,
     profile: 'profileObjectId',
    };
    next();
  });
}


app.get('/api/current-user',authenticateUser, (req, res) => {

    const username = req.user.username; 
    res.json({ name: username });
  
});





app.post('/forgotpass',(req,res)=>{
  const{email}=req.body;
  UserModel.findOne({username:email})
  .then(user=>{
    if(!user){
      
      return res.send({Status:"User not found"}) 
    }
    const token=jwt.sign({id:user._id},"7339729573973adhoah",{expiresIn:"1d"})
    var transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });
    
    var mailOptions = {
      from: 'yashdesai9978@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:3000/resetpass/${user._id}/${token}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        return res.send({Status:"Success"})
      }
    });
  })
})

app.post('/resetpass/:id/:token',(req,res)=>{
  const{id,token}=req.params
  const{password}=req.body
  jwt.verify(token,"7339729573973adhoah",(err,decoded)=>{
    if(err){
      return res.json({Status:"Token error"})
    }
    else{
      bcrypt.hash(password,10)
      .then(hash=>{
        UserModel.findByIdAndUpdate({_id:id},{password:hash})
        .then(u=>res.send({Status:"Success"}))
        .catch(err=>res.send({Status:err}))
      })
      .catch(err=>res.send({Status:err}))

    }
  })
})

app.get('/api/posts/all', async (req, res) => {
  try {
    // Query the database to retrieve all blog posts
    const posts = await UserModel.find({}, 'posts.userId posts.title posts.content posts.summary posts.firstName posts.lastName posts.image posts.createdDate posts._id posts.claps posts.category');
    
    // Check if there are no posts
    if (!posts) {
      return res.status(404).json({ message: 'No blog posts found' });
    }

    // Extract posts from the user documents
    const allPosts = posts.map(user => user.posts).flat();
    // Send the retrieved blog posts as a JSON response
    res.status(200).json(allPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});








app.use(authenticateUser);

app.post('/api/post', upload.single('image'), async (req, res) => {
  try {
    const { content, summary, title, category } = req.body;
    const image = req.file;
    const userId = req.user._id; // Access user ID from req.user
    
    const user = await UserModel.findById(userId);
    const firstName = user.firstName;
    const lastName=user.lastName;


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload the image to Cloudinary
    if (image) {
      const result = await cloudinary.uploader.upload(image.path);
      console.log("RES"+result);

      // Create a new post with the Cloudinary URL
      const newPost = {
        content: content,
        summary: summary,
        title: title,
        image: result.secure_url,
        firstName:firstName,
        lastName:lastName,
        createdDate: new Date().toISOString(),
        category:category,
        userId:userId,
        //imageURL:{url:result.secure_url}, // Store the Cloudinary URL
      };

      user.posts.push(newPost);

      // Save the updated user document
      await user.save();

      res.status(201).json({ message: 'Blog post saved successfully' });
    } else {
      // Create a new post without an image
      const newPost = {
        content: content,
        summary: summary,
        title: title,
        firstName:firstName,
        lastName:lastName,
        createdDate: new Date().toISOString(),
        category:category
      };

      user.posts.push(newPost);

      // Save the updated user document
      await user.save();

      res.status(201).json({ message: 'Blog post saved successfully' });
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ message: 'Error saving blog post' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    // Query the database to retrieve blog posts
    const posts = await UserModel.findById(req.user._id, 'posts.title posts.content posts.summary posts.firstName posts.lastName posts.image posts.createdDate posts._id')
    .populate({
      path: 'posts.comments', // Populate the comments array within each post
      select: 'text createdDate name', // Include only the relevant comment fields
    });
    if (!posts) {
      return res.status(404).json({ message: 'No blog posts found for this user' });
    }

    // Send the retrieved blog posts as a JSON response
    res.status(200).json(posts.posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});












app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id; // Post ID from the URL
  const userId = req.user._id; // Assuming you have the authenticated user's ID

  try {
    const post = await UserModel.findOne({ _id: userId, 'posts._id': postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Since you want to get one specific post, you can use the `.id()` method
    const specificPost = post.posts.id(postId);

    if (!specificPost) {
      return res.status(404).json({ message: 'Specific post not found' });
    }

    // If the post is found, you can send it as a JSON response
    res.status(200).json(specificPost);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});











// Define the route to edit a specific post
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const { content, title, summary } = req.body;
  const image = req.file;

  const userId = req.user._id; // Assuming you have user authentication middleware

  try {
    // Find the user with the specified ID and the post within that user
    const user = await UserModel.findOne({ _id: userId, 'posts._id': postId });

    if (!user) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    const postToEdit = user.posts.id(postId);

    if (!postToEdit) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If a new image is provided, upload it to Cloudinary
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image.path);

      // Update the image URL in the post
      postToEdit.image = cloudinaryResponse.secure_url;

      // Remove the temporary file created by multer
      fs.unlinkSync(image.path);
    }

    // Update other properties of the post
    postToEdit.content = content;
    postToEdit.title = title;
    postToEdit.summary = summary;

    // Save the changes to the user document
    await user.save();

    res.status(200).json({ message: 'Post edited successfully' });
  } catch (err) {
    console.error('Error saving the edited post:', err);
    res.status(500).json({ message: 'Error saving the edited post' });
  }
});


// Define the route to delete a specific post
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id; // Post ID from the URL

  // Extract the user ID from the authentication token
  const userId = req.user._id;

  try {
    // Check if the post exists and belongs to the authenticated user
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the post index within the user's posts array
    const postIndex = user.posts.findIndex(post => post._id.toString() === postId);

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove the post from the user's posts array
    user.posts.splice(postIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting the post:', err);
    res.status(500).json({ message: 'Error deleting the post' });
  }
});

// Assuming you have an Express app initialized, your Comment and Post models imported,
// and a way to retrieve the currently logged-in user (for example, through authentication middleware)

app.delete('/api/deletecomments/:postId/:commentId', authenticateUser, async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id; // Assuming you have the user ID from authentication

  try {
    // Find the comment and ensure it belongs to the logged-in user before deletion
    const comment = await CommentModel.findOne({ _id: commentId, postId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or user unauthorized' });
    }

    // Delete the comment
    await CommentModel.findByIdAndDelete(commentId);

    res.status(204).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Express route to check authentication status
app.get('/api/check-auth', (req, res) => {
  // Check the user's authentication status based on your logic
  if (req.user._id && req.user.username) {
    // User is authenticated
    res.json({ isAuthenticated: true, username: req.user.username, id:req.user._id });
  } else {
    // User is not authenticated
    res.json({ isAuthenticated: false, username: null,id: null });
  }
});


app.delete('/deleteAccount',authenticateUser, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by their username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the provided password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Delete the user account
    await UserModel.deleteOne({ username });

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});




server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
