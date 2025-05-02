import { Route, Routes } from 'react-router-dom';
import { HomePage } from './views/home/HomePage';
import { Error404 } from './views/error/Error404';
import { FinishSign } from './views/sign/FinishSign';
import { Layout } from './layout/Layout';
import { RegisterLayout } from './layout/RegisterLayout';
import { Login } from './views/login/Login';
import { Register } from './views/register/Register';
import { Forget } from './views/forget/Forget';
import { Sign } from './views/sign';
import { ConfigProvider } from 'antd';

function App() {
  const [count, setCount] = useState(0);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgMask: 'rgba(206, 229, 228, 0.4)',
          boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.08)',
        },
        components: {
          Modal: {},
        },
      }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />}></Route>
          <Route path="/sign" element={<Sign />}></Route>
        </Route>
        <Route
          path="/login"
          element={
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          }></Route>
        <Route
          path="/register"
          element={
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          }></Route>
        <Route
          path="/forget"
          element={
            <RegisterLayout>
              <Forget />
            </RegisterLayout>
          }></Route>
        <Route path="*" element={<Error404 />}></Route>
        <Route
          path="/file-error"
          element={
            <Error404
              title="您的檔案無法上傳"
              description="請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF。"
            />
          }></Route>
        <Route path="/finish-file" element={<FinishSign />}></Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
