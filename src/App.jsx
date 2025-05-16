// import React from 'react';
// import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';

// import NavBar from './Components/NavBar';
// import Post from './pages/posts';
// import AboutUs from './pages/aboutus';
// import Contact from './pages/contactus';
// import Home from './pages/Home';
// import Footer from './Components/footer';
// function App() {
//   return (
//     <>
//     <Router>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/post" element={<Post />} />
//         <Route path="/aboutus" element={<AboutUs />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//       <Footer/>
//     </Router>
//     </>
//   );
// }

// export default App;
import Main from './pages/mainweb' 
import { BrowserRouter as Router} from 'react-router-dom';

function App(){
  return(
    <Router>
    <Main/>
    </Router>
  );
}
export default App;
