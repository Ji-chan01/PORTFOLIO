import { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Mounts its (React.lazy) children only when the wrapper nears the viewport,
 * so heavy chunks such as three.js are downloaded on demand, not at page load.
 * `eager` skips the viewport check but still lets the chunk load after first paint.
 */
export default function LazyMount({ children, eager = false, rootMargin = '600px', className, style }) {
  const ref = useRef(null);
  const [show, setShow] = useState(eager || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (show || !el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShow(true);
        io.disconnect();
      }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className} style={style}>
      {show && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
}
