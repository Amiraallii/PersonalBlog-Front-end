import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";
import { useAuth } from "../../../context/AuthContext";
import { AuthService } from "../services";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
  });
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await AuthService.register(formData);
      if (data.success) {
        login(data.token, data.refreshToken);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      swal(
        "خطا",
        "ثبت‌نام با خطا مواجه شد. لطفاً مقادیر ورودی را بررسی کنید.",
        "error",
      );
    }
    navigate("/");
  };
  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg card p-6 rounded-xl border border-theme shadow-lg bg-[var(--surface)]">
        <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
          ثبت نام حساب جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">نام کامل</label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="علی محمدی"
              className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">پست الکترونیک</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">نام کاربری</label>
            <input
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              placeholder="username"
              className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">رمز عبور</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="*****"
                className="w-full bg-[var(--background)] text-theme border border-theme pr-4 pl-12 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
              <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-1"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" /> 
                ) : (
                  <EyeIcon className="h-5 w-5" /> 
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-[var(--primary-deep)] py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-[0_0_10px_rgba(0,188,212,0.3)]"
            >
              ثبت نام و ورود
            </button>
          </div>

          <p className="text-sm text-muted text-center pt-2">
            حساب کاربری دارید؟{" "}
            <Link
              to="/Login"
              className="text-[var(--accent)] hover:underline font-medium"
            >
              وارد شوید
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
