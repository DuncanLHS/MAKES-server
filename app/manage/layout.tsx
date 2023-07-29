import ManageNav from "@/components/ManageNav";

export default function ManageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ManageNav />
      {children}
    </>
  );
}
