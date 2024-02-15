import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import axios from "axios";
import { environmentVariables } from "../config/env.config";
import ButtonLoader from "../Backend/Components/ButtonLoader/ButtonLoader.js";
import "./LoginStyle.css";
import Mainlogo from "../Images/logo.webp";
import { useFormik } from "formik";
import * as yup from "yup";
import CircularLoader from "../Backend/Components/CircularLoader/CircularLoader.js";
import { userContext } from "../context/userContext.js";

function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required().email("please enter valid email"),
      password: yup.string().required().min(8),
    }),

    onSubmit: async () => {
      setIsSubmit(true);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/login`,
        data: formik.values,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success("Login successfully");
          setIsSubmit(false);
          setIsUserLogin(true);
          navigate("/dashboard");
        })
        .catch((error) => {
          setIsSubmit(false);
          toast.error(error?.response?.data?.message || error?.message);
        });
    },
  });
  const baseUrl = environmentVariables?.apiUrl;
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isUserLogin,setIsUserLogin } = useContext(userContext);

  useEffect(() => {
    if (isUserLogin) {
      navigate("/dashboard");
    }
  }, [isUserLogin]);
  return (
    <>
      <div className="login-23">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12 bg-color-23">
              <div className="form-section">
                <div className="logo"></div>
                <h3>
                  <Link to="/">
                    <img src={Mainlogo} />
                  </Link>
                </h3>
                <div className="login-inner-form">
                  <form>
                    <div className="form-group clearfix">
                      <div className="form-box">
                        <input
                          type="text"
                          className="form-control clear_string login_inputfield"
                          placeholder="Enter Your Email*"
                          name="email"
                          value={formik.values.email}
                          required=""
                          key="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <i
                          className="fa fa-envelope input_icons"
                          aria-hidden="true"
                        ></i>
                      </div>
                      {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.email}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="form-group clearfix">
                      <div className="form-box">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control clear_string login_inputfield"
                          placeholder="Enter Your Password*"
                          name="password"
                          key="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? (
                            <i className="fas fa-eye Eeye"></i>
                          ) : (
                            <i className="fas fa-eye-slash Eeye"></i>
                          )}
                        </span>
                        <i
                          className="fa fa-key input_icons"
                          aria-hidden="true"
                        ></i>
                      </div>
                      {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.password}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="checkbox form-group clearfix mt-3">
                      <Link
                        to="/forgot-password"
                        className="link-light float-end forgot-password"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="form-group clearfix mb-0">
                      <button
                        onClick={formik.handleSubmit}
                        type="button"
                        className="btn-theme login_button"
                        disabled={isSubmit}
                      >
                        {isSubmit ? <CircularLoader size={30} /> : "Login"}
                      </button>
                    </div>

                    <ToastContainer />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
//1112
