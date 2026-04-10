// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";

import Nav from "./component/Nav/nav";
import Home from "./component/Home/home";
import About from "./component/About/about";
import Projects from "./component/Projects/Projects";
import Contact from "./component/Contact/constact";

// import heroImg from "./assets/hero.png";

function App() {
  return (
    <>
      <Nav />
      <Home />
      <About />
      <Projects />
      <Contact />
    </>
  );
}
export default App;
