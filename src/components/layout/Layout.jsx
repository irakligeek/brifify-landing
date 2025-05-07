import Footer from "./Footer";
import NavbarMain from "./NavbarMain";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 !z-50 bg-white border-b px-4 py-4">
        <NavbarMain />
      </div>

      <main>
        <div className="mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
