import Link from "next/link";

interface Breadcrumb {
  href: string;
  Title: string;
}

interface BreadCrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export default function BreadCrumbs({ breadcrumbs }: BreadCrumbsProps) {
  return (
    <ol className="flex items-center whitespace-nowrap mb-1">
      {breadcrumbs.map((breadcrumb, index) => (
        <li key={index} className="inline-flex items-center">
          {index < breadcrumbs.length - 1 ? (
            <Link
              className="flex items-center text-B3 text-gray-500 hover:text-white duration-300 focus:outline-none focus:text-active"
              href={breadcrumb.href}
            >
              {breadcrumb.Title}
            </Link>
          ) : (
            <Link
              className="flex items-center text-white font-semibold"
              href={breadcrumb.href}
            >
              {breadcrumb.Title}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <svg
              className="flex-shrink-0 size-5 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 13L10 3" stroke="currentColor"></path>
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}
