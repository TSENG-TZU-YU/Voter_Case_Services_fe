import React, { useEffect, useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//react-icons
import { MdOutlineAddBox } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
import { FaTrashAlt } from 'react-icons/fa';

//hook
import { useAuth } from '../utils/use_auth';

function Application({
  setApplication,
  setCaseManagement,
  setTrial,
  delCheck,
}) {
  const navigate = useNavigate();
  const [addNeed, setAddNeed] = useState([{ title: '', text: '' }]);
  const [addFile, setAddFile] = useState([{ file: '' }]);
  const [submitValue, setSubmitValue] = useState([
    { handler: '', category: '', name: '', cycle: '' },
  ]);
  const [addNo, setAddNo] = useState('');

  //使用者資料
  const { member } = useAuth();

  //抓取後端資料
  const [getHandler, setGetHandler] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [getCycle, setGetCycle] = useState([]);

  //申請表驗證空值
  const [category, setCategory] = useState(false);
  const [cycle, setCycle] = useState(false);
  const [need, setNeed] = useState(false);

  //表格資料填入
  const handleChange = (val, input) => {
    let newData = [...submitValue];
    if (input === 'handler') newData[0].handler = val;
    if (input === 'category') newData[0].category = val;
    if (input === 'cycle') newData[0].cycle = val;
    if (input === 'name') newData[0].name = val;

    // if(newData.)
    console.log(newData);
    setSubmitValue(newData);
  };

  //增加需求
  const addN = () => {
    const newAdd = { title: '', text: '' };
    const newAdds = [...addNeed, newAdd];
    setAddNeed(newAdds);
  };
  //填入需求
  const needChangerHandler = (val, i, input) => {
    let newData = [...addNeed];
    if (input === 'tt') newData[i].title = val;
    if (input === 'ttt') newData[i].text = val;
    setAddNeed(newData);
  };
  //刪除需求
  const deleteNeed = (i) => {
    let newData = [...addNeed];
    newData.splice(i, 1);
    if (newData.length === 0) return;
    setAddNeed(newData);
  };
  // 清空檔案
  const handleClearNeed = () => {
    let newData = [{ title: '', text: '' }];
    setAddNeed(newData);
  };

  //增加上傳檔案
  const addF = () => {
    const newAdds = [...addFile, { file: '' }];
    setAddFile(newAdds);
  };
  //刪除檔案
  const deleteFile = (i) => {
    let newData = [...addFile];
    newData.splice(i, 1); //刪除1個
    if (addFile.length === 0) return; //if長度=0 無法再刪除
    setAddFile(newData);
  };
  // 清空檔案
  const handleClearFile = () => {
    let newData = [{ file: '' }];
    setAddFile(newData);
  };
  //單個檔案上傳
  const onFileUpload = (val, i, input) => {
    let newData = [...addFile];
    if (input === 'file') newData[i].file = val;

    setAddFile(newData);
  };
  useEffect(() => {
    //抓取處理人
    let handler = async () => {
      try {
        let res = await axios.get(
          'http://localhost:3001/api/application_get/handler'
        );
        setGetHandler(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    //抓取申請類別
    let category = async () => {
      try {
        let res = await axios.get(
          'http://localhost:3001/api/application_get/category'
        );
        setGetCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    //抓取週期
    let cycle = async () => {
      try {
        let res = await axios.get(
          'http://localhost:3001/api/application_get/cycle'
        );
        setGetCycle(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    handler();
    category();
    cycle();
  }, []);

  // 送出申請表sweet
  function submitCheck(tit) {
    for (let i = 0; i < addNeed.length; i++) {
      if (addNeed[i].title === '' || addNeed[i].text === '') {
        setNeed(true);
        return;
      }
    }
    for (let i = 0; i < addFile.length; i++) {
      if (addFile[i].file === '') {
        Swal.fire({
          icon: 'error',
          title: '無檔案',
        });
        return;
      }
    }

    if (submitValue[0].category === '0' || submitValue[0].category === '') {
      setCategory(true);
    }

    if (submitValue[0].cycle === '0' || submitValue[0].cycle === '') {
      setCycle(true);
    }

    if (
      submitValue[0].category !== '0' &&
      submitValue[0].category !== '' &&
      submitValue[0].cycle !== ''
    ) {
      Swal.fire({
        title: tit,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '確定送出',
        denyButtonText: `取消送出`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('送出成功', '', 'success');
          submitFile();
          submit();
          navigate('/header');
          setCaseManagement(true);
          setApplication(false);
          setTrial(false);
        } else if (result.isDenied) {
          Swal.fire('已取消送出', '', 'info');
        }
      });
    }
  }

  // 儲存申請表sweet
  function storeCheck(tit) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定送出',
      denyButtonText: `取消送出`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('儲存成功', '', 'success');
        submitFile();
        navigate('/header');
        setCaseManagement(true);
        setApplication(false);
        setTrial(false);
      } else if (result.isDenied) {
        Swal.fire('已取消儲存', '', 'info');
      }
    });
  }

  //送出表單內容
  async function submit() {
    try {
      let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let response = await axios.post(
        'http://localhost:3001/api/application_post',
        {
          ...submitValue[0],
          need: addNeed,
          number: parseInt(Date.now() / 10000),
          id: member.id,
          user: member.name,
          // TODO: 申請狀態 一般職員跟主管送出的狀態不同
          status: 2,
          create_time: endTime,
        }
      );
    } catch (err) {
      console.log('sub', err);
    }
  }

  // 上傳檔案
  async function submitFile() {
    try {
      let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let noTime = moment(Date.now()).format('YYYYMMDDHHmmss');
      const formData = new FormData();
      for (let i = 0; i < addFile.length; i++) {
        formData.append(i, addFile[i].file);
      }
      formData.append('fileNo', addNo + '-' + noTime);

      formData.append('number', parseInt(Date.now() / 10000));
      formData.append('create_time', endTime);
      let response = await axios.post(
        'http://localhost:3001/api/application_post/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (err) {
      console.log('sub', err);
    }
  }

  //儲存表單內容
  async function store() {
    for (let i = 0; i < addNeed.length; i++) {
      if (addNeed[i].title === '' || addNeed[i].text === '') {
        setNeed(true);
        return;
      }
    }
    try {
      if (submitValue[0].category === '0' || submitValue[0].category === '') {
        setCategory(true);
      }

      if (submitValue[0].cycle === '0' || submitValue[0].cycle === '') {
        setCycle(true);
      }

      if (
        submitValue[0].category !== '0' &&
        submitValue[0].category !== '' &&
        submitValue[0].cycle !== ''
      ) {
        for (let i = 0; i < addFile.length; i++) {
          if (addFile[i].file === '') {
            Swal.fire({
              icon: 'error',
              title: '無檔案',
            });
            return;
          }
        }

        storeCheck('確認儲存申請表?');

        let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let response = await axios.post(
          'http://localhost:3001/api/application_post',
          {
            ...submitValue[0],
            need: addNeed,
            number: parseInt(Date.now() / 10000),
            id: member.id,
            user: member.name,
            // TODO: 申請狀態 一般職員跟主管送出的狀態不同
            status: 1,
            create_time: endTime,
          }
        );
      }
    } catch (err) {
      console.log('sub', err);
    }
  }

  return (
    <div className="scroll">
      <div className="container">
        <h3>申請表</h3>
        <div className="vector"></div>

        <div className="box">
          {/* 申請類別 */}
          <div className="gap">
            <div>
              申請類別 <span>*</span>
              {category ? <span>欄位不得為空</span> : ''}
            </div>
            <select
              className="handler"
              onChange={(e) => {
                handleChange(e.target.value, 'category');
                setAddNo(e.target.value);
              }}
              onClick={(e) => {
                if (e.target.value !== '0') {
                  setCategory(false);
                }
              }}
            >
              <option value="0" selected disabled hidden>
                -----請選擇類別-----
              </option>
              {getCategory.map((v, i) => {
                return (
                  <option key={i} value={v.number}>
                    {v.name}
                  </option>
                );
              })}
            </select>
            {/* <input
              type="text"
              className={`handler otherText mt-2 ${
                submitValue[0].category !== 'OTH' ? 'disNone' : ''
              }`}
              placeholder="請輸入類別名稱"
            /> */}
          </div>

          {/* 週期 */}
          <div className="gap">
            <div className="cycle">
              需求次數 <span>*</span>
              {cycle ? <span>欄位不得為空</span> : ''}
            </div>
            <div className="check handler">
              {getCycle.map((v, i) => {
                return (
                  <div key={i} className="form-check">
                    <input
                      className="form-check-input "
                      value={i + 1}
                      name="cycle'"
                      type="radio"
                      onChange={(e) => {
                        handleChange(e.target.value, 'cycle');
                        if (e.target.value !== '') {
                          setCycle(false);
                        }
                      }}
                    />
                    <label className="form-check-label">{v.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="box">
          {/* 處理人 */}
          <div className="gap">
            <div>處理人</div>
            <select
              className="handler"
              onChange={(e) => {
                handleChange(e.target.value, 'handler');
              }}
            >
              <option value=" "> -----請選擇-----</option>
              {getHandler.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 專案名稱 */}
          <div className="gap">
            <div> 專案名稱</div>
            <input
              className="handler"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'name');
              }}
            />
          </div>
        </div>

        {/* 需求 */}
        <div className="add">
          <span className={`${need ? 'view' : ''}`}>*欄位不得為空</span>
          <div>
            <FaTrashAlt
              size="17"
              onClick={() => {
                delCheck('確定要刪除所有需求內容?', handleClearNeed);
              }}
              className="clearIcon"
            />
            <MdOutlineAddBox size="20" onClick={addN} className="addIcon" />
          </div>
        </div>

        <div className="needs">
          {addNeed.map((v, i) => {
            return (
              <div key={i} className="need">
                <div className="one">
                  <div>
                    需求{i + 1} <span>* </span>
                  </div>
                  {i !== 0 ? (
                    <IoMdCloseCircle
                      size="20"
                      onClick={() => {
                        delCheck('確定要刪除此需求?', deleteNeed, i);
                      }}
                    />
                  ) : (
                    ''
                  )}
                </div>

                <div>
                  <input
                    className="input"
                    type="text"
                    name="tt"
                    value={addNeed[i].title}
                    placeholder="標題"
                    onChange={(e) => {
                      needChangerHandler(e.target.value, i, 'tt');
                      if (e.target.value !== '') {
                        setNeed(false);
                      }
                    }}
                  />
                </div>
                <div>
                  <textarea
                    className="input"
                    placeholder="請依據標題詳細說明"
                    name="ttt"
                    cols="30"
                    rows="10"
                    value={addNeed[i].text}
                    style={{ resize: 'none', height: '120px' }}
                    onChange={(e) => {
                      needChangerHandler(e.target.value, i, 'ttt');
                      if (e.target.value !== '') {
                        setNeed(false);
                      }
                    }}
                  ></textarea>
                </div>
              </div>
            );
          })}
        </div>

        {/* 附件上傳 */}
        <div className="file">
          <div className="fileName">
            <div>
              <div>附件上傳</div>
              <div>(可上傳副檔名.pdf / img...)</div>
              {/* <div>(選擇新專案必須上傳RFP 文件)</div> */}
            </div>
            <div className="fileIcon">
              <FaTrashAlt
                size="17"
                onClick={() => {
                  delCheck('確定要刪除所有上傳檔案?', handleClearFile);
                }}
                className="clearIcon"
              />
              <MdOutlineAddBox size="20" onClick={addF} className="addIcon" />
            </div>
          </div>
          {addFile.map((v, i) => {
            return (
              <div key={uuidv4()} className="two">
                <label className="addUploadContainer" htmlFor={`file${i}`}>
                  {/* 數字大於10 會因大小移位 */}
                  <span className={`items ${i < 9 ? 'ps-2' : ''}`}>
                    {i + 1}.
                  </span>
                  <div className="addUploadContain">
                    {v.file !== '' ? (
                      v.file.name
                    ) : (
                      <div className="addFile">
                        <HiOutlineDocumentPlus className="addIcon" />
                        <span>點擊新增檔案</span>
                      </div>
                    )}
                  </div>
                </label>

                <input
                  className="input d-none"
                  type="file"
                  name="file"
                  id={`file${i}`}
                  accept=".csv,.txt,.text,.png,.jpeg,.jpg,text/csv,.pdf,.xlsx"
                  onChange={(e) => {
                    onFileUpload(e.target.files[0], i, 'file');
                  }}
                />
                <IoMdCloseCircle
                  size="20"
                  onClick={() => {
                    delCheck('確定要刪除此上傳檔案?', deleteFile, i);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="ps">
          備註: 將由處理人員主動與您聯繫討論預計完成時間。
        </div>

        <div className="submitBtn">
          <div
            className="submit"
            onClick={() => {
              store();
            }}
          >
            儲存
          </div>
          <div
            className="submit"
            onClick={() => {
              submitCheck('確定要送出申請表?');
            }}
          >
            送出
          </div>
        </div>
      </div>
    </div>
  );
}

export default Application;
