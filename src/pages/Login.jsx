import React from "react";
import { Button, Form, Input, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import axiosApiInstance from "../services/axios";
import { API_URL } from "../constants/constants";
import Loading from "../components/Loading";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const serverRes = await axiosApiInstance.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${res.user.accessToken}`,
        },
      });
      if (serverRes.data.isAdmin === true) {
        localStorage.setItem("auth", res.user.accessToken);
        messageApi.success("Login Success");
        window.location.reload();
        setLoading(false);
      } else {
        setLoading(false);
        messageApi.error("Unable to login");
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
      messageApi.error(error.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    messageApi.error("Unable to login");
  };

  return (
    <>
      <Loading show={loading} />
      <div
        style={{
          width: "450px",
          padding: "20px 30px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #e8e8e8",
          borderRadius: "5px",
        }}
      >
        {contextHolder}
        <h1
          style={{
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Login to Scribemedica
        </h1>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "24px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default Login;
