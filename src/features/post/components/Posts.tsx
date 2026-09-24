import PostItems from "./PostItems";
import PostHeaderBar from "./PostHeaderBar";
import SEO from "../../../shared/seo/SEO";
import PersonStructuredData from "../../../shared/seo/PersonStructuredData";

const Posts = () => {
  return (
    <>
      <SEO
        title="بلاگ امیرعلی آقایی |Amirali Aghaei"
        description="آخرین نوشته ها و اخبار امیرعلی آقایی پور؛ مهندس نرم‌افزار و توسعه‌دهنده نرم‌افزار."
        canonical="https://amirali.me/AboutMe"
      />

      <PersonStructuredData
        name="امیرعلی آقایی پور"
        alternateName="Amirali Aghaei"
        description="مهندس نرم‌افزار و توسعه‌دهنده نرم‌افزار."
        sameAs={
          [
            "https://github.com/Amiraallii",
            "https://www.linkedin.com/in/amiraallii/",
            "https://charvandclub.com/"
          ]
        }
      />
      <PostHeaderBar />
      <PostItems />
    </>
  );
};

export default Posts;
