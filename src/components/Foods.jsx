import React, { useState } from 'react';
import './Foods.css';

function Foods({ foods, setFoods, deleteFood }) {
  const [showForm, setShowForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", type: "رئيسي", icon: "🥘" });

  // قائمة الأيقونات المقترحة
  const icons = ["🥘", "🍗", "🥩", "🥗", "🍲", "🍚", "🍕", "🥪", "🍩", "🍪", "🍮", "🍰", "☕", "🧃", "🧊"];

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name) return;

    const foodItem = {
      id: Date.now(), // إنشاء ID فريد
      ...newFood
    };

    setFoods([...foods, foodItem]); // تحديث القائمة الرئيسية
    setNewFood({ name: "", type: "رئيسي", icon: "🥘" }); // تصفير النموذج
    setShowForm(false); // إغلاق النموذج
  };

  return (
    <div className="page-container">
      <div className="foods-page-header">
        <h2>🥘 قائمة الطعام الرمضانية</h2>
        <button 
          className="foods-add-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ إغلاق' : '+ إضافة طبق جديد'}
        </button>
      </div>

      {/* نموذج الإضافة */}
      {showForm && (
        <div className="add-form">
          <h3 className="form-title">✨ إضافة صنف جديد</h3>
          <form onSubmit={handleAddFood} className="form-container">
            <div className="form-field">
              <label className="form-label">اسم الطبق</label>
              <input 
                type="text" 
                placeholder="مثال: سمبوسة..." 
                value={newFood.name}
                onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">النوع</label>
              <select 
                value={newFood.type}
                onChange={(e) => setNewFood({...newFood, type: e.target.value})}
                className="form-input"
              >
                <option value="رئيسي">رئيسي</option>
                <option value="مقبلات">مقبلات</option>
                <option value="حلويات">حلويات</option>
                <option value="مشروبات">مشروبات</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">الأيقونة</label>
              <select 
                value={newFood.icon}
                onChange={(e) => setNewFood({...newFood, icon: e.target.value})}
                className="form-input icon-select"
              >
                {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>

            <button type="submit" className="form-submit-btn add">
              ✓ حفظ
            </button>
          </form>
        </div>
      )}

      {/* عرض الكروت */}
      <div className="foods-cards-grid">
        {foods.map((food) => (
          <div key={food.id} className="food-card">
            <div className="food-icon">{food.icon}</div>
            <h3 className="food-name">{food.name}</h3>
            <span className={`food-type-badge food-type-${food.type === 'رئيسي' ? 'main' : food.type === 'مقبلات' ? 'appetizer' : food.type === 'حلويات' ? 'sweets' : 'drinks'}`}>
              {food.type}
            </span>
            <button 
              onClick={() => deleteFood(food.id)}
              className="food-delete-btn"
            >
              🗑️ حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Foods;