import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MdOutlineAddBox } from 'react-icons/md';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import moment from 'moment';
import Swal from 'sweetalert2';

import '../../styles/caseDetail/_uploadPage.scss';
import { useAuth } from '../../utils/use_auth';

function UploadPage({ setAddStatus, addStatus, caseNum, caseId, delCheck }) {
  const [userFilesPage, setUserFilesPage] = useState(true);
  const [mgtFilesPage, setMgtUserFilesPage] = useState(false);
  const [filesData, setFilesData] = useState([{ fileName: '' }]);
  const { member, setMember } = useAuth();
  const [getUserTotalFile, setGetUserTotalFile] = useState([]);
  const [getHandlerTotalFile, setGetHandlerTotalFile] = useState([]);
  const [render, setRender] = useState(false);
  const [No, setNo] = useState([]);
  const [status, setStatus] = useState([]);
  // const [id, setId] = useState([]);
  const [handler, setHandler] = useState([]);
  const [valid, setValid] = useState('');
  const [getUpdateFile, setGetUpdateFile] = useState([]);
  const [acceptRender, setAcceptRender] = useState(false);

  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(`http://localhost:3001/api/login/auth`, {
          withCredentials: true,
        });

        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();

    if (member.permissions_id === 1) {
      setAddStatus(false);
      setValid(1);
    }
    if (member.permissions_id === 3 || member.permissions_id === 4) {
      setValid(2);
    }
  }, []);

  useEffect(() => {
    async function toGetUserFile() {
      try {
        let response = await axios.get(
          `http://localhost:3001/api/files/getUserFile/${caseNum}`
        );
        setGetUserTotalFile(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function toGetHandlerFile() {
      try {
        let response = await axios.get(
          `http://localhost:3001/api/files/getHandlerFile/${caseNum}`
        );
        setGetHandlerTotalFile(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function toGetHandlerFileNo() {
      try {
        let response = await axios.get(
          `http://localhost:3001/api/files/getHandlerFileNo/${caseNum}`
        );

        setNo(response.data[0].application_category);
        setStatus(response.data[0].status_id);
        setHandler(response.data[0].handler);
      } catch (err) {
        console.log(err);
      }
    }
    // async function toGetUpdateFile() {
    //   try {
    //     let response = await axios.get(
    //       ` http://localhost:3001/api/files/getUpdateFile/${caseNum}`
    //     );
    //     setGetUpdateFile(response.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    toGetUserFile();
    toGetHandlerFile();
    toGetHandlerFileNo();
    // toGetUpdateFile();
  }, [render, acceptRender]);

  // function getFileNameFromContentDisposition(contentDisposition) {
  //   if (!contentDisposition) return null;

  //   const match = contentDisposition.match(/filename="?([^"]+)"?/);

  //   return match ? match[1] : null;
  // }

  // useEffect(()=>{

  // },[ fileName])

  const handleDownload = async (fileName, fileNo) => {
    let str = fileNo.indexOf('-');
    let dbTime = fileNo.substr(str + 1, 6);

    await axios({
      url: `http://localhost:3001/api/files/${caseNum}`,
      data: {
        name: fileName,
        dbTime: dbTime,
        fileNo: fileNo,
      },
      method: 'POST',
      responseType: 'blob', // important 下載檔案需要轉
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  //整理檔案資料 user
  const map = {};
  const newGetUserFile = getUserTotalFile
    .reduce((acc, cur) => {
      const { create_time, file_no, name } = cur;
      const item = { file_no, name };
      if (!map[create_time]) {
        map[create_time] = { create_time, item: [item] };
        acc = [...acc, map[create_time]];
      } else {
        map[create_time].item.push({ file_no, name });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(b.name) - new Date(a.name));

  //整理檔案資料 handler
  const map1 = {};
  const newGetHandlerFile = getHandlerTotalFile
    .reduce((acc, cur) => {
      const { create_time, file_no, name } = cur;
      const item = { file_no, name };
      if (!map1[create_time]) {
        map1[create_time] = { create_time, item: [item] };
        acc = [...acc, map1[create_time]];
      } else {
        map1[create_time].item.push({ file_no, name });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(b.name) - new Date(a.name));

  //整理檔案資料 已補件
  const map2 = {};
  const newGetUpdateFile = getUpdateFile
    .reduce((acc, cur) => {
      const { create_time, file_no, name, remark } = cur;
      const item = { file_no, name };
      if (!map2[create_time]) {
        map2[create_time] = { create_time, remark, item: [item] };
        acc = [...acc, map2[create_time]];
      } else {
        map2[create_time].item.push({ file_no, name });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(b.name) - new Date(a.name));

  //   files upload
  //   update contain
  const handlerUpdateFile = (val, i, input) => {
    let newData = [...filesData];
    if (input === 'photo1') newData[i].fileName = val;
    setFilesData(newData);
  };

  // add files
  const handleAddFile = () => {
    let newData = [...filesData, { fileName: '' }];
    setFilesData(newData);
  };

  // clear files
  const handleClearFile = () => {
    let newData = [{ fileName: '' }];
    setFilesData(newData);
  };

  // del files
  const handleDelFile = (i) => {
    if (filesData.length === 1) return;
    let newData = [...filesData];
    newData.splice(i, 1);
    setFilesData(newData);
    // console.log(i);
  };
  async function fileSubmit() {
    try {
      let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let noTime = moment(Date.now()).format('YYYYMMDDHHmmss');
      const formData = new FormData();
      for (let i = 0; i < filesData.length; i++) {
        // 這邊結束 不會往下跑
        if (filesData[i].fileName === '') {
          Swal.fire({
            icon: 'error',
            title: '無檔案',
          });
          return;
        }
        formData.append(i, filesData[i].fileName);
      }
      formData.append('fileNo', '-' + noTime);
      formData.append('No', No);
      formData.append('handler', handler);
      formData.append('valid', valid);
      formData.append('number', parseInt(Date.now() / 10000));
      formData.append('create_time', endTime);
      let response = await axios.post(
        `http://localhost:3001/api/1.0/applicationData/postHandleFile/${caseNum}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: '已上傳檔案',
      });
      setFilesData([{ fileName: '' }]);
      setRender(false);
    } catch (err) {
      console.log(err);
    }
  }

  const fileSubmitStatus = async () => {
    try {
      let response = await axios.patch(
        `http://localhost:3001/api/files/patchStatus/${caseNum}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // const toAcceptFile = async (time) => {
  //   let receiveTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  //   try {
  //     let response = await axios.patch(
  //       `http://localhost:3001/api/files/acceptFile/${caseNum}`,
  //       { receiveTime: receiveTime, create_time: time, handler: handler }
  //     );
  //     Swal.fire({
  //       icon: 'success',
  //       title: '成功接收檔案',
  //     });
  //     setAcceptRender(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="overScr">
      {/* 上傳檔案 */}
      {/* TODO: 判斷處理人+權限+狀態 */}
      {(member.permissions_id === 1 && status === 6) ||
      (member.permissions_id === 3 && status === 5) ||
      (member.permissions_id === 3 && status === 6) ||
      (member.permissions_id === 3 && status === 7) ||
      (member.permissions_id === 3 && status === 11) ? (
        <>
          <div className="addUpload">
            <div className="addTitle">
              請新增上傳附件(可上傳副檔名.pdf / img...)
            </div>
            <div>
              <FaTrashAlt
                className="trashIcon"
                onClick={() => {
                  delCheck('確定要刪除所有上傳文件', handleClearFile);
                }}
              />
              <MdOutlineAddBox className="addIcon" onClick={handleAddFile} />
            </div>
          </div>
          <div className="uploadContainer">
            {filesData.map((v, i) => {
              return (
                <div key={uuidv4()}>
                  <div className="upload">
                    <label className="addUploadContainer" htmlFor={`file${i}`}>
                      <span className={`items ${i < 9 ? 'ps-2' : ''}`}>
                        {i + 1}.
                      </span>
                      <div className="addUploadContain">
                        {v.fileName !== '' ? (
                          v.fileName.name
                        ) : (
                          <div className="addFile">
                            <HiOutlineDocumentPlus className="addIcon" />
                            <span>點擊新增檔案</span>
                          </div>
                        )}
                      </div>
                    </label>
                    {i !== 0 ? (
                      <AiFillCloseCircle
                        className="delIcon"
                        onClick={() => {
                          delCheck('確定要刪除此上傳文件', handleDelFile, i);
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </div>

                  <input
                    className="input d-none"
                    name="photo1"
                    type="file"
                    id={`file${i}`}
                    accept=".csv,.txt,.text,.png,.jpeg,.jpg,text/csv,.pdf,.xlsx"
                    onChange={(e) => {
                      handlerUpdateFile(e.target.files[0], i, 'photo1');
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="subBtn">
            <button
              className="submitBtn"
              onClick={() => {
                setRender(true);
                fileSubmit();
                if (member.permissions_id === 1) {
                  fileSubmitStatus();
                }
              }}
            >
              上傳檔案
            </button>
          </div>
        </>
      ) : (
        ''
      )}

      {/* 管理者接收檔案 */}
      {/* {(member.permissions_id === 3 || member.permissions_id === 4) &&
      status === 8 ? (
        <>
          {newGetUpdateFile.map((v, i) => {
            return (
              <div key={i}>
                <div className="receiveFileContainer">
                  <div className="receiveFileTime">
                    {v.create_time} 已上傳文件:
                  </div>
                  <textarea
                    name=""
                    className="textContain"
                    //   cols="87"
                    rows="30"
                    readOnly
                  >
                    {v.remark}
                  </textarea>
                  <div className="files">
                    {newGetUpdateFile[i].item.map((v, i) => {
                      return (
                        <div key={uuidv4()} className="receiveFile">
                          <span>{i + 1}.</span>
                          <span className="ms-1 me-2">{v.file_no}</span>
                          <span>{v.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="subBtn receiveBtn">
                  <button
                    className="submitBtn"
                    onClick={() => {
                      // toAcceptFile(v.create_time);
                      setAcceptRender(true);
                    }}
                  >
                    接收檔案
                  </button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ''
      )} */}

      {/* 雙方檔案 */}
      <div className="viewFilesContainer">
        <div className="viewBtn">
          <div
            className={`btnWidth borderR ${
              userFilesPage === true ? 'clickStyle' : ''
            }`}
            onClick={() => {
              setUserFilesPage(true);
              setMgtUserFilesPage(false);
            }}
          >
            申請人上傳文件
          </div>
          <div
            className={`btnWidth borderL ${
              mgtFilesPage === true ? 'clickStyle' : ''
            }`}
            onClick={() => {
              setUserFilesPage(false);
              setMgtUserFilesPage(true);
            }}
          >
            處理人上傳文件
          </div>
        </div>
        {/* 檔案內容 */}
        {/* 使用者 */}
        {/* 管理者 */}
        {userFilesPage === true && mgtFilesPage === false ? (
          <div className="viewFilesContain">
            {newGetUserFile.map((v, i) => {
              return (
                <div key={uuidv4()} className="pt-2">
                  <span className="filesTime">{v.create_time}</span>
                  {newGetUserFile[i].item.map((v, i) => {
                    return (
                      <div key={uuidv4()} className="pt-2">
                        <span>{i + 1}.</span>
                        <span className="ms-1 me-2">{v.file_no}</span>
                        <span
                          className="download"
                          onClick={() => {
                            handleDownload(v.name, v.file_no);
                          }}
                        >
                          {v.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="viewFilesContain">
            {newGetHandlerFile.map((v, i) => {
              return (
                <div key={uuidv4()} className="pt-2">
                  <span className="filesTime">{v.create_time}</span>
                  {newGetHandlerFile[i].item.map((v, i) => {
                    return (
                      <div key={uuidv4()} className="pt-2">
                        <span>{i + 1}.</span>
                        <span className="ms-1 me-2">{v.file_no}</span>
                        <span
                          className="download"
                          onClick={() => {
                            handleDownload(v.name, v.file_no);
                          }}
                        >
                          {v.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
