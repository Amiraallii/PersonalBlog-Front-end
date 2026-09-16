import React, { useState, type FormEvent } from "react";
import { projectService } from "../services";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import LocationPicker from "../../../components/Location/LocationPicker";
import type { RequestProjectDTO } from "../types";

const ProjectRequestForm = () => {
  const [formData, setFormData] = useState<RequestProjectDTO>({
    title: "",
    summary: "",
    location: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await projectService.request(formData);
      navigate("/Projects");
    } catch (error) {
      swal("خطا", "خطا در سرور", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex justify-center mt-10 pb-10">
        <div className="w-full max-w-4xl card p-6 rounded-xl border border-theme shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
            درخواست ثبت پروژه
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted pr-1">عنوان پروژه</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="شبکه اجتماعی فرهنگی برای حفظ و گسترش فرهنگ"
                  className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted pr-1">لوکیشن</label>
                <LocationPicker
                  value={formData.location}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: val,
                    }))
                  }
                  showRadius={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted pr-1">شماره تماس</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09120252152"
                  className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-[var(--accent)] text-[var(--primary-deep)] py-3 rounded-lg text-base font-bold hover:bg-opacity-90 transition shadow-[0_0_15px_rgba(0,188,212,0.4)] flex justify-center items-center gap-2 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-b-[var(--primary-deep)] border-l-[var(--primary-deep)]"></div>
                    <span>درحال ثبت ...</span>
                  </>
                ) : (
                  "ثبت درخواست"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ProjectRequestForm;
