import './App.css';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from './LogIn/LogIn.js';

// 登入元件
import { AuthProvider } from './utils/use_auth';

//子頁面
import Application from './Application';
import CaseManagement from './CaseManagement/CaseManagement.js';
import CaseDetail from './CaseDetail/CaseDetail';
import ApplicationForm from './CaseDetail/Component/ApplicationForm';
import UploadPage from './CaseDetail/Component/UploadPage';
import ChatPage from './CaseDetail/Component/ChatPage';
import CountPage from './Count/CountPage';
import Permissions from './Permissions';

function App() {
  const [application, setApplication] = useState(false);
  const [caseManagement, setCaseManagement] = useState(false);
  const [trial, setTrial] = useState(false);
  const [addStatus, setAddStatus] = useState(true);
  const [handlerSelect, setHandlerSelect] = useState(true);
  const [caseNum, setCaseNum] = useState('');
  const [caseId, setCaseId] = useState('');
  const [handlerNull, setHandlerNull] = useState('');
  const [sender, setSender] = useState('');

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
            path="header"
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
            <Route
              index
              element={
                <CaseManagement
                  setCaseNum={setCaseNum}
                  setCaseId={setCaseId}
                  setHandlerNull={setHandlerNull}
                  setSender={setSender}
                />
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
            <Route
              // index
              path="permissions"
              element={<Permissions />}
            />

            {/* detail */}
            <Route path="caseDetail" element={<CaseDetail caseNum={caseNum} />}>
              <Route
                // index
                path="application/:num"
                element={
                  <ApplicationForm
                    setAddStatus={setAddStatus}
                    addStatus={addStatus}
                    caseNum={caseNum}
                    handlerSelect={handlerSelect}
                    setHandlerSelect={setHandlerSelect}
                    caseId={caseId}
                    delCheck={delCheck}
                    handlerNull={handlerNull}
                    sender={sender}
                    // viewCheck={viewCheck}
                  />
                }
              />

              <Route path="chatPage/:num" element={<ChatPage />} />
              <Route
                path="uploadPage/:num"
                element={
                  <UploadPage
                    setAddStatus={setAddStatus}
                    addStatus={addStatus}
                    caseNum={caseNum}
                    caseId={caseId}
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
