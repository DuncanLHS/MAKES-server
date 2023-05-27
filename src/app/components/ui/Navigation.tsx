"use client";
import { Dropdown, Avatar, Navbar } from "flowbite-react";
import { type FC } from "react";

const Navigation: FC = () => {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite.com/">
        {/* <img
          alt="Flowbite Logo"
          className="mr-3 h-6 sm:h-9"
          src="https://flowbite.com/docs/images/logo.svg"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          MAKES
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>My Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active href="/">
          Home
        </Navbar.Link>
        <Navbar.Link href="/">{"Who's In"}</Navbar.Link>
        <Navbar.Link href="/">Machine Time</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
