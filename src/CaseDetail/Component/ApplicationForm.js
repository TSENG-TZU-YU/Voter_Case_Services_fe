import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../utils/use_auth';
import { API_URL } from '../../utils/config';
import { ViewCheck } from '../../SweetComponent/ViewCheck';
import moment from 'moment';

import '../../styles/caseDetail/_applicationForm.scss';
import EditNeedPage from './EditNeedPage';
import AddStateForm from './AddStateForm';
import GenerallyBtn from '../../Btn/GenerallyBtn';
import ProcessingStatus from './ProcessingStatus';
import SelectStatus from './SelectStatus';
// import ProcessingStatus from './ProcessingStatus';

//react-icons
import { MdOutlineAddBox } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
// import { FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';

// 元件
import Loader from '../../Loader';
import ApplicationBtn from '../../Btn/ApplicationBtn';

function ApplicationForm({
  delCheck,
  scrollPage,
  // viewCheck,
}) {
  const { num } = useParams();
  const location = useLocation();
  // 從網址上抓到關鍵字
  let params = new URLSearchParams(location.search);
  let HId = params.get('HId');
  let caseId = params.get('id');
  let Sender = params.get('sender');
  let WebPage = parseInt(params.get('page'));
  let scroll = parseInt(params.get('scroll'));
  let User = parseInt(params.get('user'));

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const [addStateForm, setAddStateForm] = useState(false);
  const { member, setMember } = useAuth();
  const [needState, setNeedState] = useState('');
  const [needData, setNeedData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [handleData, setHandleData] = useState([]);
  const [handlerData, setHandlerData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [remarkLength, setRemarkLength] = useState('');
  const [selCheckData, setSelCheckData] = useState([]);
  const [handlerVal, setHandlerVal] = useState({ val: '' });
  const [postVal, setPostVal] = useState({
    caseNumber: '',
    handler: '',
    status: '',
    transfer: '',
    remark: '',
    finishTime: '',
  });
  const [selVal, setSelVal] = useState({});
  const [nowSelState, setNowSelState] = useState('');

  const [selectRemind, setSelectRemind] = useState(false);
  const [postValRemind, setPostValRemind] = useState(false);
  const [postCaseRemind, setPostCaseRemind] = useState(false);
  const [editVerifyPage, setEditVerifyPage] = useState(false);

  const [needLoading, setNeedLoading] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [needLen, setNeedLen] = useState('');
  const [needSumLen, setNeedSumLen] = useState('');
  const [handlerUnit, setHandlerUnit] = useState('');

  const [editNeed, setEditNeed] = useState([]);
  const [getFile, setGetFile] = useState([]);
  const [getDbFileTime, setGetDbFileTime] = useState([]);

  let endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  //友好程度
  const relation = [
    { name: 'VIP' },
    { name: '友善' },
    { name: '無特別喜好' },
    { name: '謾罵抱怨' },
  ];

  // 檢查會員
  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/login/auth`,
          {
            withCredentials: true,
          }
        );

        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    // getMember();

    // if (member.user === 1) {
    //   setAddStatus(false);
    // }needLoading
  }, [detailData]);

  // 修改申請表
  const [edit, setEdit] = useState(true);
  const [fileUpdate, setFileUpdate] = useState(false);
  const [addUnit, setAddUnit] = useState('');
  const [editUnit, setEditUnit] = useState(false);

  //抓取後端資料
  const [getHandler, setGetHandler] = useState([]);
  const [getSource, setGetSource] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [getCounty, setGetCounty] = useState([]);
  const [getArea, setGetArea] = useState([]);
  const [getUnit, setGetUnit] = useState([]);
  const [getRimin, setGetRimin] = useState([]);

  //表格資料填入
  const handleChange = (val, input) => {
    let newData = [...detailData];
    if (input === 'handler') newData[0].handler = val;
    if (input === 'source') newData[0].application_source = val;
    if (input === 'category') newData[0].application_category = val;
    if (input === 'cycle') newData[0].cycle = val;
    if (input === 'name') newData[0].project_name = val;
    if (input === 'relation') newData[0].relation = val;
    if (input === 'phoneCheck') newData[0].phoneCheck = val;
    if (input === 'litigant') newData[0].litigant = val;
    if (input === 'litigantPhone') newData[0].litigant_phone = val;
    if (input === 'litigantCounty') newData[0].litigant_county_id = val;
    if (input === 'litigantArea') newData[0].litigant_area_id = val;
    if (input === 'litigantRimin') newData[0].litigant_rimin = val;
    if (input === 'litigantAddress') newData[0].litigantAddress = val;
    if (input === 'client') newData[0].client = val;
    if (input === 'clientPhone') newData[0].client_phone = val;
    if (input === 'clientCounty') newData[0].client_county = val;
    if (input === 'clientArea') newData[0].client_area = val;
    if (input === 'clientRimin') newData[0].client_rimin = val;
    if (input === 'clientAddress') newData[0].client_address = val;
    if (input === 'remark') newData[0].remark = val;
    if (input === 'unit') newData[0].unit = val;
    setDetailData(newData);
  };
  //申請表驗證空值
  const [source, setSource] = useState(false);
  const [category, setCategory] = useState(false);
  // const [cycle, setCycle] = useState(false);

  //是否填寫
  // const [litigant, setLitigant] = useState(true);
  // const [client, setClient] = useState(true);

  //增加上傳檔案
  const addF = () => {
    const newAdds = [...getFile, { file: '' }];
    setGetFile(newAdds);
  };
  //刪除檔案
  const deleteFile = (i) => {
    let newData = [...getFile];
    newData.splice(i, 1); //刪除1個
    if (setGetFile.length === 0) return; //if長度=0 無法再刪除
    setGetFile(newData);
  };
  // 清空檔案
  // const handleClearFile = () => {
  //   let newData = [{ file: '' }];
  //   setGetFile(newData);
  // };
  //單個檔案上傳
  const onFileUpload = (val, i, input) => {
    if (val.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: '檔案過大，請小於10MB',
        confirmButtonColor: '#f2ac33',
      });
      return;
    }
    let newData = [...getFile];
    if (input === 'file') newData[i].file = val;

    setGetFile(newData);
  };
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
      } catch (err) {
        console.log(err);
      }
    };
    //抓取案件來源
    let source = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/source`,
          {
            withCredentials: true,
          }
        );
        setGetSource(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    //抓取申請類別
    let category = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/category`,
          {
            withCredentials: true,
          }
        );
        setGetCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    //抓取案件類別
    let unit = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/unit`,
          {
            withCredentials: true,
          }
        );
        setGetUnit(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    //抓取縣市
    let county = async () => {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/application_get/county`,
          {
            withCredentials: true,
          }
        );
        setGetCounty(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    handler();
    source();
    category();
    county();
    unit();
  }, [edit, addUnit]);

  //抓取區
  async function areaPost(county) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/area`,
        { area: county },
        {
          withCredentials: true,
        }
      );

      setGetArea(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  //抓取里
  async function riminPost(area) {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_get/rimin`,
        { rimin: area },
        {
          withCredentials: true,
        }
      );

      setGetRimin(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  //確認儲存sweet
  function storeCheck(e, tit) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定儲存',
      denyButtonText: `取消儲存`,
      confirmButtonColor: '#f2ac33',
      denyButtonColor: '#ccc',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '儲存成功',
          confirmButtonColor: '#f2ac33',
        }).then(() => {
          setEdit(true);
        });
        hanleAddNeed(e, 'edit');
        submitFile();
        store();
        setEditUnit(false);
      } else if (result.isDenied) {
        Swal.fire({
          icon: 'info',
          title: '已取消儲存',
          confirmButtonColor: '#f2ac33',
        });
      }
    });
  }

  //確認刪除sweet
  function deleteCheck(tit) {
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
        }).then(() => {
          navigate('/casemgmt/header/caseManagement_handler');
        });
        deleteForm();
      } else if (result.isDenied) {
        Swal.fire({
          icon: 'info',
          title: '已取消刪除',
          confirmButtonColor: '#f2ac33',
        });
      }
    });
  }

  // 送出申請表sweet
  function submitCheck(e, tit) {
    for (let i = 0; i < editNeed.length; i++) {
      if (
        // editNeed[i].requirement_name === '' ||
        editNeed[i].directions === ''
      ) {
        setEditVerifyPage(true);
        return;
      }
    }
    for (let i = 0; i < getFile.length; i++) {
      if (getFile[i].file === '') {
        Swal.fire({
          icon: 'error',
          title: '無檔案',
          confirmButtonColor: '#f2ac33',
        });
        return;
      }
    }
    if (detailData[0].source === '0' || detailData[0].source === '') {
      setCategory(true);
    }
    if (detailData[0].category === '0' || detailData[0].category === '') {
      setCategory(true);
    }

    // if (detailData[0].cycle === '0' || detailData[0].cycle === '') {
    //   setCycle(true);
    // }

    if (
      detailData[0].category !== '0' &&
      detailData[0].category !== '' &&
      detailData[0].source !== '0' &&
      detailData[0].source !== ''
      // && detailData[0].cycle !== ''
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
          Swal.fire({
            icon: 'success',
            title: '送出成功',
            confirmButtonColor: '#f2ac33',
          }).then(() => {
            navigate('/casemgmt/header/caseManagement_handler');
          });
          submitFile();
          hanleAddNeed(e, 'submit');
          submit();
        } else if (result.isDenied) {
          Swal.fire({
            icon: 'info',
            title: '已取消送出',
            confirmButtonColor: '#f2ac33',
          });
        }
      });
    }
  }

  //送出表單內容
  async function submit() {
    try {
      record_appSubmit();
      let response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/submit/${num}`,
        {
          ...detailData[0],
          status_id: 4,
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

  //送出稽核
  const record_appSubmit = async () => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/audit/appSubmit`,
        { user: member.staff_code, number: num, create_time: endTime },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //儲存表單內容
  async function store() {
    try {
      let response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/store/${num}`,
        {
          ...detailData[0],
          // TODO: 申請狀態 主管權限是1 || 0 判斷
          status_id: 1,
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
      let noTime = moment(Date.now()).format('YYYYMMDDHHmmss');
      const formData = new FormData();
      // 取得刪除後端檔案的年份
      if (getDbFileTime.length > 0) {
        let str = getDbFileTime.indexOf('-');
        let dbTime = getDbFileTime.substr(str + 1, 6);
        formData.append('dbTime', dbTime);
      } else {
        formData.append('dbTime', 0);
      }

      for (let i = 0; i < getFile.length; i++) {
        formData.append(i, getFile[i].file);

        formData.append('file', getFile[i].file.file_no);
      }

      formData.append('fileNo', '-' + noTime);
      formData.append('No', detailData[0].application_category);
      formData.append('number', num);
      formData.append('create_time', endTime);
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/file/${num}`,
        formData,
        {
          withCredentials: true,
        },
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

  //刪除表單(未送審)
  async function deleteForm() {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/deleteForm/${num}`,
        {
          ...detailData[0],
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log('sub', err);
    }
  }

  //scroll
  const scrollRef1 = useRef();
  const scrollRef2 = useRef();
  useEffect(() => {
    if (scrollRef1.current && scroll === 1) {
      scrollRef1.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
    if (scrollRef2.current && scroll === 2) {
      scrollRef2.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [scrollPage, isLoading]);
  // 取得detail Id 的值
  useEffect(() => {
    setIsLoading(true);
    // let params = new URLSearchParams(location.search);
    // let caseId = params.get('id');
    let getCampingDetailData = async () => {
      let response = await axios.post(
        `${API_URL}/applicationData/${num}`,
        { caseId },
        {
          withCredentials: true,
        }
      );
      setDetailData(response.data.result);
      setNeedData(response.data.needResult);
      setHandlerUnit(response.data.result[0].unit);
      setSelVal(response.data.selCheckResult[0]);
      setNowSelState(response.data.nowStateResult[0].name);
      // console.log('first', response.data.nowStateResult[0].name);
      // 修改儲存用
      setEditNeed(response.data.needResult);
      setHandleData(response.data.handleResult);
      setHandlerData(response.data.handlerResult);
      let a = response.data.getFile;
      let newFiles = [];
      for (let i = 0; i < a.length; i++) {
        let data = { file: a[i] };
        newFiles.push(data);
      }

      setGetFile(newFiles);

      if (getFile.length > 0) {
        setGetDbFileTime(response.data.getFile[0].file_no);
      }
      // selectStatus filter
      if (
        member.manage === 1 &&
        (member.handler === 0 || (member.handler === 1 && member.name !== HId))
      ) {
        setSelectData(response.data.selectResult.splice(5, 3));
      }
      if (member.handler === 1 && member.name === HId) {
        setSelectData(response.data.selectResult);
      }
      // 目前狀態
      setNeedState(response.data.result[0].status_id);
      setNeedLen(parseInt(response.data.needResult.length));
      setNeedSumLen(parseInt(response.data.needSum[0].checked));
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    getCampingDetailData();
  }, [num, needLoading, needState, caseId, edit]);

  useEffect(() => {
    let getCampingDetailData = async () => {
      let response = await axios.post(
        `${API_URL}/applicationData/${num}`,
        { caseId },
        {
          withCredentials: true,
        }
      );
      setRemarkLength(response.data.remarkResult.length);
      setSelCheckData(response.data.selCheckResult);
    };

    getCampingDetailData();
  }, [proLoading, loading]);

  // 需求 checked
  const handleNeedChecked = async (needId, checked) => {
    if (checked === false) {
      let response = await axios.put(
        `${API_URL}/applicationData/checked/${needId}`,
        {
          withCredentials: true,
        }
      );
      setNeedLoading(!needLoading);
    } else {
      let response = await axios.put(
        `${API_URL}/applicationData/unChecked/${needId}`,
        {
          withCredentials: true,
        }
      );
      setNeedLoading(!needLoading);
    }
  };

  //   需求修改表單
  // add need
  const handleAddNeed = () => {
    let newData = [
      ...editNeed,
      {
        requirement_name: '',
        directions: '',
        case_number_id: detailData[0].case_number,
      },
    ];
    setEditNeed(newData);
  };

  // del need
  const handleDelNeed = (i) => {
    if (editNeed.length === 1) return;
    let newData = [...editNeed];
    newData.splice(i, 1);
    setEditNeed(newData);
  };

  // del all need
  // const handleDelAllNeed = () => {
  //   let newData = [
  //     {
  //       requirement_name: '',
  //       directions: '',
  //       case_number_id: detailData[0].case_number,
  //     },
  //   ];
  //   setEditNeed(newData);
  // };

  //   update contain
  const handlerUpdateNeed = (val, i, input) => {
    let newData = [...editNeed];
    if (input === 'tit') newData[i].requirement_name = val;
    if (input === 'dir') newData[i].directions = val;
    setEditNeed(newData);
    setEditVerifyPage(false);
  };

  // post 處理狀態
  const handlePostVal = (e) => {
    let val = {
      ...postVal,
      [e.target.name]: e.target.value,
      handler: detailData[0].handler,
      caseNumber: detailData[0].case_number,
    };

    setPostVal(val);
  };

  // post 處理狀態
  const handlePostHandle = async (e) => {
    e.preventDefault();
    if (postVal.transfer === '' && postVal.status === '處理人轉件中') {
      setPostValRemind(true);
      return;
    }
    if (postVal.finishTime === '' && postVal.status === '案件進行中') {
      setPostCaseRemind(true);
      return;
    }

    if (remarkLength === 0 && postVal.status === '結案') {
      Swal.fire({
        icon: 'info',
        title: '請在『案件處理情形』，填寫處理狀況',
      }).then(function () {
        setAddStateForm(false);
      });
      return;
    }

    let response = await axios.post(
      `${API_URL}/applicationData/postHandle`,
      { ...postVal, ...detailData },
      {
        withCredentials: true,
      }
    );

    Swal.fire({
      icon: 'success',
      title: '完成',
      confirmButtonColor: '#f2ac33',
    }).then(function () {
      setNeedLoading(!needLoading);
      setAddStateForm(false);
      setPostVal({
        caseNumber: '',
        handler: '',
        status: '',
        transfer: '',
        remark: '',
        finishTime: '',
      });

      navigate(`/casemgmt/header/caseManagement_handler`);
    });
  };

  // post 修改需求
  const hanleAddNeed = async (e, input) => {
    e.preventDefault();
    if (input !== 'edit') {
      for (let i = 0; i < editNeed.length; i++) {
        if (
          // editNeed[i].requirement_name === '' ||
          editNeed[i].directions === ''
        ) {
          setEditVerifyPage(true);
          return;
        }
      }
    }

    let response = await axios.post(
      `${API_URL}/applicationData/postAddNeed`,
      [detailData[0].handler, editNeed, caseId, input],
      {
        withCredentials: true,
      }
    );

    if (input === 'finish') {
      ViewCheck('修改成功', setNeedLoading, needLoading, setEditPage, false);
      navigate(`/casemgmt/header/caseManagement_handler`);
    }

    // if (input === 'finish') {
    //   Swal.fire({
    //     icon: 'success',
    //     title: '修改成功',
    //   }).then(function () {
    //     setNeedLoading(!needLoading);
    //     setEditPage(false);

    //     navigate(`/header`);
    //   });
    // }
  };

  // put user取消申請
  let handleUserCancle = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/cancleAcc/${detailData[0].case_number}`,
      { user: detailData[0].user, id: caseId },
      {
        withCredentials: true,
      }
    );

    ViewCheck('申請案件已取消', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);

    // Swal.fire({
    //   icon: 'success',
    //   title: '申請案件已取消',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // 確認接收轉件
  let handleAcceptCase = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/acceptCase`,
      detailData,
      {
        withCredentials: true,
      }
    );

    ViewCheck('已接收此案件', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '已接收此案件',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // 拒絕接收轉件
  let handleRejectCase = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/rejectCase`,
      detailData,
      {
        withCredentials: true,
      }
    );

    ViewCheck('已拒絕接收此案件', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '已拒絕接收此案件',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // finish --> 11
  let handleFinish = async () => {
    if (remarkLength === 0) {
      Swal.fire({
        icon: 'info',
        title: '請點選上方選單列的『案件處理情形』，填寫處理狀況',
        confirmButtonColor: '#f2ac33',
      }).then(function () {});
      return;
    }

    let response = await axios.post(
      `${API_URL}/applicationData/applicationFinish/${num}`,
      { caseId },
      {
        withCredentials: true,
      }
    );

    ViewCheck('案件已完成', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '案件已完成',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // 沒有指定handler, 確認接收
  let handleReceiveCase = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/handlerReceiveCase/${num}`,
      { caseId },
      {
        withCredentials: true,
      }
    );

    ViewCheck('已確定接收此案件', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '已確定接收此案件',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // user 確定完成案件
  let handleAcceptFinish = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/acceptFinish`,
      detailData,
      {
        withCredentials: true,
      }
    );

    ViewCheck('該案件已完成', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '該案件已完成',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  // user 拒絕完成案件
  let handleRejectFinish = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/rejectFinish`,
      detailData,
      {
        withCredentials: true,
      }
    );

    ViewCheck('該案件未完成，案件進行中', setNeedLoading, needLoading);
    navigate(`/casemgmt/header/caseManagement_handler`);
    // Swal.fire({
    //   icon: 'success',
    //   title: '該案件未完成，案件進行中',
    // }).then(function () {
    //   setNeedLoading(!needLoading);
    //   navigate(`/header`);
    // });
  };

  let needEdit = () => {
    setEditNeed([...needData]);
    setEditPage(true);
  };

  // 案件處理情形 checked
  const handleStateChecked = async (needId, checked, Ind, caseNum) => {
    // console.log('a', needId, checked, Ind);
    if (checked === false) {
      let response = await axios.post(
        `${API_URL}/applicationData/selChecked/${needId}`,
        { Ind, caseNum },
        {
          withCredentials: true,
        }
      );
      setProLoading(!proLoading);
    } else {
      let response = await axios.post(
        `${API_URL}/applicationData/selUnChecked/${needId}`,
        { Ind, caseNum },
        {
          withCredentials: true,
        }
      );
      setProLoading(!proLoading);
    }
  };

  // 民眾反饋
  const handlepopulaceMsg = async (needId) => {
    // console.log('rrr',needId);
    let response = await axios.post(
      `${API_URL}/applicationData/populaceMsg/${needId}`,
      selVal,
      {
        withCredentials: true,
      }
    );
    Swal.fire({
      icon: 'success',
      title: '填寫完成',
      confirmButtonColor: '#f2ac33',
    });
    // setNeedLoading(!needLoading);
  };

  return (
    <>
      {/* test BTN */}
      {/* <GenerallyBtn
        style={{ background: '#2c75c8', color: 'white' }}
        tit="修改"
      />
      <GenerallyBtn
        style={{ background: '#f2ac33', color: 'white' }}
        tit="送出"
      />
      <GenerallyBtn style={{ background: '#ccc', color: '#444' }} tit="刪除" />
      <GenerallyBtn
        style={{ background: '#e77979', color: 'white' }}
        tit="上傳"
      /> */}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="appFormContainer">
            {/* 處理人申請狀態btn */}
            {addStateForm ? (
              <AddStateForm
                setAddStateForm={setAddStateForm}
                handlePostVal={handlePostVal}
                handlerData={handlerData}
                setHandlerVal={setHandlerVal}
                handlerVal={handlerVal}
                postVal={postVal}
                handlePostHandle={handlePostHandle}
                postValRemind={postValRemind}
                setPostValRemind={setPostValRemind}
                postCaseRemind={postCaseRemind}
                setPostCaseRemind={setPostCaseRemind}
              />
            ) : (
              ''
            )}

            {/* 修改表單btn */}
            {editPage ? (
              <EditNeedPage
                setEditPage={setEditPage}
                handleAddNeed={handleAddNeed}
                editNeed={editNeed}
                handleDelNeed={handleDelNeed}
                handlerUpdateNeed={handlerUpdateNeed}
                detailData={detailData}
                needData={needData}
                hanleAddNeed={hanleAddNeed}
                editVerifyPage={editVerifyPage}
                setEditVerifyPage={setEditVerifyPage}
                caseId={caseId}
                delCheck={delCheck}
              />
            ) : (
              ''
            )}

            {/* 頁籤 */}
            <div ref={scrollRef1}></div>

            {/* user  需求修改Btn */}
            {needState === 7 &&
            member.user === 1 &&
            HId === member.name &&
            WebPage === 2 ? (
              <ApplicationBtn
                handleFn1={needEdit}
                tit="請點選按鈕進行需求修改"
                accTit="修改需求"
              />
            ) : (
              ''
            )}

            {/* handler轉件  是否接件 */}
            {member.handler === 1 &&
            needState === 8 &&
            member.name === Sender &&
            WebPage === 2 ? (
              <ApplicationBtn
                handleFn1={handleAcceptCase}
                handleFn2={handleRejectCase}
                tit="請確認是否接收此案件?"
                accTit="是，確認接收此案件"
                rejTit="否，無法接收此案件"
              />
            ) : (
              ''
            )}

            {/* handler === '' 確認接收此案件 */}
            {member.handler === 1 &&
            HId === '' &&
            needState === 4 &&
            WebPage === 2 &&
            member.applicant_unit === handlerUnit ? (
              <ApplicationBtn
                handleFn1={handleReceiveCase}
                tit="此案件目前沒有處理人，請點選確認接收此案"
                accTit="確認接收"
              />
            ) : (
              ''
            )}

            {/* handler完成  待user確認 */}
            {/* {member.user === 1 &&
            needState === 11 &&
            User === member.name &&
            WebPage === 2 ? (
              <ApplicationBtn
                handleFn1={handleAcceptFinish}
                handleFn2={handleRejectFinish}
                tit="處理人已完成需求項目，請申請人點選按鈕確認是否完成?"
                accTit="是，處理人已完成所有需求項目"
                rejTit="否，處理人尚有需求未完成"
              />
            ) : (
              ''
            )} */}

            {/* handler  接收需求Btn */}
            {/* {needState === 13 && handler === false ? (
            <div className="editBtn" onClick={handleCheckAccept}>
              需求已修改完成，請點選確認接收
            </div>
          ) : (
            ''
          )}
          <>
            <div className="editBtn" onClick={handleAcceptCase}>
              是，確認接收此案件
            </div>
            <div className="editBtn" onClick={handleRejectCase}>
              否，無法接收此案件
            </div>
          </> */}

            {/* 處理狀態 */}
            {handleData.length !== 0 ? (
              <>
                <div className="statusFormTit">案件處理歷程</div>
                <div className="statusFormContainer">
                  {handleData.map((v) => {
                    return (
                      <div className="statusFormContain" key={uuidv4()}>
                        <div className="mb-2">
                          <span> &emsp;&emsp;操作人員：</span>
                          <span>{v.handler}</span>
                        </div>
                        <div className="mb-2">
                          <span>&emsp;&emsp;操作狀態：</span>
                          <span>{v.status}</span>
                        </div>
                        <div className="statusTime mb-2">
                          <span>&emsp;&emsp;操作時間：</span>
                          <span>{v.create_time}</span>
                        </div>
                        {v.remark !== '' ? (
                          <div className="d-flex mb-2">
                            <span>&emsp;&emsp;&emsp;&emsp;備註：</span>
                            <textarea
                              // cols="40"
                              rows="3"
                              placeholder={v.remark}
                              disabled
                            ></textarea>
                          </div>
                        ) : (
                          ''
                        )}
                        {v.select_state === 5 && v.estimated_time !== null ? (
                          <div>
                            <span>預計完成時間：</span>
                            <span>{v.estimated_time}</span>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="nullData">尚無處理歷程</div>
            )}

            {/* 申請表單 */}
            <div className="tableContainer">
              <div className="appTitle">接案資訊</div>
              <div className="vector"></div>
              {detailData.map((v, i) => {
                return (
                  <div key={v.id}>
                    <div className="gapContain my-md-2 d-md-flex">
                      <div className="my-1">
                        <div className="pb-1 ">案件來源</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.application_source}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="category"
                            onChange={(e) => {
                              handleChange(e.target.value, 'source');
                            }}
                            onClick={(e) => {
                              if (e.target.value !== '0') {
                                setSource(false);
                              }
                            }}
                          >
                            <option hidden>{v.application_source}</option>
                            {getSource.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      <div className="my-2">
                        <div className="pb-1 ">處理人單位單位</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.unit}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="category"
                            onChange={(e) => {
                              handleChange(e.target.value, 'unit');
                              setAddUnit(e.target.value);
                              setEditUnit(true);
                            }}
                          >
                            <option hidden>{v.unit}</option>
                            {getUnit.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* <div>
                      <div className="pb-1">案件編號</div>

                      <input
                        type="text"
                        placeholder={v.case_number}
                        disabled
                        defaultChecked={true} //不受控制的組件的使用
                      />
                    </div> */}
                    </div>
                    <div className="gapContain my-md-2 d-md-flex">
                      <div className="my-1">
                        <div className="pb-1">處理人</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.handler}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="handler"
                            onChange={(e) => {
                              handleChange(e.target.value, 'handler');
                            }}
                          >
                            {editUnit ? (
                              ''
                            ) : (
                              <option hidden>{v.handler}</option>
                            )}

                            <option value="">-----請選擇-----</option>
                            {getHandler.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* {v.relation === '' && v.status_id !== 1 ? (
                      ''
                    ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">友好程度</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.relation}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="handler"
                            onChange={(e) => {
                              handleChange(e.target.value, 'relation');
                            }}
                          >
                            <option hidden>{v.relation}</option>
                            {relation.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* )} */}
                      {/* <div>
                      <div className="pb-1">需求次數</div>
                      <div className="d-flex align-items-center">
                        {radioInput.map((d, i) => {
                          return (
                            <div
                              className="d-flex align-items-center"
                              key={uuidv4()}
                            >
                              <input
                                type="radio"
                                disabled={edit}
                                checked={v.cycle === d.value ? true : false}
                                // defaultChecked={true}
                                onChange={(e) => {
                                  handleChange(e.target.value, 'cycle');
                                  if (e.target.value !== '') {
                                    setCycle(false);
                                  }
                                }}
                                value={i + 1}
                              />
                              <label>{d.title}</label>
                            </div>
                          );
                        })}
                      </div>
                    </div> */}
                    </div>

                    {/* <div className="gapContain my-2">
                      <div>
                        {edit ? (
                          <input
                            type="checkBox"
                            disabled
                            defaultChecked={true}
                            className="inputCheck me-1"
                            checked={v.phoneCheck === 1 ? true : false}
                          />
                        ) : (
                          <input
                            type="checkBox"
                            className="inputCheck me-1"
                            checked={v.phoneCheck === 1 ? true : false}
                            onChange={(e) => {
                              handleChange(
                                e.target.checked
                                  ? (v.phoneCheck = 1)
                                  : (v.phoneCheck = 0),
                                'phoneCheck'
                              );
                            }}
                          />
                        )}

                        <span> 請委員議員致電呈請人</span>
                      </div>
                    </div> */}
                    {/* <div className="gapContain my-2">
                    {v.relation === '' && v.status_id !== 1 ? (
                      ''
                    ) : (
                      <div>
                        <div className="pb-1">友好程度</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.relation}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="handler"
                            onChange={(e) => {
                              handleChange(e.target.value, 'relation');
                            }}
                          >
                            <option selected disabled hidden>
                              {v.relation}
                            </option>
                            {relation.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                    )}
                    {v.project_name === '' && v.status_id !== 1 ? (
                      ''
                    ) : (
                      <div>
                        <div className="pb-1">案件名稱</div>
                        <input
                          type="text"
                          // placeholder={v.project_name}
                          disabled={edit}
                          // defaultValue={true}
                          value={v.project_name}
                          onChange={(e) => {
                            handleChange(
                              (v.project_name = e.target.value),
                              'name'
                            );
                          }}
                        />
                      </div>
                    )}
                  </div> */}
                    {/* 當事人 */}
                    {/* {v.litigant === '' && v.status_id !== 1 ? (
                    ''
                  ) : ( */}
                    <div className="appTitle">當事人資訊</div>
                    <div className="vector"></div>
                    <div className="gapContain my-md-2 d-md-flex">
                      {/* {v.litigant === '' && v.status_id !== 1 ? (
                        ''
                      ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人姓名</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.litigant}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            className="handler"
                            type="text"
                            value={v.litigant}
                            onChange={(e) => {
                              handleChange(
                                (v.litigant = e.target.value),
                                'litigant'
                              );
                              // eslint-disable-next-line no-lone-blocks
                              // {
                              //   e.target.value.length > 0
                              //     ? setLitigant(true)
                              //     : setLitigant(false);
                              // }
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                      {/* {v.litigant_phone === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人聯絡電話</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.litigant_phone}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            className=" hide-arrows"
                            type="tel"
                            value={v.litigant_phone}
                            maxLength="12"
                            onChange={(e) => {
                              handleChange(
                                (v.litigant_phone = e.target.value),
                                'litigantPhone'
                              );
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                    </div>
                    <div className="gapContain my-md-2 d-md-flex">
                      {/* {v.litigant_county_id === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人縣市</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.litigant_county_id}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            onChange={(e) => {
                              handleChange(e.target.value, 'litigantCounty');
                              areaPost(e.target.value);
                            }}
                          >
                            <option hidden>{v.litigant_county_id}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getCounty.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* )} */}
                      {/* {v.litigant_area_id === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人區</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.litigant_area_id}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            onChange={(e) => {
                              handleChange(e.target.value, 'litigantArea');
                              riminPost(e.target.value);
                            }}
                          >
                            <option hidden>{v.litigant_area_id}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getArea.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* )} */}
                    </div>
                    <div className="gapContain my-md-2 d-md-flex ">
                      {/* {v.litigant_rimin === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人里</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.litigant_rimin}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="handler"
                            onChange={(e) => {
                              handleChange(e.target.value, 'litigantRimin');
                            }}
                          >
                            <option hidden>{v.litigant_rimin}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getRimin.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* )} */}
                      {/* {v.litigant_address === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人地址</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.litigant_address}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            type="text"
                            value={v.litigant_address}
                            onChange={(e) => {
                              handleChange(
                                (v.litigant_address = e.target.value),
                                'litigantAddress'
                              );
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                    </div>

                    {/* )} */}
                    {/* {v.client_name === '' && v.status_id !== 1 ? (
                    ''
                  ) : ( */}
                    <div className="appTitle">請託人資訊</div>
                    <div className="vector"></div>
                    <div className="gapContain my-md-2 d-md-flex">
                      {/* {v.client_name === '' && v.status_id !== 1 ? (
                        ''
                      ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">請託人姓名</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.client_name}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            type="text"
                            value={v.client_name}
                            onChange={(e) => {
                              handleChange(
                                (v.client_name = e.target.value),
                                'client'
                              );
                              // eslint-disable-next-line no-lone-blocks
                              // {
                              //   e.target.value.length > 0
                              //     ? setClient(true)
                              //     : setClient(false);
                              // }
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                      {/* {v.client_phone === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">請託人聯絡電話</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.client_phone}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            className="hide-arrows"
                            type="tel"
                            value={v.client_phone}
                            maxLength="12"
                            onChange={(e) => {
                              handleChange(
                                (v.client_phone = e.target.value),
                                'clientPhone'
                              );
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                    </div>
                    <div className="gapContain my-md-2 d-md-flex">
                      {/* {v.litigant_county_id === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">當事人縣市</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.client_county}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            onChange={(e) => {
                              handleChange(e.target.value, 'clientCounty');
                              areaPost(e.target.value);
                            }}
                          >
                            <option hidden>{v.client_county}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getCounty.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>

                      <div className="my-1">
                        <div className="pb-1">當事人區</div>
                        {edit ? (
                          <input
                            type="text"
                            placeholder={v.client_area}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            onChange={(e) => {
                              handleChange(e.target.value, 'clientArea');
                              riminPost(e.target.value);
                            }}
                          >
                            <option hidden>{v.client_area}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getArea.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="gapContain my-md-2 d-md-flex">
                      <div className="my-1">
                        <div className="pb-1">當事人里</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.client_rimin}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <select
                            className="handler"
                            onChange={(e) => {
                              handleChange(e.target.value, 'clientRimin');
                            }}
                          >
                            <option hidden>{v.client_rimin}</option>
                            <option value=" "> -----請選擇-----</option>
                            {getRimin.map((v, i) => {
                              return <option key={i}>{v.name}</option>;
                            })}
                          </select>
                        )}
                      </div>
                      {/* {v.client_address === '' && v.status_id !== 1 ? (
                          ''
                        ) : ( */}
                      <div className="my-1">
                        <div className="pb-1">請託人地址</div>
                        {edit ? (
                          <input
                            type="text"
                            value={v.client_address}
                            disabled
                            defaultChecked={true}
                          />
                        ) : (
                          <input
                            className="handler"
                            type="text"
                            value={v.client_address}
                            onChange={(e) => {
                              handleChange(
                                (v.client_address = e.target.value),
                                'clientAddress'
                              );
                            }}
                          />
                        )}
                      </div>
                      {/* )} */}
                    </div>

                    {/* )} */}
                  </div>
                );
              })}
              {/* 需求 */}
              <div className="appTitle">陳情內容</div>
              <div className="vector"></div>
              {detailData.map((v) => {
                return (
                  <div key={v.id} className="gapContain my-md-2 d-md-flex">
                    <div>
                      <div className="pb-1">案件類別</div>
                      {edit ? (
                        <input
                          type="text"
                          placeholder={v.application_category}
                          disabled
                          defaultChecked={true}
                        />
                      ) : (
                        <select
                          className="category"
                          onChange={(e) => {
                            handleChange(e.target.value, 'category');
                          }}
                          onClick={(e) => {
                            if (e.target.value !== '0') {
                              setCategory(false);
                            }
                          }}
                        >
                          <option hidden>{v.application_category}</option>
                          {getCategory.map((v, i) => {
                            return <option key={i}>{v.name}</option>;
                          })}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
              {edit ? (
                ''
              ) : (
                <div className="add">
                  <span className={`${editVerifyPage ? 'view' : ''}`}>
                    *欄位不得為空
                  </span>
                  <div>
                    {/* <FaTrashAlt
                    size="17"
                    onClick={() => {
                      delCheck('確定要刪除所有需求內容?', handleDelAllNeed);
                    }}
                    className="clearIcon"
                  /> */}
                    <MdOutlineAddBox
                      size="20"
                      onClick={handleAddNeed}
                      className="addIcon"
                    />
                  </div>
                </div>
              )}

              {editNeed.map((v, i) => {
                return (
                  <div className="needContain" key={i}>
                    <div className="needTit">
                      {/* <div className="checkInput">
                        <input
                          type="checkbox"
                          disabled={
                            member.manage === 1
                              ? member.handler === 1 &&
                                HId === member.name &&
                                member.manage === 1 &&
                                needState !== 1 &&
                                needState !== 2 &&
                                needState !== 3 &&
                                needState !== 4 &&
                                needState !== 8 &&
                                needState !== 9 &&
                                needState !== 10 &&
                                needState !== 11 &&
                                needState !== 12 &&
                                WebPage === 2
                                ? false
                                : true
                              : member.handler === 1 &&
                                needState !== 1 &&
                                needState !== 2 &&
                                needState !== 3 &&
                                needState !== 4 &&
                                needState !== 8 &&
                                needState !== 9 &&
                                needState !== 10 &&
                                needState !== 11 &&
                                needState !== 12 &&
                                WebPage === 2
                              ? false
                              : true
                          }
                          checked={v.checked === 1 ? true : false}
                          onChange={(e) => {
                            handleNeedChecked(v.id, e.target.checked);
                          }}
                           add <div className=""></div>
                        />
                      </div> */}
                      <div className="needCount">
                        <span className="title">
                          陳情內容 {i + 1}
                          {edit ? '' : ' (字數限制500)'}
                        </span>
                      </div>

                      {edit ? (
                        ''
                      ) : (
                        <>
                          {i !== 0 ? (
                            <AiFillCloseCircle
                              className="delNeedIcon"
                              onClick={() => {
                                delCheck(
                                  '確定要刪除此需求內容?',
                                  handleDelNeed,
                                  i
                                );
                              }}
                            />
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </div>
                    {/* <div className="needInput center">
                    <input
                      type="text"
                      value={editNeed[i].requirement_name}
                      name="tit"
                      disabled={edit}
                      onChange={(e) => {
                        handlerUpdateNeed(e.target.value, i, 'tit');
                      }}
                    />
                  </div> */}
                    <div className="needInput">
                      <textarea
                        name="dir"
                        rows="3"
                        value={editNeed[i].directions}
                        placeholder={v.directions}
                        disabled={edit}
                        onChange={(e) => {
                          handlerUpdateNeed(e.target.value, i, 'dir');
                        }}
                      ></textarea>
                    </div>
                  </div>
                );
              })}

              {/* 檔案上傳 */}
              <div className="file">
                {edit ? (
                  <div className="fileTit">附件上傳</div>
                ) : (
                  <div className="fileName">
                    <div>
                      <div className="fileTit">附件上傳 (檔案限制10MB)</div>
                      <div className="fileTit">
                        (可上傳副檔名
                        csv.txt.png.jpeg.jpg.pdf.xlsx.zip.word.ppt)
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
                      <MdOutlineAddBox size="20" onClick={addF} />
                    </div>
                  </div>
                )}

                {/* files */}
                {getFile.map((v, i) => {
                  return (
                    <div key={uuidv4()} className="two">
                      <label
                        className="addUploadContainer"
                        htmlFor={`file${i}`}
                      >
                        {/* 數字大於10 會因大小移位 */}
                        <span className={`items ${i < 9 ? 'ps-2' : ''}`}>
                          {i + 1}.
                        </span>

                        <div className="addUploadContain">
                          <div className="files">
                            {i <= v.id ? (
                              <>{fileUpdate ? v.file.name : v.name}</>
                            ) : (
                              <>
                                {v.file !== '' ? (
                                  v.file.name
                                ) : (
                                  <div className="addFile">
                                    <HiOutlineDocumentPlus className="addIcon" />
                                    <span>點擊新增檔案</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </label>

                      {edit ? (
                        ''
                      ) : (
                        <>
                          <input
                            className="input d-none"
                            type="file"
                            name="file"
                            id={`file${i}`}
                            accept=".csv,.txt,.png,.jpeg,.jpg,.pdf,.xlsx,.zip,.word,.ppt"
                            onChange={(e) => {
                              onFileUpload(e.target.files[0], i, 'file');
                              setFileUpdate(true);
                            }}
                          />
                          <IoMdCloseCircle
                            size="20"
                            className="cursor"
                            onClick={() => {
                              delCheck('確定要刪除此上傳檔案?', deleteFile, i);
                            }}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* 備註 */}
              {detailData.map((v, i) => {
                return (
                  <div key={i} className="textareaGap">
                    <div>備註(字數限制100)</div>

                    {edit ? (
                      <textarea
                        className="textarea"
                        maxLength="100"
                        value={v.remark}
                        disabled
                        defaultChecked={true}
                      ></textarea>
                    ) : (
                      <textarea
                        className="textarea"
                        maxLength="300"
                        value={v.remark}
                        onChange={(e) => {
                          handleChange((v.remark = e.target.value), 'remark');
                        }}
                      ></textarea>
                    )}
                  </div>
                );
              })}

              {/* 選擇狀態 */}
              {/* {WebPage === 2 &&
              HId !== '' &&
              (member.manage === 1 || member.handler === 1) &&
              needState !== 1 &&
              needState !== 2 &&
              needState !== 3 &&
              needState !== 6 &&
              needState !== 7 &&
              needState !== 8 &&
              needState !== 9 &&
              needState !== 10 &&
              needState !== 11 &&
              needState !== 12 &&
              needSumLen !== needLen ? (
                <div className="selectContain">
                  <div className="selContain">
                    <select
                      name="status"
                      value={postVal.status}
                      onChange={(e) => {
                        setSelectRemind(false);
                        handlePostVal(e);
                      }}
                    >
                      <option value="" selected>
                        ----請選擇處理狀態----
                      </option>
                      {selectData.map((v) => {
                        return (
                          <option value={v.name} key={uuidv4()}>
                            {v.name}
                          </option>
                        );
                      })}
                    </select>
                    {selectRemind ? (
                      <div className="selectRemind">*請選擇處理狀態</div>
                    ) : (
                      ''
                    )}
                  </div>

                  <button
                    className="confirmBtn"
                    onClick={() => {
                      if (postVal.status === '') {
                        setSelectRemind(true);
                        return;
                      }
                      setAddStateForm(true);
                    }}
                  >
                    確認
                  </button>
                </div>
              ) : (
                ''
              )} */}
            </div>

            {/* 取消申請 */}
            {/* <>
            {member.user === 1 &&
            needState !== 1 &&
            needState !== 2 &&
            needState !== 3 &&
            needState !== 8 &&
            needState !== 9 &&
            needState !== 10 &&
            needState !== 11 &&
            needState !== 12 &&
            WebPage === 1 ? (
              <div className="cancle">
                <button className="cancleBtn" onClick={handleUserCancle}>
                  取消申請
                </button>
              </div>
            ) : (
              ''
            )}
          </> */}

            {/* 完成 */}
            {/* {member.manage === 1 ? (
              member.handler === 1 &&
              HId === member.name &&
              member.manage === 1 &&
              needState !== 1 &&
              needState !== 2 &&
              needState !== 3 &&
              needState !== 4 &&
              needState !== 8 &&
              needState !== 9 &&
              needState !== 10 &&
              needState !== 11 &&
              needState !== 12 &&
              HId !== '' &&
              WebPage === 2 ? (
                needSumLen === needLen ? (
                  <div className="fBtn">
                    <button className="finishBtn" onClick={handleFinish}>
                      完成
                    </button>
                  </div>
                ) : (
                  ''
                )
              ) : (
                ''
              )
            ) : member.handler === 1 &&
              needState !== 1 &&
              needState !== 2 &&
              needState !== 3 &&
              needState !== 4 &&
              needState !== 8 &&
              needState !== 9 &&
              needState !== 10 &&
              needState !== 11 &&
              needState !== 12 &&
              HId !== '' &&
              WebPage === 2 ? (
              needSumLen === needLen ? (
                <div className="fBtn">
                  <button className="finishBtn" onClick={handleFinish}>
                    完成
                  </button>
                </div>
              ) : (
                ''
              )
            ) : (
              ''
            )} */}

            {/* 儲存 */}
            {member.user === 1 && needState === 1 ? (
              <div className="submitBtn">
                {edit ? (
                  <GenerallyBtn
                    style={{ background: '#2c75c8', color: 'white' }}
                    tit="修改"
                    handleFn1={setEdit}
                    fn1={false}
                  />
                ) : (
                  <GenerallyBtn
                    style={{ background: '#2c75c8', color: 'white' }}
                    tit="儲存"
                    handleFn1={storeCheck}
                    fn1="確認儲存表單?"
                    eNull="1"
                  />
                )}

                <GenerallyBtn
                  style={{ background: '#f2ac33', color: 'white' }}
                  tit="送出"
                  handleFn1={submitCheck}
                  fn1="確定要送出申請表?"
                  eNull="1"
                />

                <GenerallyBtn
                  style={{ background: '#ccc', color: 'white' }}
                  tit="刪除申請"
                  handleFn1={deleteCheck}
                  fn1="確認刪除申請表?"
                />
              </div>
            ) : (
              ''
            )}

            {/* 處理情況 */}
            <div className="dealWithBorder">
              <div id="dealWith" ref={scrollRef2} className="selData">
                案件處理情形
              </div>
              <ProcessingStatus
                needState={needState}
                needSumLen={needSumLen}
                needLen={needLen}
                selectData={selectData}
                postVal={postVal}
                setSelectRemind={setSelectRemind}
                handlePostVal={handlePostVal}
                selectRemind={selectRemind}
                setAddStateForm={setAddStateForm}
                handleStateChecked={handleStateChecked}
                selCheckData={selCheckData}
                handlepopulaceMsg={handlepopulaceMsg}
                selVal={selVal}
                setSelVal={setSelVal}
                nowSelState={nowSelState}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ApplicationForm;
