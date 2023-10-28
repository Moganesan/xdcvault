"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useMemo, ReactNode } from "react";
import {
  HomeIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ArrowPathRoundedSquareIcon,
  Bars2Icon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
type MenuItem = {
  id: number;
  label: string;
  icon?: any;
  link: string;
};

const menuItems = [
  { id: 1, label: "Dashboard", icon: HomeIcon, link: "/" },
  { id: 2, label: "Sent", icon: MinusCircleIcon, link: "/sent" },
  { id: 3, label: "Receive", icon: PlusCircleIcon, link: "/receive" },
  { id: 4, label: "Swap", icon: ArrowPathRoundedSquareIcon, link: "/swap" },
  { id: 5, label: "Settings", icon: Cog6ToothIcon, link: "/settings" },
];

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const pathname = usePathname();

  const activeMenu: MenuItem | undefined = useMemo(
    () => menuItems.find((menu) => menu.link === pathname),
    [pathname]
  );

  const wrapperClasses = classNames(
    "h-screen bg-slate-900 px-4 pt-8 pb-4 bg-light flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (menu: MenuItem) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu?.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <div className="flex items-center">
              <div>
                <h1>XDC</h1>
              </div>
            </div>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <ChevronDoubleLeftIcon className="w-7 h-7 text-slate-500" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            return (
              <div key={menu.id} className={classes}>
                <Link
                  href={menu.link}
                  className="flex hover:bg-slate-800 text-white py-4 px-3 items-center w-full h-full"
                >
                  <div style={{ width: "2.5rem" }}>
                    <Icon
                      className={`w-7 h-7 ${
                        menu.link === pathname
                          ? "text-blue-500"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  {!toggleCollapse && (
                    <span
                      className={classNames(
                        `text-md font-medium ${
                          menu?.link === pathname
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`
                      )}
                    >
                      {menu.label}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className={`px-3 py-4`}>
        <div style={{ width: "2.5rem" }}>
          <LogoutIcon />
        </div>
        {!toggleCollapse && (
          <span className={classNames("text-md font-medium text-text-light")}>
            Logout
          </span>
        )}
      </div> */}
    </div>
  );
};

export default Sidebar;
