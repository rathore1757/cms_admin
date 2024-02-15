import React, { useEffect, useState } from "react";
import AddSubAdminPopup from "../../Components/Popups/AddSubAdminPopup";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
const SubAdmins = () => {
  const [showPopupForAddSubAdmin, setShowPopupForAddSubAdmin] = useState(false);
  const [updatedState, setUpdatedState] = useState(false);
  const [resData, setResData] = useState([]);
  const [adminData, setAdminData] = useState();

  const getAllAdmins = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/get_all_admin`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setResData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        setResData([]);
      });
  };

  const handleStatusChangeForRole = (e, id) => {
    console.log(e.target.checked ? "active" : "inactive", id, e.target.checked);
    // let obj = {
    //   status: status == "active" ? "inactive" : "active",
    //   id: id,
    // };
    // axios
    //   .put(`${environmentVariables?.apiUrl}api/admin/role/update_status`, obj, {
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     console.log(response?.data, "REerer");
    //     toast.success(response?.data?.message);
    //     fetchRoleData();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(error?.response?.data?.message || error?.message);
    //   });
    let data = {
      id: id,
      status: e.target.checked ? "active" : "inactive",
    };
    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/admin_status_change_data`,
      withCredentials: true,
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        toast.success(response?.data?.message);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  useEffect(() => {
    getAllAdmins();
  }, [updatedState]);

  const handleClickEdit = (item) => {
    setShowPopupForAddSubAdmin(true);
    setAdminData(item);
  };

  const handleRoleDelete = (item) => {
    let config = {
      method: "delete",
      url: `${environmentVariables?.apiUrl}api/admin/delete_admin?id=${item?.id}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success(response?.data?.message);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  return (
    <div>
      <div>
        <button
          onClick={() => {
            setAdminData();
            setShowPopupForAddSubAdmin(true);
          }}
        >
          Add New SubAdmin
        </button>
        <div>
          <div>
            <h2>Admin list</h2>
          </div>
          {resData?.map((item, index) => {
            return (
              <div key={index} style={{ display: "flex" }}>
                <div>Admin Name: {item?.name}</div>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={item?.status == "active"}
                  onChange={(e) => handleStatusChangeForRole(e, item?.id)}
                />
                <div>
                  <Button
                    onClick={() => {
                      handleClickEdit(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleRoleDelete(item)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>

        {showPopupForAddSubAdmin && (
          <AddSubAdminPopup
            open={showPopupForAddSubAdmin}
            setOpen={setShowPopupForAddSubAdmin}
            updatedState={updatedState}
            setUpdatedState={setUpdatedState}
            adminData={adminData}
          />
        )}
        {/* {showPopupForAddSubAdmin && (
          <AddSubAdminPopup
            open={showPopupForAddSubAdmin}
            setOpen={setShowPopupForAddSubAdmin}
            updatedState={updatedState}
            setUpdatedState={setUpdatedState}
          />
        )} */}
      </div>
    </div>
  );
};

export default SubAdmins;
