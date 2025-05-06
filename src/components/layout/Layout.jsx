import NavbarMain from "./NavbarMain";

export default function Layout({ children }) {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 !z-50 bg-white border-b px-4 py-4">
        <NavbarMain />
      </div>
      
      <main className={`min-w-0 p-6 mt-16`}>
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
