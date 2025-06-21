import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const SvgIcon = ({ size = 24, className = "", ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 12h6" />
      <path d="M15 6h6" />
      <path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" />
      <path d="M3 18h18" />
      <path d="M3.92 11h6.16" />
    </svg>
  );
};

export default SvgIcon;
