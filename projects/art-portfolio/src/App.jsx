import { createHashRouter, Outlet } from "react-router-dom";
import Header from "./components/Layout/Header.jsx";
import Footer from "./components/Layout/Footer.jsx";
import ScrollToTop from "./components/Shared/ScrollToTop.jsx";
import HomePage from "./pages/HomePage.jsx";
import PiecePage from "./pages/PiecePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
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
