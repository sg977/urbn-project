import './App.css';
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// api key shows up correctly
// console.log(process.env.REACT_APP_API_KEY)

function App() {
  return (
    <Router>
      <div>
        <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={Home} />
          <Route exact path="/discover" component={Discover} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
