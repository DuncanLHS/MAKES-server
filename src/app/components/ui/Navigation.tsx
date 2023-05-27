"use client";
import { Dropdown, Avatar, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

const Navigation: FC = () => {
  const router = useRouter();
  const { data } = useSession();
  if (!data) return null;
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
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
            <Avatar alt="User settings" img={data?.user.image ?? ""} rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {data?.user.nick ?? data?.user.name}
            </span>
            <span className="block truncate text-sm font-medium">
              {data?.user?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => router.push("/profile")}>
            My Profile
          </Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => void signOut({ callbackUrl: "/" })}>
            Sign out
          </Dropdown.Item>
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
