import './App.css';
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// finally got antd style
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
          <Route exact path="/urbn-project" component={Home} />
          <Route exact path="/urbn-project/about" component={Home} />
          <Route exact path="/urbn-project/discover" component={Discover} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
