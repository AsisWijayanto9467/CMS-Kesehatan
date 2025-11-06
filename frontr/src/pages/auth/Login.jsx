import { useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3b82f6',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });
  }

  const showSuccessAlert = () => {
    return Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Redirecting to dashboard...',
      showConfirmButton: false,
      timer: 1500,
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });
  }

  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Signing in...',
      text: 'Please wait while we authenticate your credentials.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: 'fff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if(!email || !password) {
      showErrorAlert("Tolong isi semua Input.");
      setIsLoading(false);
      return;
    }

    const emailRagex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRagex.test(email)) {
      showErrorAlert("Tolong masukan alamat email yang Valid");
      setIsLoading(false);
      return;
    }


    try {
      showLoadingAlert();

      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      Swal.close();

      login(res.data); // Save token/user to context

      await showSuccessAlert();

      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } catch (err) {
      Swal.close();

      const errorMessage = err.response?.data?.message || "Invalid email or password";
      showErrorAlert(errorMessage);
      console.error(err);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const showDemoCredentials = () => {
    Swal.fire({
      title: 'Demo Credentials',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> password</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-800 font-['Inter']">
      {/* Main Login Container */}
      <div className="login-container w-full max-w-md mx-4">
        <div className="login-card p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-tachometer-alt text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 logo-glow">
              Admin<span className="text-blue-600">LTE</span>
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                placeholder=" "
                required
              />
              <label className="floating-label absolute left-4 top-3 text-gray-500 bg-transparent pointer-events-none transition-all duration-300">
                <i className="fas fa-envelope mr-2"></i>Email Address
              </label>
              <div className="absolute right-3 top-3 text-gray-400">
                <i className="fas fa-envelope"></i>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                placeholder=" "
                required
              />
              <label className="floating-label absolute left-4 top-3 text-gray-500 bg-transparent pointer-events-none transition-all duration-300">
                <i className="fas fa-lock mr-2"></i>Password
              </label>
              <div 
                className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-200"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-login w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-blue-500 to-blue-700"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Button */}
          <div className="mt-6 text-center">
            <button
              onClick={showDemoCredentials}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <i className="fas fa-info-circle mr-2"></i>
              View Demo Credentials
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="text-xs text-gray-500">
              &copy; 2024 AdminLTE. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .logo-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        
        .form-input:focus + .floating-label,
        .form-input:not(:placeholder-shown) + .floating-label {
          transform: translateY(-28px) scale(0.85);
          color: #3b82f6;
          background: white;
          padding: 0 8px;
          margin-left: -8px;
        }
      `}</style>
    </div>
  );
}
