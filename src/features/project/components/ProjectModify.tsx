import { useState, type FormEvent } from "react";
import { projectService } from "../services";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import { DateObject } from "react-multi-date-picker";
import Gregorian from "react-date-object/calendars/gregorian";
import type { CreateProjectDTO } from "../types"; 
import JalaliDatePicker from "../../../components/JalaliDatePicker";

const ProjectInputForm = () => {
  const [formValues, setFormValues] = useState<CreateProjectDTO>({
    title: "",
    summary: "",
    owner: "",
    link: "",
    startDate: new DateObject().convert(Gregorian).format("YYYY-MM-DD"),
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
const handleDateChange = (name: string, value: string) => {
  setFormValues((prev) => ({ ...prev, [name]: value || null }));
};
  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await projectService.create(formValues);
      navigate("/Projects");
    } catch (error) {
      console.error(error);
      swal("خطا", "خطا در سرور", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10 pb-10">
      <div className="w-full max-w-4xl card p-6 rounded-xl border border-theme shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
          ثبت پروژه جدید (پنل ادمین)
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">عنوان پروژه</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="چروندکلاب"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">خلاصه پروژه</label>
              <input
                type="text"
                name="summary"
                value={formValues.summary}
                onChange={handleChange}
                placeholder="شبکه اجتماعی فرهنگی"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">کارفرما</label>
              <input
                type="text"
                name="owner"
                value={formValues.owner}
                onChange={handleChange}
                placeholder="AnarchyCoders"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">لینک پروژه</label>
              <input
                type="text"
                name="link"
                value={formValues.link}
                onChange={handleChange}
                placeholder="charvandclub.com"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <JalaliDatePicker
                label="تاریخ شروع پروژه"
                name="startDate"
                value={formValues.startDate}
                onChange={(e: any) => handleDateChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <JalaliDatePicker
                label="تاریخ پایان پروژه"
                name="endDate"
                value={formValues.endDate || ""}
                onChange={(e: any) => handleDateChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-[var(--accent)] text-[var(--primary-deep)] py-3 rounded-lg text-base font-bold hover:bg-opacity-90 transition shadow-[0_0_15px_rgba(0,188,212,0.4)] flex justify-center items-center gap-2 w-full ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-b-[var(--primary-deep)] border-l-[var(--primary-deep)]"></div>
                  <span>درحال ثبت ...</span>
                </>
              ) : (
                "ثبت نهایی پروژه"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectInputForm;
