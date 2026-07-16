import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function record(path, attempt = 0) {
  if (window.goatcounter?.count) {
    window.goatcounter.count({ path });
  } else if (attempt < 10) {
    // count.js loads async; the first pageview can beat it
    setTimeout(() => record(path, attempt + 1), 500);
  }
}

function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    record(pathname);
  }, [pathname]);

  return null;
}

export default Analytics;
