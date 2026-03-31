import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Create from './pages/Create';
// import About from './pages/About';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Create" element={<Create />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </Router>
    </>
  );

  
}

export default App;