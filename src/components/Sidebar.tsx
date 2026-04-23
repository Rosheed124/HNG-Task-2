import React, { useContext } from 'react';
import './Sidebar.css';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import avatarImg from '../../image/avatar.jpg';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="sidebar">
      <div className="logo-container">
        {/* Pacman facing up — circle with top wedge opening */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/*
            Circle center: (20, 20), radius: 16
            Mouth opens at top: ±30° from 12 o'clock
            Right mouth point: (28, 6.14)
            Left mouth point:  (12, 6.14)
            Arc goes the long way (large-arc=1) clockwise from right → around bottom → to left
            Then line to center to close the wedge
          */}
          <path
            d="M28 6.14 A16 16 0 1 1 12 6.14 L20 20 Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="avatar-container">
          <img src={avatarImg} alt="User Avatar" className="avatar" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
