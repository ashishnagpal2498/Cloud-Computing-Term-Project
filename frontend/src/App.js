import { Navigation } from "./Components/Layouts/Navigation";
import { Route, BrowserRouter as Router, Routes,/* Navigate*/ } from 'react-router-dom';
import Directory from "./Components/Pages/Directory";
import UploadDropBox from "./Components/Pages/UploadDropbox";
import HomePage from "./Components/Pages/HomePage";


const App = () => {
  return (
    <Router>
    <div className="App">

      <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/aboutus" element={()=> <div>Coming Soon</div>} />
          <Route path="/upload" element={<UploadDropBox />} />
        </Routes>

    </div>
    </Router>
  );
}

export default App;
