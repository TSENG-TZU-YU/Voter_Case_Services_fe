import React, { useEffect, useState } from 'react';
import './_index.scss';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//react-icons
import { MdOutlineAddBox } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
// import { FaTrashAlt } from 'react-icons/fa';

//hook
import { useAuth } from '../utils/use_auth';

import GenerallyBtn from '../Btn/GenerallyBtn';

function Application({ delCheck }) {
  const navigate = useNavigate();
  const [addNeed, setAddNeed] = useState([{ text: '' }]);
  const [addFile, setAddFile] = useState([]);
  const [submitValue, setSubmitValue] = useState([
    {
      handler: '',
      source: '',
      category: '',
      relation: '',
      phoneCheck: '',
      litigant: '',
      litigantPhone: '',
      litigantCounty: '',
      litigantArea: '',
      litigantRimin: '',
      litigantAddress: '',
      client: '',
      clientPhone: '',
      clientCounty: '',
      clientArea: '',
      clientRimin: '',
      clientAddress: '',
      remark: '',
      unit: '',
    },
  ]);
  const [addNo, setAddNo] = useState('');
  const [addUnit, setAddUnit] = useState('');

  //使用者資料
  const { member, setMember } = useAuth();

  //抓取後端資料
  const [getHandler, setGetHandler] = useState([]);
  const [getSource, setGetSource] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [getUnit, setGetUnit] = useState([]);
  // const [getCycle, setGetCycle] = useState([]);
  const [getCounty, setGetCounty] = useState([]);
  const [getArea, setGetArea] = useState([]);
  const [getRimin, setGetRimin] = useState([]);
  const [getClientArea, setGetClientArea] = useState([]);
  const [getClientRimin, setGetclientRimin] = useState([]);
  //申請表驗證空值
  const [source, setSource] = useState(false);
  const [category, setCategory] = useState(false);
  // const [cycle, setCycle] = useState(false);
  const [need, setNeed] = useState(false);

  //是否填寫
  // const [litigant, setLitigant] = useState(false);
  // const [client, setClient] = useState(false);

  //友好程度
  const relation = [
    { name: 'VIP' },
    { name: '友善' },
    { name: '無特別喜好' },
    { name: '謾罵抱怨' },
  ];

  // 檢查會員
  // useEffect(() => {
  //   async function getMember() {
  //     try {
  //       // console.log('檢查是否登入');
  //       let response = await axios.get(
  //         `${process.env.REACT_APP_BASE_URL}/api/login/auth`,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       // console.log(response.data);
  //       setMember(response.data);
  //     } catch (err) {
  //       console.log(err.response.data.message);
  //     }
  //   }
  //   getMember();
  // }, []);

  //表格資料填入
  const handleChange = (val, input) => {
    let newData = [...submitValue];
    if (input === 'handler') newData[0].handler = val;
    if (input === 'source') newData[0].source = val;
    if (input === 'category') newData[0].category = val;
    if (input === 'cycle') newData[0].cycle = val;
    if (input === 'name') newData[0].name = val;
    if (input === 'relation') newData[0].relation = val;
    if (input === 'phoneCheck') newData[0].phoneCheck = val;
    if (input === 'litigant') newData[0].litigant = val;
    if (input === 'litigantPhone') newData[0].litigantPhone = val;
    if (input === 'litigantCounty') newData[0].litigantCounty = val;
    if (input === 'litigantArea') newData[0].litigantArea = val;
    if (input === 'litigantRimin') newData[0].litigantRimin = val;
    if (input === 'litigantAddress') newData[0].litigantAddress = val;
    if (input === 'client') newData[0].client = val;
    if (input === 'clientPhone') newData[0].clientPhone = val;
    if (input === 'clientCounty') newData[0].clientCounty = val;
    if (input === 'clientArea') newData[0].clientArea = val;
    if (input === 'clientRimin') newData[0].clientRimin = val;
    if (input === 'clientAddress') newData[0].clientAddress = val;
    if (input === 'remark') newData[0].remark = val;
    if (input === 'unit') newData[0].unit = val;

    setSubmitValue(newData);
  };

  //增加需求
  const addN = () => {
    const newAdd = { text: '' };
    const newAdds = [...addNeed, newAdd];
    setAddNeed(newAdds);
  };
  //填入需求
  const needChangerHandler = (val, i, input) => {
    let newData = [...addNeed];
    // if (input === 'tt') newData[i].title = val;
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
    let newData = [{ text: '' }];
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
  // const handleClearFile = () => {
  //   let newData = [{ file: '' }];
  //   setAddFile(newData);
  // };
  //單個檔案上傳
  const onFileUpload = (val, i, input) => {
    if (val.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: '檔案過大，請小於10MB',
      });
      return;
    }
    let newData = [...addFile];
    if (input === 'file') newData[i].file = val;

    setAddFile(newData);
  };
  // console.log('getHandler', getHandler);
  useEffect(() => {
    //抓取處理人
    let handler = async () => {
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/handler`,
          {
            unit: addUnit,
          },
          { withCredentials: true }
        );
        setGetHandler(res.data);
        // console.log('handler2222');
      } catch (err) {
        console.log(err);
      }
    };
    //抓取案件來源
    let source = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/source`
        );
        setGetSource(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    //抓取案件類別
    let category = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/category`
        );
        setGetCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    //抓取申請單位
    let unit = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/unit`
        );
        setGetUnit(res.data);
        // console.log('object', 222);
      } catch (err) {
        console.log(err);
      }
    };

    //抓取縣市
    let county = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/county`
        );
        setGetCounty(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    handler();
    source();
    category();
    unit();
    county();
  }, [addUnit]);
  // addUnit

  //抓取當事人區
  async function areaPost(county) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/area`,
        { area: county }
      );

      setGetArea(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  //抓取當事人里
  async function riminPost(area) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/rimin`,
        { rimin: area }
      );

      setGetRimin(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  //抓取請託人區
  async function clientAreaPost(county) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/area`,
        { area: county }
      );

      setGetClientArea(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  //抓取請託人里
  async function clientRiminPost(area) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/rimin`,
        { rimin: area }
      );

      setGetclientRimin(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  // 送出申請表sweet
  function submitCheck(tit) {
    console.log('object', tit);
    for (let i = 0; i < addNeed.length; i++) {
      if (addNeed[i].text === '') {
        setNeed(true);
        Swal.fire({
          icon: 'error',
          title: '請填寫需求',
          confirmButtonColor: '#f2ac33',
        });
        return;
      }
    }
    for (let i = 0; i < addFile.length; i++) {
      if (addFile[i].file === '') {
        Swal.fire({
          icon: 'error',
          title: '無檔案',
          confirmButtonColor: '#f2ac33',
        });
        return;
      }
    }
    if (submitValue[0].source === '0' || submitValue[0].source === '') {
      setSource(true);
      Swal.fire({
        icon: 'error',
        title: '請填寫來源',
        confirmButtonColor: '#f2ac33',
      });
    }
    if (submitValue[0].category === '0' || submitValue[0].category === '') {
      setCategory(true);
      Swal.fire({
        icon: 'error',
        title: '請填寫類別',
        confirmButtonColor: '#f2ac33',
      });
    }

    // if (submitValue[0].cycle === '0' || submitValue[0].cycle === '') {
    //   setCycle(true);

    // }

    if (
      submitValue[0].category !== '0' &&
      submitValue[0].category !== '' &&
      submitValue[0].source !== '0' &&
      submitValue[0].source !== ''
      // && submitValue[0].cycle !== ''
    ) {
      Swal.fire({
        title: tit,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '確定送出',
        denyButtonText: `取消送出`,
        confirmButtonColor: '#f2ac33',
        denyButtonColor: '#ccc',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('送出成功', '', 'success').then(() => {
            navigate('/header/caseManagement_handler');
          });
          submitFile();
          submit();
        } else if (result.isDenied) {
          Swal.fire('已取消送出', '', 'info');
        }
      });
    }
  }

  // 儲存申請表sweet
  function storeCheck(tit) {
    for (let i = 0; i < addNeed.length; i++) {
      if (addNeed[i].title === '' || addNeed[i].text === '') {
        setNeed(true);
        Swal.fire({
          icon: 'error',
          title: '請填寫需求',
          confirmButtonColor: '#f2ac33',
        });
        return;
      }
    }
    for (let i = 0; i < addFile.length; i++) {
      if (addFile[i].file === '') {
        Swal.fire({
          icon: 'error',
          title: '無檔案',
          confirmButtonColor: '#f2ac33',
        });
        return;
      }
    }
    if (submitValue[0].source === '0' || submitValue[0].source === '') {
      setSource(true);
      Swal.fire({
        icon: 'error',
        title: '請填寫來源',
        confirmButtonColor: '#f2ac33',
      });
    }

    if (submitValue[0].category === '0' || submitValue[0].category === '') {
      setCategory(true);
      Swal.fire({
        icon: 'error',
        title: '請填寫類別',
        confirmButtonColor: '#f2ac33',
      });
    }

    // if (submitValue[0].cycle === '0' || submitValue[0].cycle === '') {
    //   setCycle(true);
    // }

    if (
      submitValue[0].category !== '0' &&
      submitValue[0].category !== '' &&
      submitValue[0].source !== '0' &&
      submitValue[0].source !== ''
      // &&  submitValue[0].cycle !== ''
    ) {
      Swal.fire({
        title: tit,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '確定儲存',
        denyButtonText: `取消儲存`,
        confirmButtonColor: '#f2ac33',
        denyButtonColor: '#ccc',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('儲存成功', '', 'success').then(() => {
            navigate('/header/caseManagement_handler');
          });
          submitFile();
          store();
        } else if (result.isDenied) {
          Swal.fire('已取消儲存', '', 'info');
        }
      });
    }
  }

  //送出表單內容
  async function submit() {
    try {
      let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_post`,
        {
          ...submitValue[0],
          need: addNeed,
          number: parseInt(Date.now() / 10000),
          id: member.id,
          user: member.name,
          // TODO: 申請狀態 一般職員跟主管送出的狀態不同
          status: 4,
          create_time: endTime,
        },
        {
          withCredentials: true,
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
        `${process.env.REACT_APP_BASE_URL}/api/application_post/file`,
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
    try {
      let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_post`,
        {
          ...submitValue[0],
          need: addNeed,
          number: parseInt(Date.now() / 10000),
          id: member.id,
          user: member.name,
          status: 1,
          create_time: endTime,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log('sub', err);
    }
  }

  return (
    <div className="scroll">
      <div className="container">
        <div className="h3">接案資訊</div>
        <div className="vector"></div>
        {/* 欄位 */}
        <div className="box d-md-flex">
          {/*  案件來源 */}
          <div className="gap">
            <div className="contents18">
              案件來源 <span>*</span>
              {source ? <span>請選欄位</span> : <span>必填</span>}
            </div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'source');
                setAddNo(e.target.value);
              }}
              onClick={(e) => {
                if (e.target.value !== '0') {
                  setSource(false);
                }
              }}
            >
              <option value="0" hidden>
                請選擇來源
              </option>
              {getSource.map((v, i) => {
                return (
                  <option key={i} value={v.number}>
                    {v.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* 單位 */}
          <div className="gap">
            <div className="contents18">
              處理單位 <span>*必填</span>
              {/* {category ? <span>欄位不得為空</span> : <span>必填</span>} */}
            </div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'unit');
                setAddUnit(e.target.value);
              }}
            >
              <option value="0" hidden>
                {member.applicant_unit}
              </option>
              {getUnit.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="box d-md-flex">
          {/* 處理人 */}
          <div className="gap">
            <div className="contents18">處理人</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'handler');
              }}
            >
              <option value=""> 請選擇</option>
              {getHandler.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 友好程度 */}
          <div className="gap">
            <div className="contents18"> 友好程度</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'relation');
              }}
            >
              <option value=" "> 請選擇</option>
              {relation.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 週期 */}
          {/* <div className="gap">
            <div className="cycle">
              需求次數 <span>*</span>
              {cycle ? <span>欄位不得為空</span> : <span>必填</span>}
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
          </div> */}
        </div>
        {/* <div className="box d-md-flex">
          <div className="gap">
            <input
              type="checkBox"
              className="inputCheck me-1"
              onChange={(e) => {
                handleChange(
                  e.target.checked
                    ? (e.target.value = '1')
                    : (e.target.value = '0'),
                  'phoneCheck'
                );
              }}
            />
            <span> 請委員議員致電呈請人</span>
          </div>
        </div> */}
        {/* <div className="box">
          友好程度
          <div className="gap">
            <div> 友好程度(A-D)</div>
            <select
              className="handler"
              onChange={(e) => {
                handleChange(e.target.value, 'relation');
              }}
            >
              <option value=" "> -----請選擇-----</option>
              {relation.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          專案名稱
          <div className="gap">
            <div> 案件名稱</div>
            <input
              className="handler"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'name');
              }}
            />
          </div>
        </div> */}
        <div className="h3">當事人資訊</div>
        <div className="vector"></div>

        <div className="box d-md-flex">
          {/* 當事人 */}
          <div className="gap">
            <div className="contents18">當事人姓名</div>
            <input
              className="handler contents18"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'litigant');
                // eslint-disable-next-line no-lone-blocks
                // {
                //   e.target.value.length > 0
                //     ? setLitigant(true)
                //     : setLitigant(false);
                // }
              }}
            />
          </div>
          <div className="gap">
            <div className="contents18"> 當事人聯絡電話</div>
            <input
              className="handler hide-arrows contents18"
              type="tel"
              maxLength="12"
              onChange={(e) => {
                handleChange(e.target.value, 'litigantPhone');
              }}
            />
          </div>
          {/* 電話 */}
        </div>
        <div className="box d-md-flex">
          {/* 縣市*/}
          <div className="gap">
            <div className="contents18">當事人縣市</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'litigantCounty');
                areaPost(e.target.value);
              }}
            >
              <option value=" "> 請選擇</option>
              {getCounty.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>

          {/* 區*/}
          <div className="gap">
            <div className="contents18">當事人區</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'litigantArea');
                riminPost(e.target.value);
              }}
            >
              <option value=" "> 請選擇</option>
              {getArea.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="box d-md-flex">
          {/* 里 */}
          <div className="gap">
            <div className="contents18">當事人里</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'litigantRimin');
              }}
            >
              <option value=" "> 請選擇</option>
              {getRimin.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 地址 */}
          <div className="gap">
            <div className="contents18"> 當事人地址</div>
            <input
              className="handler contents18"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'litigantAddress');
              }}
            />
          </div>
        </div>
        <div className="h3">請託人資訊</div>
        <div className="vector"></div>
        <div className="box d-md-flex">
          {/* 請託人 */}
          <div className="gap">
            <div className="contents18"> 請託人姓名</div>
            <input
              className="handler contents18"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'client');
                // eslint-disable-next-line no-lone-blocks
                // {
                //   e.target.value.length > 0
                //     ? setClient(true)
                //     : setClient(false);
                // }
              }}
            />
          </div>
          <div className="gap">
            <div className="contents18"> 請託人聯絡電話</div>
            <input
              className="handler hide-arrows contents18"
              type="tel"
              maxLength="12"
              onChange={(e) => {
                handleChange(e.target.value, 'clientPhone');
              }}
            />
          </div>
          {/* 電話 */}
        </div>
        <div className="box d-md-flex">
          {/* 縣市*/}
          <div className="gap">
            <div className="contents18">請託人縣市</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'clientCounty');
                clientAreaPost(e.target.value);
              }}
            >
              <option value=" ">請選擇</option>
              {getCounty.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 區*/}
          <div className="gap">
            <div className="contents18">請託人區</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'clientArea');
                clientRiminPost(e.target.value);
              }}
            >
              <option value=" "> 請選擇</option>
              {getClientArea.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="box d-md-flex">
          {/* 里 */}
          <div className="gap">
            <div className="contents18">請託人里</div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'clientRimin');
              }}
            >
              <option value=" "> 請選擇</option>
              {getClientRimin.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
          {/* 地址 */}
          <div className="gap">
            <div className="contents18"> 請託人地址</div>
            <input
              className="handler contents18"
              type="text"
              onChange={(e) => {
                handleChange(e.target.value, 'clientAddress');
              }}
            />
          </div>
        </div>

        {/* 欄位 end */}
        {/* 需求 */}
        <div className="h3">陳情內容</div>
        <div className="vector"></div>
        <div className="box d-md-flex">
          {/*  案件類別 */}
          <div className="gap">
            <div className="contents18">
              案件類別 <span>*</span>
              {category ? <span>請選欄位</span> : <span>必填</span>}
            </div>
            <select
              className="handler contents18"
              onChange={(e) => {
                handleChange(e.target.value, 'category');
              }}
              onClick={(e) => {
                if (e.target.value !== '0') {
                  setCategory(false);
                }
              }}
            >
              <option value="0" hidden>
                請選擇類別
              </option>
              {getCategory.map((v, i) => {
                return <option key={i}>{v.name}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="add">
          <span className={`${need ? 'view' : ''}`}>*欄位不得為空</span>
          <div>
            {/* <FaTrashAlt
              size="17"
              onClick={() => {
                delCheck('確定要刪除所有需求內容?', handleClearNeed);
              }}
              className="clearIcon"
            /> */}
            <MdOutlineAddBox size="20" onClick={addN} className="addIcon" />
          </div>
        </div>

        <div className="needs">
          {addNeed.map((v, i) => {
            return (
              <div key={i} className="need">
                <div className="one">
                  <div className="contents18">
                    陳情內容{i + 1} (字數限制500)<span>*必填</span>
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
                {/* 
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
                </div> */}
                <div>
                  <textarea
                    className="input contents18"
                    // placeholder="請詳細說明"
                    name="ttt"
                    cols="30"
                    rows="10"
                    maxLength="500"
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
            <div className="fileColumn">
              <div className="contents18">附件上傳 (檔案限制10MB)</div>
              <div className="contents18">
                (可上傳副檔名 csv.txt.png.jpeg.jpg.pdf.xlsx.zip.word.ppt)
              </div>
              {/* <div>(選擇新專案必須上傳RFP 文件)</div> */}
            </div>
            <div className="fileIcon">
              {/* <FaTrashAlt
                size="17"
                onClick={() => {
                  delCheck('確定要刪除所有上傳檔案?', handleClearFile);
                }}
                className="clearIcon"
              /> */}
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
                        <span className="contents18">點擊新增檔案</span>
                      </div>
                    )}
                  </div>
                </label>

                <input
                  className="input d-none"
                  type="file"
                  name="file"
                  id={`file${i}`}
                  accept=".csv,.txt,.png,.jpeg,.jpg,.pdf,.xlsx,.zip,.word,.ppt"
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

        {/* 備註 */}
        <div className="textareaGap">
          <div className="contents18"> 備註 (字數限制100)</div>
          <textarea
            className="textarea contents18"
            maxLength="100"
            onChange={(e) => {
              handleChange(e.target.value, 'remark');
            }}
          ></textarea>
        </div>

        {/* <div className="ps">
          備註: 將由處理人員主動與您聯繫討論預計完成時間。
        </div> */}

        <div className="submitBtn">
          <GenerallyBtn
            style={{ background: '#2c75c8', color: 'white' }}
            tit="儲存"
            handleFn1={storeCheck}
            fn1="確認儲存申請表?"
          />
          <GenerallyBtn
            style={{ background: '#f2ac33', color: 'white' }}
            tit="送出"
            handleFn1={submitCheck}
            fn1="確定要送出申請表?"
          />
          {/* <div
            className="submit"
            onClick={() => {
              storeCheck('確認儲存申請表?');
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Application;
