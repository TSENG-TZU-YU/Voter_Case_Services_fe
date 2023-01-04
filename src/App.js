import './App.css';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Header from './Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from './LogIn/LogIn.js';

// 登入元件
import { AuthProvider } from './utils/use_auth';

//子頁面
import Application from './Application';
import CaseManagement from './CaseManagement/CaseManagement.js';
import CaseManagement_handler from './CaseManagement_handler/CaseManagement';
import CaseDetail from './CaseDetail/CaseDetail';
import ApplicationForm from './CaseDetail/Component/ApplicationForm';
import UploadPage from './CaseDetail/Component/UploadPage';
// import ChatPage from './CaseDetail/Component/ChatPage';
import CountPage from './Count/CountPage';
import CategoryPage from './CountALL/CategoryPage';
import StatusPage from './CountALL/StatusPage';
import UnitPage from './CountALL/UnitPage';
import UserPage from './CountALL/UserPage';
import Permissions from './Permissions';
import ProcessingStatus from './CaseDetail/Component/ProcessingStatus';

function App() {
  const [application, setApplication] = useState(false);
  const [caseManagement, setCaseManagement] = useState(false);
  const [trial, setTrial] = useState(false);
  const [addStatus, setAddStatus] = useState(true);

  // 刪除sweet
  function delCheck(tit, fun, i) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定刪除',
      denyButtonText: `取消刪除`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('刪除成功', '', 'success');
        fun(i);
      } else if (result.isDenied) {
        Swal.fire('已取消刪除', '', 'info');
      }
    });
  }

  // 送出申請表sweet
  function submitCheck(tit, submitFile, navigate) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定送出',
      denyButtonText: `取消送出`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('送出成功', '', 'success');
        submitFile();
      } else if (result.isDenied) {
        Swal.fire('已取消送出', '', 'info');
      }
    });
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route
            // ?member=${member.permissions_id}
            path={`header`}
            element={
              <Header
                setApplication={setApplication}
                application={application}
                setCaseManagement={setCaseManagement}
                caseManagement={caseManagement}
                setTrial={setTrial}
                trial={trial}
              />
            }
          >
            <Route index path={`caseManagement`} element={<CaseManagement />} />
            <Route
              index
              path="caseManagement_handler"
              element={
                // eslint-disable-next-line react/jsx-pascal-case
                <CaseManagement_handler />
              }
            />
            <Route
              path="application"
              element={
                <Application
                  setApplication={setApplication}
                  setCaseManagement={setCaseManagement}
                  setTrial={setTrial}
                  delCheck={delCheck}
                  submitCheck={submitCheck}
                />
              }
            />

            <Route path="countPage" element={<CountPage />} />
            <Route path="categoryPage" element={<CategoryPage />} />
            <Route path="statusPage" element={<StatusPage />} />
            <Route path="unitPage" element={<UnitPage />} />
            <Route path="UserPage" element={<UserPage />} />

            <Route path="permissions" element={<Permissions />} />

            {/* detail */}
            <Route path="caseDetail" element={<CaseDetail />}>
              <Route
                path="application/:num"
                element={
                  <ApplicationForm
                    setAddStatus={setAddStatus}
                    addStatus={addStatus}
                    delCheck={delCheck}
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
  );
}

export default App;
