import { Route, Routes } from "react-router-dom";

import Home from "../../components/Home";
import { RouteGuard } from "../../components/RouteGuard";

import {
  Projects,
  ProjectDetail,
  ProjectModify,
  RequestNewProject,
} from "../../features/project";

import { Posts, PostDetail, PostInputForm } from "../../features/post";

import { AboutMeIndex, PersonalInfoForm } from "../../features/aboutMe";

import { Login, Register } from "../../features/Authentication";

import { ROLES } from "../../types/auth";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/Posts" element={<Posts />} />

      <Route path="/Posts/postdetail/:id/:slug" element={<PostDetail />} />

      <Route
        path="/Posts/newPost"
        element={
          <RouteGuard allowedRoles={[ROLES.ADMIN]}>
            <PostInputForm />
          </RouteGuard>
        }
      />

      <Route
        path="/Posts/newPost/:id"
        element={
          <RouteGuard allowedRoles={[ROLES.ADMIN]}>
            <PostInputForm />
          </RouteGuard>
        }
      />

      <Route path="/Projects" element={<Projects />} />

      <Route path="/Projects/Detail/:id" element={<ProjectDetail />} />

      <Route
        path="/Projects/AddNewProject"
        element={
          <RouteGuard allowedRoles={[ROLES.ADMIN]}>
            <ProjectModify />
          </RouteGuard>
        }
      />

      <Route
        path="/Projects/RequestNewProject"
        element={
          <RouteGuard allowedRoles={[ROLES.USER, ROLES.ADMIN]}>
            <RequestNewProject />
          </RouteGuard>
        }
      />

      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />

      <Route path="/AboutMe" element={<AboutMeIndex />} />

      <Route
        path="/AboutMe/Modify"
        element={
          <RouteGuard allowedRoles={[ROLES.ADMIN]}>
            <PersonalInfoForm />
          </RouteGuard>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
