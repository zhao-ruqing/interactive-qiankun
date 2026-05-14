import { getUserInfoAPI, loginAPI, registerAPI } from "@/api/user";
import { useUserStore } from "@/stores";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(64, 158, 255, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(64, 158, 255, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(100, 120, 255, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #f0f2f5 0%, #e8ecf1 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 44px 36px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin: 0 0 36px;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 1px;

  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #409eff, #66b1ff);
    margin: 12px auto 0;
    border-radius: 3px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const StyledForm = styled(Form)`
  .ant-input-affix-wrapper {
    padding: 10px 12px;
    border-radius: 10px;
    background: #f8f9fb;
    border: 1px solid #ebeef5;
    transition: all 0.25s ease;

    &:hover {
      border-color: #c0c4cc;
      background: #f5f6f9;
    }
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: #409eff;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.08);
  }

  .ant-input {
    font-size: 15px;
    color: #303133;
    background: transparent;
  }

  .ant-form-item {
    margin-bottom: 20px;
  }
`;

const LoginButton = styled(Button)`
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #409eff 0%, #2b7de1 100%);
  border: none;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RegisterButton = styled(Button)`
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  border: 1.5px solid #d9ecff;
  color: #409eff;
  transition: all 0.25s ease;

  &:hover {
    border-color: #409eff !important;
    background: rgba(64, 158, 255, 0.04) !important;
    color: #409eff !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Login = () => {
  const userStore = useUserStore();
  type LoginProps = {
    username: string;
    password: string;
  };
  const [username, setUsername] = useState<LoginProps["username"]>("");
  const [password, setPassword] = useState<LoginProps["password"]>("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      message.warning("请输入用户名和密码");
      return;
    }
    const res = await loginAPI({ username, password });

    userStore.setToken(res.token);
    if (res.status === 0) {
      const userInfo = await getUserInfoAPI();
      if (userInfo.status === 0) {
        userStore.setUserInfo(userInfo.data);
        message.success("Login successful!");
        navigate("/home");
      } else {
        message.error(userInfo.message || "Login failed!");
      }
    } else {
      message.error(res.message || "Login failed!");
    }
  };

  const register = async () => {
    if (!username || !password) {
      message.warning("请输入用户名和密码");
      return;
    }
    await registerAPI({ username, password });
    message.success("Register successful!");
    navigate("/home");
  };
  return (
    <LoginWrapper>
      <LoginCard>
        <LoginTitle>React AI Admin</LoginTitle>
        <StyledForm>
          <Form.Item>
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: "#909399" }} />}
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#909399" }} />}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </StyledForm>
        <ButtonGroup>
          <LoginButton type="primary" block onClick={handleLogin}>
            登录
          </LoginButton>
          <RegisterButton block onClick={register}>
            注册
          </RegisterButton>
        </ButtonGroup>
      </LoginCard>
    </LoginWrapper>
  );
};
export default Login;
