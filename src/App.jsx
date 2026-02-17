import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './App.custom.css';

import SideBar from './components/SideBar';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Gatherings from './components/Gatherings';
import Guests from './components/Guests';
import Foods from './components/Foods';
import PrayerTimes from './components/PrayerTimes';
import QuranPage from './components/QuranPage';
import AdhkarPage from './components/AdhkarPage';

import { gatheringsData, foodsData, contactsData } from './data/data';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const [gatherings, setGatherings] = useState(gatheringsData);
  const [guests, setGuests] = useState(contactsData);
  const [foods, setFoods] = useState(foodsData);

  // --- دوال الحذف ---
  const deleteGathering = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العزيمة؟")) {
      setGatherings(gatherings.filter((item) => item.id !== id));
    }
  };

  const deleteGuest = (id) => {
    if (window.confirm("هل تريد حذف هذا الضيف؟")) {
      setGuests(guests.filter((item) => item.id !== id));
    }
  };

  const deleteFood = (id) => {
    if (window.confirm("هل تريد حذف هذا الطبق؟")) {
      setFoods(foods.filter((item) => item.id !== id));
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // --- 🔥 دالة تسجيل الخروج الجديدة ---
  const handleLogout = () => {
    setIsLoggedIn(false); // هذا سيعيد التطبيق لحالة اللوجن فوراً
    setActivePage("dashboard"); // إعادة تعيين الصفحة
  };

  // الحالة 1: غير مسجل دخول
  if (!isLoggedIn) {
    return (
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // الحالة 2: مسجل دخول
  return (
    <Router>
      <div className={darkMode ? "app-layout dark-mode" : "app-layout"}>

        {/* 🔥 نمرر دالة الخروج للسايدبار */}
        <SideBar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />

        <main className="main-content" style={{ flex: 1, backgroundColor: darkMode ? '#2c3e50' : '#f4f6f9', padding: '20px', overflowY: 'auto' }}>

          <header className="app-main-header">
            <h2 style={{ color: darkMode ? '#ecf0f1' : '#2c3e50' }}>
              {activePage === 'dashboard' && '🏠 الرئيسية'}
              {activePage === 'gatherings' && '🕌 العزائم والجمعات'}
              {activePage === 'guests' && '👥 العائلة والضيوف'}
              {activePage === 'foods' && '🥘 قائمة الطعام'}
              {['prayers', 'quran', 'adhkar'].includes(activePage) && '📿 الروحانيات'}
            </h2>
            <button onClick={toggleDarkMode} className="theme-toggle-btn">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>
          </header>

          <div className="page-view">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard gatherings={gatherings} guests={guests} foods={foods} />} />
              <Route path="/gatherings" element={
                <Gatherings
                  gatherings={gatherings}
                  setGatherings={setGatherings}
                  deleteGathering={deleteGathering}
                  // 👇 الإضافات الجديدة المهمة جداً للربط
                  allGuests={guests}
                  allFoods={foods}
                />
              } />             <Route path="/guests" element={
                <Guests
                  guests={guests}
                  setGuests={setGuests} // 🔥 أضفنا هذا لتتمكن الصفحة من الإضافة والتعديل
                  deleteGuest={deleteGuest}
                />
              } />

              <Route path="/foods" element={
                <Foods
                  foods={foods}
                  setFoods={setFoods} // 🔥 أضفنا هذا لتتمكن الصفحة من الإضافة
                  deleteFood={deleteFood}
                />
              } />
              <Route path="/prayers" element={<PrayerTimes />} />
              <Route path="/quran" element={<QuranPage />} />
              <Route path="/adhkar" element={<AdhkarPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>

        </main>
      </div>
    </Router>
  );
}

export default App;