// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
// Site title and description
export const SITE_TAB = "tusoar";
export const SITE_TITLE = "tusoar's blog";
export const SITE_DESCRIPTION = "tusoar's blog";
export const DATE_FORMAT = "Wed Sep 11 2024";

// User profile information
export const USER_NAME = "tusoar";
export const USER_AVATAR = "/avater.png";

// Server and transition settings
export const SERVER_URL = "https://tusoar.tech";

// Some informative text on the site
export const infoTest = {
  tag: "Tag: ",
  noTag: "untagged",
  tagCard: "Tags",
  tagPage: "Tag - ",
  noCategory: "uncategorized",
  categoryCard: "Categories",
  categoryPage: "Category - ",
  link: "Link: ",
  prevPage: "Recent posts",
  nextPage: "Older posts",
};

// Menu items for navigation
export const menuItems = [
  { id: "home", text: "Home", href: "/", svg: "home", target: "_self" }, // Home page
  { id: "about", text: "About", href: "/about", svg: "about", target: "_self" }, // About page
  {
    id: "blog",
    text: "Blogs",
    href: "/blog",
    svg: "blog",
    target: "_self",
    subItems: [
      {
        id: "all",
        text: "All blogs",
        href: "/blog",
        svg: "post",
        target: "_self",
      }, // All blog
      {
        id: "tech",
        text: "Tech blogs",
        href: "/blog/categories/tech",
        svg: "cube",
        target: "_self",
      }, // Technology category
      {
        id: "life",
        text: "Life blogs",
        href: "/blog/categories/life",
        svg: "heart",
        target: "_self",
      }, // Life category
    ],
  }
];

// Social media and contact icons
export const socialIcons = [
  {
    href: "https://x.com/soar_tu",
    ariaLabel: "twitter",
    title: "twitter",
    svg: "twitter",
  },
  {
    href: "https://github.com/tusoar",
    ariaLabel: "Github",
    title: "Github",
    svg: "github",
  },
  {
    href: "https://zeroday.hitcon.org/user/tusoar",
    ariaLabel: "Hitcon ZeroDay",
    title: "Hitcon ZeroDay",
    svg: "secret",
  }
];
