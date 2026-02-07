const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'Tutorials', path: '/tutorials' },
  { label: 'Forum', path: '/forum' },
  { label: 'Help', path: '/help' },
  { label: 'Media', path: '/media' },
  { label: 'Wiki', path: '/wiki' },
];

/**
 * TopMenu Component
 * Navigation menu that spans the entire width of the page
 */
export function TopMenu() {

  return (
    <nav className="top-menu">
      <div className="top-menu-container">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="top-menu-button"
            onClick={() => {
              // Navigation will be implemented in the future
              console.log(`Navigate to ${item.path}`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
