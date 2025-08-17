import { useEffect, useRef } from "react";
import "./CustomCursor.css";
export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const ease = 0.35;

    const move = () => {
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) rotate(-125deg)`;
      requestAnimationFrame(move);
    };
    move();

    const handleMouseMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleClick = () => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = mouseX + "px";
      ripple.style.top = mouseY + "px";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef}>
      {/* Custom SVG cursor (paper-plane style) */}
      <svg viewBox="0 0 24 24" fill="black">
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
      </svg>
    </div>
  );
}
