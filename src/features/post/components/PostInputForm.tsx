import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import DateObject from "react-date-object";
import Gregorian from "react-date-object/calendars/gregorian";

import { PostService } from "../services/index";
import type { CreatePostFormState, PostContent } from "../types";
import JalaliDatePicker from "../../../components/JalaliDatePicker";

const PostInputForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<CreatePostFormState>({
    title: "",
    summary: "",
    publishDate: new DateObject().convert(Gregorian).format("YYYY-MM-DD"),
    coverImage: null,
    postContents: [],
  });

  useEffect(() => {
    if (!id) return;

    const fetchPost = async (postId: string) => {
      setIsLoading(true);
      try {
        const response = await PostService.getById(postId);
        setPostData({
          title: response.title,
          summary: response.summary,
          publishDate: response.publishDate
            ? response.publishDate.split("T")[0]
            : "",
          coverImage: null,
          coverImageAddress: response.coverImageAddress || "",
          postContents:
            response.postContents?.map((block) => ({
              content: block.content || "",
              contentType: block.contentType,
              order: block.order,
              media: null,
              mediaAddress: block.mediaAddress || null,
            })) || [],
        });
      } catch (error) {
        console.error(error);
        swal("خطا", "خطا در دریافت اطلاعات پست", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost(id);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name: string, value: string) => {
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPostData({ ...postData, coverImage: file });
  };

  const addContentBlock = () => {
    const newBlock: PostContent = {
      media: null,
      content: "",
      order: postData.postContents.length,
      contentType: 0,
    };
    setPostData({
      ...postData,
      postContents: [...postData.postContents, newBlock],
    });
  };

  const removeContentBlock = (index: number) => {
    const updatedBlocks = postData.postContents.filter((_, i) => i !== index);
    setPostData({ ...postData, postContents: updatedBlocks });
  };

  const handleBlockChange = (
    index: number,
    field: keyof PostContent,
    value: any,
  ) => {
    const updatedBlocks = [...postData.postContents];
    // @ts-ignore
    updatedBlocks[index][field] = value;
    setPostData({ ...postData, postContents: updatedBlocks });
  };

  const handleBlockFileChange = (index: number, file: File | null) => {
    const updatedBlocks = [...postData.postContents];
    updatedBlocks[index].media = file;
    setPostData({ ...postData, postContents: updatedBlocks });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted pr-1">عنوان پست</label>
              <input
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChange}
                placeholder="مثلا: آموزش ری‌اکت"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <JalaliDatePicker
                label="تاریخ انتشار"
                name="publishDate"
                value={postData.publishDate}
                onChange={(e: any) =>
                  handleDateChange("publishDate", e.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-muted pr-1">خلاصه مطلب</label>
              <textarea
                name="summary"
                value={postData.summary}
                onChange={handleChange}
                placeholder="این یک آموزش اولیه است"
                className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors min-h-[120px] resize-y"
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-muted pr-1">تصویر کاور</label>
              <input
                type="file"
                name="coverImage"
                onChange={handleCoverChange}
                className="bg-[var(--background)] text-theme border border-theme px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--primary-deep)] hover:file:bg-opacity-80 cursor-pointer"
                required={!id}
              />
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-xl border border-theme">
            <div className="flex justify-between items-center border-b border-theme pb-4 mb-6">
              <h3 className="text-lg font-bold text-[var(--accent)]">
                بخش‌های محتوای پست
              </h3>
              <button
                type="button"
                onClick={addContentBlock}
                className="bg-[var(--accent)] text-[var(--primary-deep)] px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-[0_0_10px_rgba(0,188,212,0.3)]"
              >
                + افزودن محتوای جدید
              </button>
            </div>

            <div className="space-y-6">
              {postData.postContents.length === 0 && (
                <p className="text-center text-muted py-4 text-sm">
                  هنوز هیچ محتوایی اضافه نشده است. روی دکمه افزودن کلیک کنید.
                </p>
              )}
              {postData.postContents.map((block, index) => (
                <div
                  key={index}
                  className="p-5 border border-[var(--border)] rounded-lg bg-[var(--surface)] relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() => removeContentBlock(index)}
                    className="absolute top-4 left-4 text-red-500 hover:text-red-600 bg-red-500/10 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                  >
                    حذف این بخش
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[var(--accent)] text-[var(--primary-deep)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-theme">
                      محتوای شماره {index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        نوع محتوا
                      </label>
                      <select
                        value={block.contentType}
                        onChange={(e) =>
                          handleBlockChange(
                            index,
                            "contentType",
                            parseInt(e.target.value),
                          )
                        }
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
                      >
                        <option value={0}>متن</option>
                        <option value={1}>هدر</option>
                        <option value={2}>عکس</option>
                        <option value={3}>ویدیو</option>
                      </select>
                    </div>
                  </div>

                  {(block.contentType === 0 || block.contentType === 1) && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        متن محتوا
                      </label>
                      <textarea
                        value={block.content}
                        onChange={(e) =>
                          handleBlockChange(index, "content", e.target.value)
                        }
                        placeholder="متن یا هدر خود را اینجا بنویسید..."
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors min-h-[120px] resize-y"
                      />
                    </div>
                  )}

                  {block.contentType > 1 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted pr-1">
                        انتخاب فایل مربوطه
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleBlockFileChange(
                            index,
                            e.target.files?.[0] || null,
                          )
                        }
                        className="bg-[var(--background)] text-theme border border-theme px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--primary-deep)] hover:file:bg-opacity-80 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

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
              className={`flex-1 bg-transparent border border-theme text-theme py-3 rounded-lg text-base hover:bg-[var(--surface)] transition${
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
