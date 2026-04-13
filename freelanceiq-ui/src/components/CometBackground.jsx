function CometBackground() {
  const comets = [
  { i: 0, duration: 14, delay: 0,  size: 130, top: -5,  left: 30,  dx: 1400,  dy: 800  },  // top → down-right
  { i: 1, duration: 18, delay: 9,  size: 120, top: 40,  left: -5,  dx: 1400,  dy: 400  },  // left → right
  { i: 2, duration: 16, delay: 5,  size: 125, top: -5,  left: 70,  dx: -1400, dy: 800  },  // top → down-left
  { i: 3, duration: 20, delay: 14, size: 120, top: 20,  left: 101, dx: -1400, dy: 600  },  // right side → left
]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {comets.map(({ i, duration, delay, size, top, left, dx, dy }) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            animation: `comet ${duration}s ${delay}s infinite linear`,
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
          }}
        >
          <svg
            viewBox="0 0 160 12"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id={`glow-${i}`}>
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* glowing head */}
            <circle
              cx="150" cy="6"
              r="4"
              fill="#a78bfa"
              opacity="0.1"
              filter={`url(#glow-${i})`}
            />
            <circle
              cx="150" cy="6"
              r="2"
              fill="white"
              opacity="0.1"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

export default CometBackground