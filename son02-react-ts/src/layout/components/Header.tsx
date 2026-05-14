import { useUserStore } from "@/stores";
import { UserOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  height: 56px;
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
`;

const UserAvatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #ffffff;
  font-size: 14px;
`;

const Header = () => {
  const userStore = useUserStore();
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}").state;
  const navigate = useNavigate();

  const handleLogout = () => {
    userStore.reset();
    navigate("/login");
    message.success("退出登录成功！");
  };

  const username = userInfo.userInfo.username || "用户";
  const avatarChar = username.charAt(0).toUpperCase();

  return (
    <HeaderWrapper>
      <UserInfoWrapper>
        <UserInfo>
          <UserAvatar>{avatarChar}</UserAvatar>
          {username}
        </UserInfo>
        <Button danger size="small" onClick={handleLogout}>
          退出登录
        </Button>
      </UserInfoWrapper>
    </HeaderWrapper>
  );
};
export default Header;
