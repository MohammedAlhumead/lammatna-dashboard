import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (email === "admin@hashplus.com" && password === "123456") {
            setIsLoggedIn(true);
            navigate("/dashboard");
        } else {
            setError("بيانات الدخول غير صحيحة");
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                
                <div className="login-header">
                    {/* تم إزالة الدائرة الخضراء والإبقاء على الهلال فقط */}
                    <div className="moon-icon">🌙</div>
                    <h2>لَمّتنا</h2>
                    <p>منظم جمعات رمضان</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <div className="input-wrapper">
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="admin@hashplus.com" 
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <div className="input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••" 
                                className="form-input"
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "إخفاء" : "إظهار"}
                            >
                                {showPassword ? "👁️‍🗨️" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        تسجيل الدخول 🚀
                    </button>
                </form>

                <div className="login-footer">
                    <p>برمجة وتطوير فريق لَمّتنا © 2025</p>
                </div>
            </div>
        </div>
    );
}

export default Login;