# Laxmi Electronics - React Website

A modern, responsive React website built with Tailwind CSS for Laxmi Electronics.

## Features

- ⚛️ React 18 with Vite
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🧭 Navigation menu with dropdown submenus
- 🚀 Fast development experience

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   └── Navigation.jsx    # Navigation menu component
  ├── pages/
  │   ├── Home.jsx
  │   ├── AboutUs.jsx
  │   ├── MoldMaking.jsx
  │   └── ...               # Other page components
  ├── App.jsx               # Main app component with routing
  ├── main.jsx              # Entry point
  └── index.css             # Global styles with Tailwind
```

## Navigation Menu

The navigation includes:
- Home
- About Us
- Mold Making
- Molding (with submenu: Thermoplastic, Medical, Aerospace, ISBM)
- Silicone Molding (with submenu: LSR, HCR, 2K)
- Assembly Services
- Contact Us
- Gallery

## Responsive Design

The website is fully responsive and works on:
- Mobile devices
- Tablets
- Desktop computers

The navigation menu automatically adapts to screen size with a mobile hamburger menu.

