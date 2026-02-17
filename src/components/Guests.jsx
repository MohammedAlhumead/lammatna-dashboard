import React, { useState } from 'react';
import './Guests.css';

function Guests({ guests, setGuests, deleteGuest }) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // لمعرفة هل نحن في وضع إضافة أم تعديل
  const [currentId, setCurrentId] = useState(null); // ID الشخص المراد تعديله
  const [formData, setFormData] = useState({ name: "", phone: "" });

  // دالة الحفظ (تتعامل مع الإضافة والتعديل معاً)
// دالة الحفظ (تتعامل مع الإضافة والتعديل معاً)
  const handleSaveGuest = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // رابط الصورة الجديد بناءً على الاسم المدخل
    const newImage = `https://ui-avatars.com/api/?name=${formData.name}&background=random`;

    if (isEditing) {
      // --- منطق التعديل (تم إصلاح الصورة هنا) ---
      const updatedGuests = guests.map(guest => 
        guest.id === currentId ? { 
            ...guest, 
            name: formData.name, 
            phone: formData.phone, 
            img: newImage // 🔥 تحديث الصورة فوراً مع الاسم الجديد
        } : guest
      );
      setGuests(updatedGuests);
      setIsEditing(false);
    } else {
      // --- منطق الإضافة ---
      const newGuest = {
        id: Date.now(),
        ...formData,
        img: newImage
      };
      setGuests([...guests, newGuest]);
    }

    // تنظيف النموذج
    setFormData({ name: "", phone: "" });
    setShowForm(false);
  };

  // دالة فتح وضع التعديل
  const startEdit = (guest) => {
    setFormData({ name: guest.name, phone: guest.phone });
    setCurrentId(guest.id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="page-container">
      <div className="guests-page-header">
        <h2>👥 دليل العائلة والضيوف</h2>
        <button 
          className="guests-add-btn" 
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setFormData({ name: "", phone: "" });
          }}
        >
          {showForm ? '❌ إغلاق' : '+ إضافة شخص جديد'}
        </button>
      </div>

      {/* نموذج الإضافة / التعديل */}
      {showForm && (
        <div className="add-form">
          <h3 className="form-title">
            {isEditing ? '✏️ تعديل بيانات' : '👤 إضافة شخص جديد'}
          </h3>
          <form onSubmit={handleSaveGuest} className="form-container">
            <div className="form-field">
              <label className="form-label">الاسم</label>
              <input 
                type="text" 
                placeholder="مثال: أحمد محمد" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">رقم الجوال</label>
              <input 
                type="text" 
                placeholder="05xxxxxxxx" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <button type="submit" className={`form-submit-btn ${isEditing ? 'edit' : 'add'}`}>
              {isEditing ? 'حفظ التعديلات' : 'إضافة'}
            </button>
          </form>
        </div>
      )}

      {/* قائمة الضيوف */}
      <div className="guests-cards-grid">
        {guests.map((guest) => (
          <div key={guest.id} className="guest-card">
            <img 
  src={guest.img} 
  onError={(e) => { 
    e.target.onerror = null; 
    e.target.src = `https://ui-avatars.com/api/?name=${guest.name}&background=random`;
  }}
  alt={guest.name} 
  className="guest-avatar"
/>
            <h3 className="guest-name">{guest.name}</h3>
            <p className="guest-phone">📞 {guest.phone}</p>
            
            <div className="guest-card-buttons">
              <button 
                onClick={() => startEdit(guest)}
                className="btn-edit"
              >
                تعديل ✏️
              </button>
              <button 
                onClick={() => deleteGuest(guest.id)}
                className="btn-delete"
              >
                حذف 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guests;