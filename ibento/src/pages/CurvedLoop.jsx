import { useRef, useEffect, useState, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  logos = [], 
  speed = 0.5,
  curveAmount = 140,
  logoSize = 80
}) => {
  const [offset, setOffset] = useState(0);
  const requestRef = useRef();
  const uid = useId();
  const pathId = `curve-${uid}`;
  
  // Path starts at -5% and ends at 105% to hide the 'entry' and 'exit'
  const pathD = `M -100,100 Q 720,${100 + curveAmount} 1540,100`;

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => (prev + speed) % 100);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  return (
    <div className="curved-loop-jacket logo-mode">
      {/* We use 1440 as the standard internal width for the SVG */}
      <svg className="curved-loop-svg" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        
        {logos.map((logoUrl, i) => {
          const distance = (i * (100 / logos.length) + offset) % 100;

          return (
            <image
              key={i}
              href={logoUrl}
              width={logoSize}
              height={logoSize}
              style={{
                offsetPath: `path('${pathD}')`,
                offsetDistance: `${distance}%`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
                translate: `-${logoSize / 2}px -${logoSize / 2}px` 
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default CurvedLoop;