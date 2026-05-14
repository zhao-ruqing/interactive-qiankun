// 布局
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { isQiankunMicroFrontend } from "../utils/qiankun";
import BreadcrumbNav from "./components/Breadcrumb";
import Header from "./components/Header";
import Sider from "./components/Sider";

const AdminLayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
  overflow: hidden;
  box-sizing: border-box;
`;

const LayoutBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 0;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f0f2f5;
  min-height: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: 0;
`;

const ContentHeader = styled.div`
  margin-bottom: 12px;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 20px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;

    &:hover {
      background: #b3b3b3;
    }
  }
`;

const AdminLayout = () => {
  const isQiankun = isQiankunMicroFrontend();

  return (
    <AdminLayoutWrapper>
      <Sider />
      <LayoutBody>
        <MainContent>
          {!isQiankun && <Header />}
          <ContentWrapper>
            <ContentHeader>
              <BreadcrumbNav />
            </ContentHeader>
            <Content>
              <Outlet />
            </Content>
          </ContentWrapper>
        </MainContent>
      </LayoutBody>
    </AdminLayoutWrapper>
  );
};
export default AdminLayout;
