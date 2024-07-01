import {
  Breadcrumbs as NextBreadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = ({ className = "" }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const dashboardIndex = pathnames.indexOf("dashboard");
  const relevantPathnames = pathnames.slice(dashboardIndex);

  return (
    <div className={className}>
      <NextBreadcrumbs>
        {relevantPathnames.map((value, index) => {
          const to = `/${relevantPathnames.slice(0, index + 1).join("/")}`;
          return (
            <BreadcrumbItem key={to}>
              <Link to={to}>
                {value.charAt(0).toUpperCase() +
                  value.slice(1).replace(/-/g, " ")}
              </Link>
            </BreadcrumbItem>
          );
        })}
      </NextBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
