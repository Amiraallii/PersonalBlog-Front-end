
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Register = () => {
  const { register, isLoading } = useAuth();

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg card p-6 rounded-xl border border-theme shadow-lg bg-[var(--surface)]">
        <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
          ثبت‌نام حساب جدید
        </h2>

        <button
          type="button"
          onClick={register}
          disabled={isLoading}
          className="w-full bg-[var(--accent)] text-[var(--primary-deep)] py-2.5 rounded-lg text-sm font-bold disabled:opacity-50"
        >
          ثبت‌نام در PersonalBlog
        </button>

        <p className="text-sm text-muted text-center pt-4">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            to="/Login"
            className="text-[var(--accent)] hover:underline font-medium"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
