function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">Martin OS</div>
      <nav aria-label="Primary">
        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#start">Get Started</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
