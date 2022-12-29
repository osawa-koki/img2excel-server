
type _Page = {
  name: string;
  path: string;
  is_active: boolean;
};

const _pages: _Page[] = [
  {
    name: "Home",
    path: "/",
    is_active: true,
  },
  {
    name: "About",
    path: "/about",
    is_active: true,
  },
];

const pages = _pages.filter((page) => page.is_active);

export default pages;
