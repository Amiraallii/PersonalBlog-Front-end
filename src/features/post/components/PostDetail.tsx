import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../services/index";
import { CalendarIcon, PencilIcon } from "@heroicons/react/16/solid";
import CommentModal from "../../comment/components/CommentModal";
import { ROLES } from "../../../types/auth";
import { convertToJalali } from "../../../utils/dateHelper";
import type { Post } from "../types";
import { POST_CONTENT_TYPES } from "../constants/postContentTypes";
import { env } from "../../../config/env";
import SEO from "../../../shared/seo/SEO";
import ArticleStructuredData from "../../../shared/seo/ArticleStructuredData";
import { useAuth } from "../../../context/AuthContext";
const PostDetail = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postDetail, setPostDetail] = useState<Post>();
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useAuth();
  useEffect(() => {
    const getPost = async (postId: string) => {
      try {
        const result = await PostService.getById(postId);

        setPostDetail({
          id: result.id,
          title: result.title,
          summary: result.summary,
          publishDate: result.publishDate,
          postContents: result.postContents,
          coverImageAddress: result.coverImageAddress,
          slug: result.slug,
        });
      } catch (error) {
        console.error("خطا در دریافت پست:", error);
      }
    };

    if (id) {
      getPost(id);
    }
  }, [id]);

  return (
    <Fragment>
      {postDetail && (
        <>
          <SEO
            title={`${postDetail.title} | Amirali Aghaei`}
            description={postDetail.summary}
            canonical={`https://amirali.me/Posts/postdetail/${id}/${postDetail.slug}`}
            image={`${env.mediaBaseUrl}/${postDetail.coverImageAddress}`}
          />

          <ArticleStructuredData
            title={postDetail.title}
            description={postDetail.summary}
            url={`https://amirali.me/Posts/postdetail/${id}/${postDetail.slug}`}
            image={`${env.mediaBaseUrl}/${postDetail.coverImageAddress}`}
            datePublished={postDetail.publishDate}
            authorName="Amirali Aghaei"
          />
        </>
      )}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 shadow-lg mt-6">
        <div className="relative">
          {!isLoading && isAuthenticated && role === ROLES.ADMIN && (
          <button
              onClick={() => navigate(`/Posts/newPost/${id}`)}
              className="absolute top-4 left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              title="ویرایش"
            >
              <PencilIcon className="w-5 h-5 text-white" />
            </button>
        )}
          <img
            className="w-full object-cover max-h-[400px]"
            src={`${env.mediaBaseUrl}/${postDetail?.coverImageAddress}`}
            alt={postDetail?.title}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-[var(--muted)] text-sm mb-4">
            <CalendarIcon className="w-5 h-5 text-[var(--accent)]" />
            <span>{convertToJalali(postDetail?.publishDate || "")}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl text-[var(--accent)] font-bold mb-4">
              {postDetail?.title}
            </h1>
            <p className="text-lg opacity-80 leading-relaxed whitespace-pre-line">
              {postDetail?.summary}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {(postDetail?.postContents || []).map((p) => (
              <div key={p.order} className="post-content-item">
                {p.contentType === POST_CONTENT_TYPES.TEXT && (
                  <p className="leading-loose text-justify whitespace-pre-line">
                    {p.content}
                  </p>
                )}
                {p.contentType === POST_CONTENT_TYPES.HEADING && (
                  <h2 className="text-2xl font-bold text-[var(--accent)] leading-loose text-justify whitespace-pre-line mb-4">
                    {p.content}
                  </h2>
                )}
                {p.contentType === POST_CONTENT_TYPES.IMAGE && (
                  <img
                    className="w-full rounded-md"
                    src={`${env.mediaBaseUrl}/${p.content}`}
                    alt={postDetail?.title ?? "تصویر پست"}
                  />
                )}

                {p.contentType === POST_CONTENT_TYPES.VIDEO && (
                  <video className="w-full rounded-md" controls>
                    <source src={`${env.mediaBaseUrl}/${p.content}`} />
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        مشاهده نظرات
      </button>

      {id && isModalOpen && (
        <CommentModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          postId={id}
        />
      )}
    </Fragment>
  );
};

export default PostDetail;
