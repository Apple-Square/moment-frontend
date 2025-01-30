import React from "react";

interface SvgMenuProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const SvgMenu: React.FC<SvgMenuProps> = ({ size = 24, color = "black", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="style=fill">
        <g id="menu-meatballs">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.75 12C2.75 10.7574 3.75736 9.75 5 9.75C6.24264 9.75 7.25 10.7574 7.25 12C7.25 13.2426 6.24264 14.25 5 14.25C3.75736 14.25 2.75 13.2426 2.75 12Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.75 12C16.75 10.7574 17.7574 9.75 19 9.75C20.2426 9.75 21.25 10.7574 21.25 12C21.25 13.2426 20.2426 14.25 19 14.25C17.7574 14.25 16.75 13.2426 16.75 12Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export default SvgMenu;
