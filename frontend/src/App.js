import { Navigation } from "./Components/Layouts/Navigation";
import Directory from "./Components/Pages/Directory";
import UploadDropBox from "./Components/Pages/UploadDropbox";
// import HomePage from "./Components/Pages/HomePage";


const App = () => {
  return (
    <div className="App">
      <Navigation />
      {/* <HomePage /> */}
      {/* <Directory /> */}
      <UploadDropBox />
    </div>
  );
}

export default App;
