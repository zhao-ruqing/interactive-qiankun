import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMenuRoutes, routes } from "../../router/routes";

const SiderWrapper = styled.aside`
  width: 240px;
  height: 100%;
  background: linear-gradient(180deg, #001529 0%, #002140 100%);
  overflow-y: auto;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const LogoArea = styled.div`
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const LogoIcon = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff 0%, #b3d8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 12px 0;
  flex: 1;
`;

const MenuItem = styled.li<{ $active: boolean }>`
  position: relative;
  margin: 2px 12px;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  background-color: ${(props) =>
    props.$active ? "rgba(24, 144, 255, 0.15)" : "transparent"};
  color: ${(props) =>
    props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.65)"};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${(props) => (props.$active ? "20px" : "0")};
    background: #1890ff;
    border-radius: 0 3px 3px 0;
    transition: height 0.25s ease;
  }

  &:hover {
    color: #ffffff;
    background-color: ${(props) =>
      props.$active ? "rgba(24, 144, 255, 0.2)" : "rgba(255, 255, 255, 0.08)"};
  }
`;

const SiderFooter = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
`;

const Sider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRoutes = getMenuRoutes(routes);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <SiderWrapper>
      <LogoArea>
        <LogoIcon>⚙</LogoIcon>
        <LogoText>AI Admin</LogoText>
      </LogoArea>
      <MenuList>
        {menuRoutes.map((route) => (
          <MenuItem
            key={route.path}
            $active={location.pathname === route.path}
            onClick={() => handleMenuClick(route.path)}
          >
            {route.name}
          </MenuItem>
        ))}
      </MenuList>
      <SiderFooter>React AI v1.0</SiderFooter>
    </SiderWrapper>
  );
};

export default Sider;
