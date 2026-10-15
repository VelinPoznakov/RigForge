import { publicRoutes, protectedRoutes } from "./ utils/ApplicationUrlPaths.js";
import {Routes, Route} from "react-router";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import BuildDetails from "./components/BuildDetails.jsx";
import UserBuilds from "./components/UserBuilds.jsx";
import CreateBuild from "./components/CreateBuild.jsx";
import EditBuild from "./components/EditBuild.jsx";
import Profile from "./components/Profile.jsx";
import NotFound from "./components/NotFound.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import Footer from "./components/Footer.jsx";

function App() {

  return (
    <>
        {/*nav bar*/}

        <Routes>
            <Route path={publicRoutes.home} element={<Home />} />
            <Route path={publicRoutes.about} element={<About />} />
            <Route path={publicRoutes.login} element={<Login />} />
            <Route path={publicRoutes.register} element={<Register />} />
            <Route path={publicRoutes.buildDetails(':id')} element={<BuildDetails />} />
            <Route path={publicRoutes.userBuilds(':id')} element={<UserBuilds />} />

            <Route element={<RouteGuard />}>
                <Route path={protectedRoutes.createBuild} element={<CreateBuild />} />
                <Route path={protectedRoutes.editBuild(':id')} element={<EditBuild />} />
                <Route path={protectedRoutes.profile} element={<Profile />} />
            </Route>


            <Route path={publicRoutes.notFound} element={<NotFound />} />

        </Routes>

        <Footer />

    </>
  )
}

export default App
