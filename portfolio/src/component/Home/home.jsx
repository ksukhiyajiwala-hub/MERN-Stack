import React from "react";
import "./home.css";
import man from "../../assets/man.png";
import Typewriter from "typewriter-effect";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
function Home() {
  useGSAP(() => {
    let tl = gsap.timeline();
    tl.from(".line1", {
      y: 80,
      duration: 1,
      opacity: 0,
    });
    tl.from(".line2", {
      y: 80,
      duration: 1,
      opacity: 0,
    });
    tl.from(".line3", {
      y: 80,
      duration: 1,
      opacity: 0,
    });
    tl.from(".righthome img", {
      x: 200,
      duration: 1,
      opacity: 0,
    });
  });
  return (
    <div id="home">
      <div className="lefthome">
        <div className="homedetails">
          <div className="line1">I'M</div>
          <div className="line2">KARTIK SUKHIYAJIWALA</div>
          <div className="line3">
            <Typewriter
              options={{
                strings: [
                  "WEB DEVELOPER",
                  "SOFTWARE DEVELOPER",
                  "APPLICATION DEVELOPER",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
          <button>HIRE ME</button>
        </div>
      </div>
      <div className="righthome">
        <img src={man} alt="" />
      </div>
    </div>
  );
}

export default Home;
