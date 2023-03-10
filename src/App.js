import './';
import React, { useState, lazy, Suspense } from 'react';
import Swal from 'sweetalert2';
import Header from './Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from './LogIn/LogIn.js';

// 登入元件
import { AuthProvider } from './utils/use_auth';

//子頁面
// import Application from './Application';
// import CaseManagement from './CaseManagement/CaseManagement.js';
// import CaseManagement_handler from './CaseManagement_handler/CaseManagement';
// import CaseDetail from './CaseDetail/CaseDetail';
// import ApplicationForm from './CaseDetail/Component/ApplicationForm';
// import UploadPage from './CaseDetail/Component/UploadPage';
// import ChatPage from './CaseDetail/Component/ChatPage';
// import CountPage from './Count/CountPage';
// import CategoryPage from './CountALL/CategoryPage';
// import StatusPage from './CountALL/StatusPage';
// import UnitPage from './CountALL/UnitPage';
// import UserPage from './CountALL/UserPage';
// import Permissions from './Permissions';
// import ProcessingStatus from './CaseDetail/Component/ProcessingStatus';
// import HeaderLeft from './HeaderLeft';
// import AppUserPage from './CountALL/AppUserPage';
// import HandlerUnitPage from './CountALL/HandlerUnitPage';
// import CaseReport from './CaseReport/CaseReport';
// import Audit from './Audit';
// import WorkLog from './WorkLog';
// import WorkLogSearch from './WorkLogSearch';

const Application = lazy(() => import('./Application'));
const CaseManagement = lazy(() => import('./CaseManagement/CaseManagement.js'));
const CaseManagement_handler = lazy(() =>
  import('./CaseManagement_handler/CaseManagement')
);
const CaseDetail = lazy(() => import('./CaseDetail/CaseDetail'));
const ApplicationForm = lazy(() =>
  import('./CaseDetail/Component/ApplicationForm')
);
const UploadPage = lazy(() => import('./CaseDetail/Component/UploadPage'));
const CountPage = lazy(() => import('./Count/CountPage'));
const CategoryPage = lazy(() => import('./CountALL/CategoryPage'));
const StatusPage = lazy(() => import('./CountALL/StatusPage'));
const UnitPage = lazy(() => import('./CountALL/UnitPage'));
const UserPage = lazy(() => import('./CountALL/UserPage'));
const Permissions = lazy(() => import('./Permissions'));
const ProcessingStatus = lazy(() =>
  import('./CaseDetail/Component/ProcessingStatus')
);
const HeaderLeft = lazy(() => import('./HeaderLeft'));
const AppUserPage = lazy(() => import('./CountALL/AppUserPage'));
const HandlerUnitPage = lazy(() => import('./CountALL/HandlerUnitPage'));
const CaseReport = lazy(() => import('./CaseReport/CaseReport'));
const Audit = lazy(() => import('./Audit'));
const WorkLog = lazy(() => import('./WorkLog'));
const WorkLogSearch = lazy(() => import('./WorkLogSearch'));

function App() {
  const [addStatus, setAddStatus] = useState(true);
  const [scrollPage, setScrollPage] = useState(false);
  // 刪除sweet
  function delCheck(tit, fun, i) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定刪除',
      denyButtonText: `取消刪除`,
      confirmButtonColor: '#f2ac33',
      denyButtonColor: '#ccc',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '刪除成功',
          confirmButtonColor: '#f2ac33',
        });
        fun(i);
      } else if (result.isDenied) {
        Swal.fire({
          icon: 'info',
          title: '已取消刪除',
          confirmButtonColor: '#f2ac33',
        });
      }
    });
  }

  return (
    <Suspense>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/casemgmt" element={<LogIn />} />
            <Route path={`/casemgmt/header`} element={<Header />}>
              <Route index element={<HeaderLeft />} />
              <Route path={`caseManagement`} element={<CaseManagement />} />
              <Route
                path="caseManagement_handler"
                element={
                  // eslint-disable-next-line react/jsx-pascal-case
                  <CaseManagement_handler />
                }
              />
              <Route
                path="application"
                element={<Application delCheck={delCheck} />}
              />

              <Route path="countPage" element={<CountPage />} />
              <Route path="categoryPage" element={<CategoryPage />} />
              <Route path="statusPage" element={<StatusPage />} />
              <Route path="unitPage" element={<UnitPage />} />
              <Route path="UserPage" element={<UserPage />} />
              <Route path="AppUserPage" element={<AppUserPage />} />
              <Route path="HandlerUnitPage" element={<HandlerUnitPage />} />
              <Route path="caseReport" element={<CaseReport />} />
              <Route path="permissions" element={<Permissions />} />
              <Route path="workLog" element={<WorkLog />} />
              <Route path="workLogSearch" element={<WorkLogSearch />} />
              <Route path="audit" element={<Audit />} />

              {/* detail */}
              <Route
                path="caseDetail"
                element={
                  <CaseDetail
                    setScrollPage={setScrollPage}
                    scrollPage={scrollPage}
                  />
                }
              >
                <Route
                  path="application/:num"
                  element={
                    <ApplicationForm
                      addStatus={addStatus}
                      delCheck={delCheck}
                      scrollPage={scrollPage}
                    />
                  }
                />
                {/* <Route path="chatPage/:num" element={<ChatPage />} /> */}
                <Route
                  path="ProcessingStatus/:num"
                  element={<ProcessingStatus />}
                />

                <Route
                  path="uploadPage/:num"
                  element={
                    <UploadPage
                      setAddStatus={setAddStatus}
                      addStatus={addStatus}
                      delCheck={delCheck}
                    />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
