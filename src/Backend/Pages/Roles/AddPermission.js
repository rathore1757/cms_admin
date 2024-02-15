import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import { AddPermissionSchema } from "../../../common/Schemas/AddPermissionSchema";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PermissionForm from "./PermissionForm";
import styled from "styled-components";
import RoleForm from "./RoleForm";
import EditPermissionPopup from "./EditPermissionPopup";
// Create a styled component
const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const CategorySingle = styled.div`
  margin-bottom: 50px;
`;

const StyledButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;

const AddPermission = () => {
  const [permissionData, setPermissionData] = useState([]);
  const [updatedState, setUpdatedState] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [itemToUpdate, setItemToUpdate] = useState({});
  const [permissionInfo, setPermissionInfo] = useState("");
  // const [status, setStatus] = useState("active");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false); //for role creation
  const [roleData, setRoleData] = useState([]); //for role array
  const [editRoleObj, setEditRoleObj] = useState({}); //for role edit

  const fetchData = async () => {
    axios
      .get(
        `${environmentVariables?.apiUrl}api/admin/permission/get_permission_data`,
        {
          withCredentials: true,
        }
      )
      .then((sol) => {
        setPermissionData(sol?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchRoleData = async () => {
    axios
      .get(`${environmentVariables?.apiUrl}api/admin/role/get_all`, {
        withCredentials: true,
      })
      .then((sol) => {
        setRoleData(sol?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  useEffect(() => {
    fetchData();
    fetchRoleData();
    if (showRoleUpdateModal == false) {
      setEditRoleObj({});
    }
  }, [updatedState, showRoleUpdateModal]);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    let url = `api/admin/permission/destroy_by_id?id=${itemToDelete?.id}`;
    if (itemToDelete && itemToDelete?.permissionData) {
      url = `api/admin/role/destroy?id=${itemToDelete?.id}`;
    }
    axios
      .delete(`${environmentVariables?.apiUrl}${url}`, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(`"${itemToDelete?.name}" Deleted Successfully`);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      })
      .finally(() => {
        setShowConfirmation(false);
      });
  };

  const handleSaveRole = () => {
    setShowRoleUpdateModal(true);
  };

  const handleRoleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };
  const handleStatusChangeForRole = (status, id) => {
    let obj = {
      status: status == "active" ? "inactive" : "active",
      id: id,
    };
    axios
      .put(`${environmentVariables?.apiUrl}api/admin/role/update_status`, obj, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response?.data, "REerer");
        toast.success(response?.data?.message);
        fetchRoleData();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  console.log(permissionData, "permissionData");
  return (
    <>
      <CategorySingle>
        <Heading>Permission</Heading>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <PermissionForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          </div>
          {permissionData?.map((item, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={index}
              >
                <div
                  style={{
                    margin: "10px",
                    backgroundColor: "lightgray",
                    padding: "10px",
                  }}
                >
                  {item?.name}
                </div>

                <div>
                  <Button
                    onClick={() => {
                      setShowUpdateModal(true);
                      setItemToUpdate(item);
                      setPermissionInfo(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(item)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>
      </CategorySingle>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{itemToDelete?.name}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmDelete()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ///////////////////////////// */}

      <CategorySingle>
        <Heading>Role</Heading>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <StyledButton
              onClick={(e) => {
                handleSaveRole();
              }}
            >
              Add New Role
            </StyledButton>
          </div>
        </div>
      </CategorySingle>

      <Modal
        show={showRoleUpdateModal}
        onHide={() => setShowRoleUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editRoleObj?.id ? "Edit" : "Add"} Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoleForm
            setShowRoleUpdateModal={setShowRoleUpdateModal}
            editRoleObj={editRoleObj}
          />
        </Modal.Body>
      </Modal>
      <ToastContainer />
      <CategorySingle>
        {roleData?.map((item, index) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              key={index}
            >
              <div
                style={{
                  margin: "10px",
                  backgroundColor: "lightgray",
                  padding: "10px",
                }}
              >
                {item?.name}
              </div>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Enable/Disable Button"
                checked={item?.status == "active" ? true : false}
                onChange={() =>
                  handleStatusChangeForRole(item?.status, item?.id)
                }
              />

              {item &&
                item?.permissionData &&
                item?.permissionData?.map?.((el, indx) => {
                  return (
                    <div
                      style={{
                        margin: "5px",
                        backgroundColor: "lightgreen",
                        padding: "3px",
                      }}
                      key={indx}
                    >
                      {el?.name}
                    </div>
                  );
                })}

              <div>
                <Button
                  onClick={() => {
                    setShowRoleUpdateModal(true);
                    setEditRoleObj(item);
                    // setShowUpdateModal(true);
                    // setItemToUpdate(item);
                    // setName(item?.name);
                    // setStatus(item?.status);
                  }}
                >
                  Edit
                </Button>
                <Button onClick={() => handleRoleDelete(item)}>Delete</Button>
              </div>
            </div>
          );
        })}
      </CategorySingle>
      {showUpdateModal && (
        <EditPermissionPopup
          open={showUpdateModal}
          setOpen={setShowUpdateModal}
          permissionInfo={permissionInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        />
      )}
    </>
  );
};

export default AddPermission;
