import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/data";

function DashboardLayout({setIsLoggedIn}) {
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
    setIsLoggedIn(false); // هذا السطر ضروري لإخبار التطبيق أنك خرجت
    navigate("/"); // التوجيه لصفحة اللوجن
  }
  return (
    <div className="layout">
      {showSidebar && (
        <Sidebar activePage={activePage} onPageChange={setActivePage} onLogout={handleLogout}/>
      )}

      <div className="main-area">
        <Header OnToggleSidebar={toggleSideBar} />
<MainContent activePage={activePage} products={products} setProducts={setProducts} />      </div>
    </div>
  );
}

export default DashboardLayout;
