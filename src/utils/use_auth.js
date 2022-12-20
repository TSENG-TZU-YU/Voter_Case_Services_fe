import React, { useState, useContext, createContext } from 'react';

// 建立新的認証用的context
const AuthContext = createContext();

// 建立一個新的Provider元件，內容是提供auth狀態
export const AuthProvider = ({ children }) => {
  //是否登入
  const [isLogin, setIsLogin] = useState(false);
  //會員資料
  const [member, setMember] = useState({
    id: '',
    name: '',
    applicant_unit: '',
    staff_code: '',
    job: '',
  });

  return (
    <AuthContext.Provider
      value={{
        member,
        setMember,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 建立一個勾子協助使用context
export const useAuth = () => useContext(AuthContext);
