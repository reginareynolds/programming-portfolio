import { useState, useLayoutEffect, useRef } from "react";

export default function useGridColumns() {
  const ref = useRef(null);
  const [columns, setColumns] = useState(1);

  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    function measure() {
      const children = grid.children;
      if (children.length < 2) {
        setColumns(1);
        return;
      }
      const firstTop = children[0].offsetTop;
      let cols = 1;
      for (let i = 1; i < children.length; i++) {
        if (Math.abs(children[i].offsetTop - firstTop) < 1) {
          cols++;
        } else {
          break;
        }
      }
      setColumns(cols);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  return [ref, columns];
}
