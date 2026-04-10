import React from "react";
import con from "../../assets/contact.png";
import "./contact.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Contact() {
  useGSAP(() => {
    gsap.from(".leftcontact img", {
      x: -100,
      duration: 1,
      opacity: 0,
      stagger: 1,
      scrollTrigger: {
        trigger: ".leftcontact img",
        scroll: "body",
        scrub: 2,
        start: "top 60%",
        end: "top 30%",
      },
    });

    gsap.from(".rightcontact", {
      x: 100,
      duration: 1,
      opacity: 0,
      stagger: 1,
      scrollTrigger: {
        trigger: ".rightcontact",
        scroll: "body",
        scrub: 2,
        start: "top 60%",
        end: "top 30%",
      },
    });
  });
  return (
    <div id="contact">
      <div className="leftcontact">
        <img src={con} alt="" />
      </div>
      <div className="rightcontact">
        <form action="https://formspree.io/f/mqeglpln" method="POST">
          <input type="text" placeholder="Name" name="Username" />
          <input type="email" placeholder="Email" name="Email" />
          <textarea
            name="message"
            id="textarea"
            placeholder="message me"
          ></textarea>
          <input type="submit" id="btn" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Contact;
