import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import DateObject from "react-date-object";
import Gregorian from "react-date-object/calendars/gregorian";

import { PostService } from "../services";
import { POST_CONTENT_TYPES } from "../constants/postContentTypes";
import { usePostForm } from "../hooks/usePostForm";

import type { PostContentFormState } from "../types/postContent";

import JalaliDatePicker from "../../../components/JalaliDatePicker";

const PostInputForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);

  const {
    title,
    setTitle,
    summary,
    setSummary,
    publishDate,
    setPublishDate,
    coverImage,
    setCoverImage,
    coverImageAddress,
    postContents,
    addContent,
    removeContent,
    updateContent,
    initialize,
  } = usePostForm();

  useEffect(() => {
    if (!id) {
      setPublishDate(new DateObject().convert(Gregorian).format("YYYY-MM-DD"));

      return;
    }

    const fetchPost = async (postId: string) => {
      setIsLoading(true);

      try {
        const response = await PostService.getById(postId);

        initialize({
          title: response.title,
          summary: response.summary,
          publishDate: response.publishDate
            ? response.publishDate.split("T")[0]
            : "",
          coverImageAddress: response.coverImageAddress,
          postContents:
            response.postContents?.map((block, index) => ({
              clientId: crypto.randomUUID(),
              id: block.id,
              content: block.content ?? "",
              contentType: block.contentType,
              order: index,
              media: null,
              mediaAddress: block.mediaAddress ?? null,
            })) ?? [],
        });
      } catch (error) {
        console.error(error);

        swal("خطا", "خطا در دریافت اطلاعات پست", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost(id);
  }, [id, initialize, setPublishDate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = {
        title,
        summary,
        publishDate,
        coverImage,
        coverImageAddress,
        postContents,
      };

      if (id) {
        await PostService.update(id, postData);

        swal("موفق", "پست با موفقیت ویرایش شد", "success");
      } else {
        await PostService.create(postData);

        swal("موفق", "پست با موفقیت ثبت شد", "success");
      }

      navigate("/Posts");
    } catch (error) {
      console.error(error);

      swal("خطا", "خطا در برقراری ارتباط با سرور دات‌نت", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10 pb-10">
      <div className="w-full max-w-4xl card p-6 rounded-xl border border-theme shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-[var(--accent)] text-center border-b border-theme pb-4">
          {id ? "ویرایش پست" : "ثبت پست جدید"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* اطلاعات اصلی پست */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* عنوان */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">عنوان پست</label>

              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلا: آموزش ری‌اکت"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>

            {/* تاریخ انتشار */}
            <div className="flex flex-col gap-2">
              <JalaliDatePicker
                label="تاریخ انتشار"
                name="publishDate"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>

            {/* خلاصه */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-muted pr-1">خلاصه مطلب</label>

              <textarea
                name="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="این یک آموزش اولیه است"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors min-h-[120px] resize-y"
                required
              />
            </div>

            {/* تصویر کاور */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-muted pr-1">تصویر کاور</label>

              <input
                type="file"
                name="coverImage"
                onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                className="bg-[var(--background)] text-theme border border-theme px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--primary-deep)] hover:file:bg-opacity-80 cursor-pointer"
                required={!id}
              />

              {/* نمایش آدرس کاور قبلی در حالت ویرایش */}
              {id && coverImageAddress && (
                <span className="text-xs text-muted">
                  تصویر کاور فعلی حفظ می‌شود مگر اینکه تصویر جدیدی انتخاب کنید.
                </span>
              )}
            </div>
          </div>

          {/* بخش‌های محتوای پست */}
          <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-xl border border-theme">
            <div className="flex justify-between items-center border-b border-theme pb-4 mb-6">
              <h3 className="text-lg font-bold text-[var(--accent)]">
                بخش‌های محتوای پست
              </h3>

              <button
                type="button"
                onClick={addContent}
                className="bg-[var(--accent)] text-[var(--primary-deep)] px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-[0_0_10px_rgba(0,188,212,0.3)]"
              >
                + افزودن محتوای جدید
              </button>
            </div>

            <div className="space-y-6">
              {postContents.length === 0 && (
                <p className="text-center text-muted py-4 text-sm">
                  هنوز هیچ محتوایی اضافه نشده است. روی دکمه افزودن کلیک کنید.
                </p>
              )}

              {postContents.map((block: PostContentFormState, index) => (
                <div
                  key={block.clientId}
                  className="p-5 border border-[var(--border)] rounded-lg bg-[var(--surface)] relative shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* حذف */}
                  <button
                    type="button"
                    onClick={() => removeContent(block.clientId)}
                    className="absolute top-4 left-4 text-red-500 hover:text-red-600 bg-red-500/10 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                  >
                    حذف این بخش
                  </button>

                  {/* شماره بخش */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[var(--accent)] text-[var(--primary-deep)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>

                    <span className="text-sm font-bold text-theme">
                      محتوای شماره {index + 1}
                    </span>
                  </div>

                  {/* نوع محتوا */}
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        نوع محتوا
                      </label>

                      <select
                        value={block.contentType}
                        onChange={(e) => {
                          const contentType = Number(
                            e.target.value,
                          ) as PostContentFormState["contentType"];

                          updateContent(
                            block.clientId,
                            "contentType",
                            contentType,
                          );
                        }}
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                      >
                        <option value={POST_CONTENT_TYPES.TEXT}>متن</option>

                        <option value={POST_CONTENT_TYPES.HEADING}>هدر</option>

                        <option value={POST_CONTENT_TYPES.IMAGE}>عکس</option>

                        <option value={POST_CONTENT_TYPES.VIDEO}>ویدیو</option>
                      </select>
                    </div>
                  </div>

                  {/* متن / هدر */}
                  {(block.contentType === POST_CONTENT_TYPES.TEXT ||
                    block.contentType === POST_CONTENT_TYPES.HEADING) && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        متن محتوا
                      </label>

                      <textarea
                        value={block.content}
                        onChange={(e) =>
                          updateContent(
                            block.clientId,
                            "content",
                            e.target.value,
                          )
                        }
                        placeholder="متن یا هدر خود را اینجا بنویسید..."
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors min-h-[120px] resize-y"
                      />
                    </div>
                  )}

                  {/* تصویر / ویدیو */}
                  {(block.contentType === POST_CONTENT_TYPES.IMAGE ||
                    block.contentType === POST_CONTENT_TYPES.VIDEO) && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        انتخاب فایل مربوطه
                      </label>

                      <input
                        type="file"
                        accept={
                          block.contentType === POST_CONTENT_TYPES.IMAGE
                            ? "image/*"
                            : "video/*"
                        }
                        onChange={(e) =>
                          updateContent(
                            block.clientId,
                            "media",
                            e.target.files?.[0] ?? null,
                          )
                        }
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--primary-deep)] hover:file:bg-opacity-80 cursor-pointer"
                      />

                      {/* فایل قبلی در حالت Edit */}
                      {id && block.mediaAddress && (
                        <span className="text-xs text-muted">
                          فایل فعلی حفظ می‌شود مگر اینکه فایل جدیدی انتخاب کنید.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* دکمه‌های فرم */}
          <div className="flex gap-4 pt-4 border-t border-theme">
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

                  <span>در حال ثبت...</span>
                </>
              ) : id ? (
                "ذخیره تغییرات پست"
              ) : (
                "ثبت نهایی پست"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className={`flex-1 bg-transparent border border-theme text-theme py-3 rounded-lg text-base hover:bg-[var(--surface)] transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInputForm;
