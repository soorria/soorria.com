const LINKS = [
  {
    title: "projects",
    href: "/projects",
  },
  {
    title: "snippets",
    href: "/snippets",
  },
  {
    title: "blog",
    href: "/blog",
  },
  {
    title: <span className="header-art-link-text">art</span>,
    href: "/authentic-artistique-endevours",
  },
];

export function Nav() {
  return (
    <nav className="font-display flex space-x-1 sm:space-x-3 sm:text-lg">
      {LINKS.map(({ title, href }) => (
        <a
          key={href}
          href={href}
          className="focus-ring group border-drac-content hocus:bg-drac-base-light hocus:text-drac-pink relative overflow-hidden rounded-sm px-2 py-1 leading-none transition sm:px-3 sm:py-2"
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
