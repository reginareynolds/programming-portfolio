import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.__skipScrollToTop) {
      window.__skipScrollToTop = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
