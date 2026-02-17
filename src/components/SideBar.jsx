import React from 'react';
import { useNavigate } from 'react-router-dom'; // استيراد مهم للتنقل
import '../App.css';
import './SideBar.css'; 

function SideBar({ activePage, setActivePage, onLogout }) {
  const navigate = useNavigate(); // تفعيل هوك التنقل

  // دالة موحدة للتعامل مع التنقل
  const handleNavigation = (pageName, path) => {
    setActivePage(pageName); // 1. تحديث الحالة (لتلوين الزر وتغيير العنوان)
    navigate(path);          // 2. تغيير الرابط الفعلي (لفتح الصفحة المطلوبة)
  };

  return (
    <div className="sidebar-wrapper">
      
      {/* الشعار */}
      <div className="logo-container">
        <h1 className="logo-title">لَمّتنا 🌙</h1>
        <p className="logo-subtitle">منظم جمعات رمضان</p>
      </div>

      {/* القائمة */}
      <ul className="sidebar-nav">
        
        <li 
          className={activePage === 'dashboard' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('dashboard', '/dashboard')}
        >
          🏠 الرئيسية
        </li>

        <li 
          className={activePage === 'gatherings' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('gatherings', '/gatherings')}
        >
          🕌 العزائم والجمعات
        </li>

        <li 
          className={activePage === 'guests' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('guests', '/guests')}
        >
          👥 العائلة والضيوف
        </li>

        <li 
          className={activePage === 'foods' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('foods', '/foods')}
        >
          🥘 قائمة الطعام
        </li>

        <hr className="nav-divider" />
        <p className="nav-section-title">الروحانيات 📿</p>

        <li 
          className={activePage === 'prayers' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('prayers', '/prayers')}
        >
          🕰️ مواقيت الصلاة
        </li>

        <li 
          className={activePage === 'quran' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('quran', '/quran')}
        >
          📖 آيات قرآنية
        </li>

        <li 
          className={activePage === 'adhkar' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleNavigation('adhkar', '/adhkar')}
        >
          🤲 أذكار وأدعية
        </li>

      </ul>

      {/* زر تسجيل الخروج */}
      <div className="logout-section">
        <button 
          onClick={onLogout}
          className="logout-btn"
        >
          🚪 تسجيل الخروج
        </button>
      </div>

    </div>
  );
}

export default SideBar;