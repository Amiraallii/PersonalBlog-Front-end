import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import SEO from "../shared/seo/SEO";
import { PostService } from "../features/post/services";
import { projectService } from "../features/project/services";
import type { Post } from "../features/post/types";
import type { Project } from "../features/project/types";

import { convertToJalali } from "../utils/dateHelper";
import HorizontalScroll from "./ScrollsComponent/ScrollX";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          PostService.getAll(3, 0),
          projectService.getAll(3, 0),
        ]);
        setPosts(postsRes.items || []);
        setProjects(projectsRes.items || []);
      } catch (error) {
        console.error("خطا در دریافت داده‌ها:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-8 border card">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[var(--border)] rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[var(--border)] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SEO
        title="Amirali Aghaei | امیرعلی آقایی"
        description="بلاگ امیرعلی آقایی؛ مهندس نرم افزار و توسعه‌دهنده نرم‌افزار، نویسنده و علاقه‌مند به تکنولوژی و زندگی."
        canonical="https://amirali.me/"
      />
      <div className="rounded-2xl p-8 border card">
        <h1 className="text-4xl font-bold mb-4">خوش آمدید به بلاگ شخصی من</h1>
        <p className="text-muted text-lg">
          اینجا درباره تجربیات، پروژه‌ها و یادگیری‌هام می‌نویسم
        </p>
      </div>

      <section className="rounded-2xl p-8 border card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">آخرین اخبار</h2>
          <button
            onClick={() => navigate("/Posts")}
            className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm"
          >
            مشاهده همه <ChevronLeftIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-muted text-center py-8">هنوز خبری منتشر نشده</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/Posts/postdetail/${post.slug}`)}
                className="p-4 border border-[var(--border)] rounded-lg hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-muted text-sm mb-2 line-clamp-2">
                      {post.summary}
                    </p>
                    <span className="text-xs text-muted">
                      {convertToJalali(post.publishDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl p-8 border card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">تجربه‌ها و پروژه‌ها</h2>
          <button
            onClick={() => navigate("/Projects")}
            className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm"
          >
            مشاهده همه <ChevronLeftIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <HorizontalScroll id="projects-container">
            {projects.length === 0 ? (
              <p className="text-muted text-center py-8 w-full">
                هنوز پروژه‌ای اضافه نشده
              </p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="min-w-[300px] p-6 border border-[var(--border)] rounded-lg hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/projects/Detail/${project.id}`)}
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm line-clamp-3">
                    {project.summary}
                  </p>
                </div>
              ))
            )}
          </HorizontalScroll>
        </div>
      </section>
    </div>
  );
};

export default Home;
