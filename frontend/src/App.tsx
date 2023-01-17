import { HelmetProvider, Helmet } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import "./i18n";

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import Page404 from "./pages/auth/Page404";
import SignInPage from "./pages/auth/SignInPage";
import SignInManagement from "./components/auth/SignInManagement";
import SignInProduction from './components/auth/SignInProduction'
import Dashboard from "./pages/dashboard";
import Projects from "./pages/pages/Projects";
import Clients from "./pages/pages/Clients";
import JobDetails from "./pages/pages/Jobs/JobDetails";
import Settings from "./pages/pages/Settings";
import Blank from "./pages/pages/Blank";
import KioskHome from "./pages/pages/Kiosk/KioskHome";
import Production from "./layouts/Production";
import ClientDetails from "./components/clients/ClientDetails";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import TaskCreate from "./pages/pages/Tasks/TaskCreate";
import TaskDetails from "./pages/pages/Tasks/TaskDetails";
import TaskEdit from "./pages/pages/Tasks/TaskEdit";
import KioskTasks from "./pages/pages/Kiosk/KioskTasks";
import KioskTaskDetails from "./pages/pages/Kiosk/KioskTaskDetails";
import ClientEdit from "./components/clients/ClientEdit";
import JobEdit from "./pages/pages/Jobs/JobEdit";
import AzureAuthError from "./pages/auth/AzureAuthError";
import MoreInfo from "./pages/pages/MoreInfo";
import DashboardNoRole from "./layouts/DashboardNoRole";
import UserDetails from "./pages/pages/Users/UserDetails";
import UserEdit from "./pages/pages/Users/UserEdit";
import UserCreate from "./pages/pages/Users/UserCreate";
import JobCreate from "./pages/pages/Jobs/JobCreate";
import ClientCreate from "./components/clients/ClientCreate";
import CreateStep1 from "./pages/pages/Jobs/Create/CreateStep1";
import JobCreateV2 from "./pages/pages/Jobs/JobCreateV2";


const App = () => {

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate="%s | JARVIS Web"
        defaultTitle="JARVIS Web Interface - Coasteel Engineering"
      />
      {/* <ChartJsDefaults /> */}
      {/* <AuthProvider>{content}</AuthProvider> */}
      <Routes>
        {/* Dashboard / Managers Login */}
        <Route element={<RequireAuth role={['Super Admin', 'Office Management', 'Workshop Supervisor', 'Workshop Manager', 'Project Manager']} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/jobs/list" element={<Projects />} />
            <Route path="/jobs/create" element={<JobCreateV2 />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/jobs/:jobId/edit" element={<JobEdit />} />
            <Route path="/jobs/:jobId/tasks" element={<TaskCreate />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/tasks/:taskId/edit" element={<TaskEdit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/create" element={<ClientCreate />} />
            <Route path="/clients/:clientId" element={<ClientDetails />} />
            <Route path="/clients/:clientId/edit" element={<ClientEdit />} />
            <Route element={<RequireAuth role={['Super Admin', 'Office Management']} />}>
              <Route path="/users" element={<UserCreate />} />
              <Route path="/users/:userId" element={<UserDetails />} />
              <Route path="/users/:userId/edit" element={<UserEdit />} />
            </Route>

          </Route>
        </Route>

        <Route element={<RequireAuth role={['Unassigned', 'Super Admin', 'Office Management', 'Workshop Supervisor', 'Workshop Manager', 'Project Manager']} />}>
          <Route path="/moreinfo" element={<DashboardNoRole />}>
            <Route index element={<MoreInfo />} />
          </Route>
        </Route>

        <Route element={<RequireAuth role={['Super Admin', 'Office Management', 'Workshop Supervisor', 'Workshop Manager', 'Project Manager', 'Painter/Labourer', 'Boilermaker', 'Apprentice', 'Yardsman']} />}>
          <Route path="/kiosk" element={<Production />}>
            <Route index element={<KioskHome />} />
            <Route path="/kiosk/tasks" element={<KioskTasks />} />
            <Route path="/kiosk/tasks/:taskId" element={<KioskTaskDetails />} />
            {/* <Route path="/kiosk/tasks/:taskId/edit" element={<TaskEdit />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<AuthLayout />}>
          <Route path="*" element={<Page404 />} />
          <Route path="oauth/error" element={<AzureAuthError />} />
          <Route path="login" element={<SignInPage children={<SignInManagement />} />} />
          <Route path="kiosk/login" element={<SignInPage children={<SignInProduction />} />} />
          <Route path="auth/reset" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </HelmetProvider >
  );
};

export default App;
