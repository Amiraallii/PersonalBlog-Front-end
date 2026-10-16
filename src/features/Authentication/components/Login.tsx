
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg card p-6 rounded-xl border border-theme shadow-lg bg-[var(--surface)]">
        <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
          ورود به حساب
        </h2>

        <button
          type="button"
          onClick={login}
          disabled={isLoading}
          className="w-full bg-[var(--accent)] text-[var(--primary-deep)] py-2.5 rounded-lg text-sm font-bold disabled:opacity-50"
        >
          ورود با حساب کاربری
        </button>

        <p className="text-sm text-muted text-center pt-4">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/Register"
            className="text-[var(--accent)] hover:underline font-medium"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
