import React from "react";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, theme, Button } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
const { Header, Content, Sider } = Layout;

const MyLayout = (props) => {
  const navigate = useNavigate();
  const { currentNav, children } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items2 = [
    { icon: LaptopOutlined, label: "Notes", link: "/note-list" },
    { icon: UserOutlined, label: "Users", link: "/user-list" },
  ].map((full, index) => {
    const key = String(index + 1);
    return {
      key: key,
      icon: React.createElement(full.icon),
      label: full.label,
      link: full.link,
    };
  });

  const getLinkFromKey = (key) => {
    const item = items2.find((item) => item.key === key);
    return item ? item.link : "";
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            color: "white",
          }}
        >
          Scribemedica Admin Panel
        </h3>
        <Button type="primary" onClick={logoutUser}>
          Log out
        </Button>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={currentNav}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            onClick={(e) => {
              const link = getLinkFromKey(e.key);
              if (link) {
                navigate(link, { replace: true });
              }
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MyLayout;
