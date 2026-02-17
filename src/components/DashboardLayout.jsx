import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// لاحظ: قمنا بإزالة .. لأن الملفات بجانبنا في نفس المجلد
import Sidebar from "./SideBar";
import Header from "./Header";
import MainContent from "./MainContent";
import { productsData } from "../data/data"; // البيانات موجودة في مجلد سابق لذا نبقي النقطتين

function DashboardLayout({ setIsLoggedIn }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : productsData;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  function toggleSideBar() {
    setShowSidebar(!showSidebar);
  }

  function handleLogout() {
    // أهم نقطة: تغيير حالة الدخول للخروج
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <div className="layout">
      {showSidebar && (
        <Sidebar 
          activePage={activePage} 
          onPageChange={setActivePage} 
          onLogout={handleLogout}
        />
      )}

      <div className="main-area">
        <Header OnToggleSidebar={toggleSideBar} />
        {/* نمرر المنتجات للمحتوى الرئيسي ليعرضها */}
        <MainContent 
            activePage={activePage} 
            products={products} 
            setProducts={setProducts} 
        />
      </div>
    </div>
  );
}

export default DashboardLayout;