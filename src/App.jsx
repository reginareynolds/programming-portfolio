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
        <p>&copy; 2026 Regina Reynolds. Built with React &amp; Three.js.</p>
      </footer>
    </>
  );
}

export default App;
