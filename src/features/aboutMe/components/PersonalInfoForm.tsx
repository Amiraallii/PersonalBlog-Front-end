import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AboutMeService } from "../services";
import type { PersonalInfo, ContactInfo } from "../types";
import { LocationPicker, parseLocation } from "../../../components/Location";

const contactWayTypes = [
  { value: 0, label: "شماره تماس" },
  { value: 1, label: "Address" },
  { value: 2, label: "LinkedIn" },
  { value: 3, label: "Telegram" },
  { value: 4, label: "WhatsApp" },
  { value: 5, label: "Instagram" },
  { value: 6, label: "Twitter" },
  { value: 7, label: "Email" },
  { value: 8, label: "Location" },
];

export default function PersonalInfoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState<PersonalInfo>({
    name: "",
    lastName: "",
    jobTitle: "",
    aboutMe: "",
    contactInfo: [],
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await AboutMeService.get();
        if (data) {
          setFormData({
            name: data.name || "",
            lastName: data.lastName || "",
            jobTitle: data.jobTitle || "",
            aboutMe: data.aboutMe || "",
            contactInfo: data.contactInfo || [],
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPersonalInfo();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (
    index: number,
    field: keyof ContactInfo,
    value: any,
  ) => {
    const updatedContacts = [...formData.contactInfo];
    if (field === "contactWayType") {
      updatedContacts[index] = {
        contactWayType: value,
        contactWay: "",
      };
    } else {
      updatedContacts[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, contactInfo: updatedContacts }));
  };

  const addContactInfo = () => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: [...prev.contactInfo, { contactWayType: 0, contactWay: "" }],
    }));
  };

  const removeContactInfo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AboutMeService.modify(formData);
      toast.success("اطلاعات با موفقیت ذخیره شد");
      navigate("/AboutMe");
    } catch (error) {
      console.error(error);
      toast.error("خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-[var(--surface)] rounded-lg shadow-lg p-6 border border-[var(--border)]">
        <h1 className="text-2xl font-bold mb-6 text-[var(--text)]">
          اطلاعات شخصی
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">نام</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">نام خانوادگی</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">عنوان شغلی</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted pr-1">درباره من</label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleInputChange}
              required
              disabled={loading}
              rows={6}
              className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-muted pr-1">اطلاعات تماس</label>
              <button
                type="button"
                onClick={addContactInfo}
                disabled={loading}
                className="px-4 py-2 bg-[var(--accent)] text-[var(--primary-deep)] rounded-lg hover:opacity-90 font-bold text-sm"
              >
                + مورد جدید
              </button>
            </div>

            {formData.contactInfo.map((contact, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]"
              >
                <div className="md:col-span-4 flex flex-col gap-2">
                  <label className="text-xs text-muted pr-1">نوع تماس</label>
                  <select
                    value={contact.contactWayType}
                    onChange={(e) =>
                      handleContactChange(
                        index,
                        "contactWayType",
                        parseInt(e.target.value),
                      )
                    }
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none"
                  >
                    {contactWayTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        className="bg-[var(--surface)]"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-7 flex flex-col gap-2">
                  <label className="text-xs text-muted pr-1">مقدار</label>
                  {contact.contactWayType === 8 ? (
                    (() => {
                      let centerCoords: [number, number] = [35.6892, 51.389];

                      if (contact.contactWay) {
                        const parsed = parseLocation(contact.contactWay);
                        if (parsed) {
                          centerCoords = [parsed.lat, parsed.lng];
                        }
                      }

                      return (
                        <LocationPicker
                          value={contact.contactWay}
                          onChange={(val) =>
                            handleContactChange(index, "contactWay", val)
                          }
                          defaultCenter={centerCoords} 
                          defaultZoom={contact.contactWay ? 14 : 11}
                        />
                      );
                    })()
                  ) : (
                    <input
                      type="text"
                      value={contact.contactWay}
                      onChange={(e) =>
                        handleContactChange(index, "contactWay", e.target.value)
                      }
                      required
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none w-full"
                    />
                  )}
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeContactInfo(index)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-bold"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[var(--accent)] text-[var(--primary-deep)] rounded-lg font-bold flex items-center justify-center"
            >
              ثبت اطلاعات
            </button>
            <button
              type="button"
              onClick={() => navigate("/AboutMe")}
              className="flex-1 px-6 py-3 bg-transparent border border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-[var(--surface)]"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
