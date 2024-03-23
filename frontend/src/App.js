import { Navigation } from "./Components/Layouts/Navigation";
import { Route, BrowserRouter as Router, Routes,/* Navigate*/ } from 'react-router-dom';
import Directory from "./Components/Pages/Directory";
import UploadDropBox from "./Components/Pages/UploadDropbox";
import HomePage from "./Components/Pages/HomePage";
import ViewImages from "./Components/Pages/ViewImages";
import FriendsList from "./Components/Pages/FriendsList";
import FriendsListDetail from "./Components/Pages/FriendsListDetail";
import Collections from "./Components/Pages/Collections";


const App = () => {
  return (
    <Router>
    <div className="App">

      <Navigation />

        <Routes>
          {/* <Route path="/directory" element={<Directory />} /> */}
          <Route path="/aboutus" element={()=> <p>Coming Soon</p>} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/upload" element={<UploadDropBox />} />
          <Route path="/view/:collectionName" element={<ViewImages/>} />
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/friends/:listName" element={<FriendsListDetail />} />
          <Route path="/" element={<HomePage />} />
        </Routes>

    </div>
    </Router>
  );
}

export default App;
