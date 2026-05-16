import { useEffect, useRef } from "react";

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(".reveal");
    if (!targets.length) return;

    const cleanup = (e) => {
      if (e.propertyName !== "opacity") return;
      const t = e.target;
      t.classList.remove("reveal", "revealed", "reveal-stagger");
      t.removeEventListener("transitionend", cleanup);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.addEventListener("transitionend", cleanup);
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, ...options }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return ref;
}
