import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav/Nav.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Projects from "./components/Projects/Projects.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact.jsx";

function App() {
  return (
    <>
      <a href="#projects" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <p>&copy; 2026 Regina Reynolds. Software Engineer & 3D Artist.</p>
        <a href="https://reginareynolds.github.io/programming-portfolio/" className="footer-link" target="_blank" rel="noopener noreferrer">3D Art Portfolio &rarr;</a>
      </footer>
      <Analytics />
    </>
  );
}

export default App;
