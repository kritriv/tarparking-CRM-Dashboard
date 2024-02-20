import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const generateBreadcrumbs = (location) => {
  const segments = location.pathname.split("/").filter(Boolean);
  const newBreadcrumbItems = segments.map((segment, index) => ({
    title: (
      <Link to={"/" + segments.slice(0, index + 1).join("/")}>
        {segment.charAt(0).toUpperCase() + segment.slice(1)}
      </Link>
    ),
  }));
  if (
    newBreadcrumbItems.length === 0 &&
    (location.pathname === "/" || location.pathname === "")
  ) {
    newBreadcrumbItems.push({
      title: (
        <Link to="/">
          <AiOutlineHome />
        </Link>
      ),
    });
  }
  return newBreadcrumbItems;
};
export default generateBreadcrumbs;
