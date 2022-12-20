// import React, { useState } from 'react';

// function Test(props) {
//亂數
// function random_No(j) {
//     var random_no = '';

//     random_no = new Date().getTime();

//     return random_no;
// }

// //多檔案上傳
// const { fileType, handleFile } = props;
// const [fileList, setFileList] = useState([]);

// const handleClose = (item) => {
//     const leftFiles = Array.prototype.filter.call(fileList, (i) => {
//         return i.name !== item.name;
//     });
//     setFileList(leftFiles);
//     handleFile(leftFiles);
// };
// const uploadFile = (e) => {
//     setFileList(e.target.files);
//     handleFile && handleFile(e.target.files);
// };

// return (
//     <div className="multiple_file_box">
//         <div className="mulfile_upload_container">
//             <label id="multifile_upload_button" htmlFor={`multifile_uploads`}>
//                 <span>选择文件</span>
//                 <input
//                     id={`multifile_uploads`}
//                     multiple
//                     onChange={uploadFile}
//                     accept={fileType || '*'}
//                     type="file"
//                 />
//             </label>
//             <div className="multifile_preview">
//                 {Array.from(fileList).map((item) => {
//                     return (
//                         <div className="multifile_item" key={item.lastModified}>
//                             <span>{item.name}</span>
//                             <span className="file_close" onClick={() => handleClose(item)}></span>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     </div>
// );
// }

// export default Test;
