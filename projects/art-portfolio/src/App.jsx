import { createHashRouter, Outlet } from "react-router-dom";
import Header from "./components/Layout/Header.jsx";
import ScrollToTop from "./components/Shared/ScrollToTop.jsx";
import Analytics from "./components/Shared/Analytics.jsx";
import HomePage from "./pages/HomePage.jsx";
import PiecePage from "./pages/PiecePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Analytics />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2026 Regina Reynolds. 3D Artist &amp; Software Engineer.</p>
        <a href="https://reginareynolds.vercel.app" className="footer-link" target="_blank" rel="noopener noreferrer">Software Portfolio &rarr;</a>
      </footer>
    </>
  );
}

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/piece/:id", element: <PiecePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
