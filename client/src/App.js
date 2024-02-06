import {Route, Routes } from 'react-router-dom';
import SignUp from './registerpage';
import SignIn from './loginpage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import './App.css';
import {Usercontextprovider}  from './Usercontext';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './CreatePost';
import PostPage from './pages/Postindex'
import Editpage from './pages/Editpage';
import PostList from './PostList';
import Darkmode from './Darkmode';
import Profileform from './Profileform';
import Profileview from './Profileview';
import AlphaVantageData from './AlphaVantageData';
import ShareMarket from './ShareMarket';
import { UserProfileProvider } from './UserProfileContext';
import SearchStocks from './SearchStocks';
import { DarkModeProvider } from './DarkModeContext';
function App() {
  
  return (
    <UserProfileProvider>
    <Usercontextprovider>
    <DarkModeProvider>

      <toast/>
      <ToastContainer/>
      <Darkmode />
      
<Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage/>}/>
      <Route path="/SignIn" element={<SignIn/>} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Forgotpass" element={<ForgotPassword />} />
      <Route path="/resetpass/:id/:token" element={<ResetPassword />} />
      <Route path="/create" element={<CreatePost/>}/>
      <Route path="/post/:id" element={<PostPage/>}/>
      <Route path="/edit/:id" element={<Editpage/>}/>
      <Route path='/Postlist' element={<PostList/>}/>
      <Route path='/profile' element={<Profileform/>}/>
      <Route path='/profileview' element={<Profileview/>}/>
      <Route path="/AlphaVantageData" element={<AlphaVantageData/>}/>
      <Route path='/ShareMarket' element={<ShareMarket/>}/>
<Route path='/StockSearch' element={<SearchStocks/>}/>


</Route>
    </Routes> 
    </DarkModeProvider>
      </Usercontextprovider>
      </UserProfileProvider>

      
      
  );
  
}

export default App;
