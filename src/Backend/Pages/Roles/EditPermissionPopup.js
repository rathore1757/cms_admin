import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";

const EditPermissionPopup = ({
  open,
  setOpen,
  permissionInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [name, setName] = useState(permissionInfo?.name);
  const [status, setStatus] = useState(permissionInfo?.status);
  const [frontendRoutes, setFrontendRoutes] = useState(
    permissionInfo?.frontend_routes?.map((item) => item.id.toString())
  );
  //   data.map((item) => item.id.toString());
  const [backendRoutes, setBackendRoutes] = useState(
    permissionInfo?.backend_routes?.map((item) => item.id.toString())
  );

  const handleChangeStatus = () => {
    if (status == "active") {
      setStatus("inactive");
    } else {
      setStatus("active");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (name == "") {
      setError("Name is mandatory");
      return;
    } else if (name?.trim()?.length < 3) {
      setError("Name should be atleast 3 character");
      return;
    }
    let obj = {
      id: permissionInfo?.id,
      name: name,
      status: status,
      backend_routes: backendRoutes?.map((id) => parseInt(id)),
      frontend_routes: frontendRoutes.map((id) => parseInt(id)),
    };
    console.log(obj, "object", backendRoutes);
    await axios
      .put(`${environmentVariables?.apiUrl}api/admin/permission/edit`, obj, {
        withCredentials: true,
      })
      .then((sol) => {
        toast.success("Permission Update Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const options = permissionInfo?.backend_routes?.map((routes) => ({
    label: routes.name,
    value: routes?.id?.toString(),
  }));
  const optionsforFrontend = permissionInfo?.frontend_routes?.map((routes) => ({
    label: routes.name,
    value: routes?.id?.toString(),
  }));
  const handleOnchangeBackendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    console.log(selectedValues);
    setBackendRoutes(selectedValues);
    // formik.setFieldValue("backendRoute", selectedValues);
  };
  const handleOnchangeFrontendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    setFrontendRoutes(selectedValues);
    // formik.setFieldValue("frontendRoute", selectedValues);
  };
  console.log("permissionInfo", permissionInfo, optionsforFrontend);
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Permission</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Name"
              className="logform-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeBackendRoutes}
            options={options}
            defaultValue={backendRoutes}
            style={{ width: "400px" }}
          />
          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeFrontendRoutes}
            options={optionsforFrontend}
            defaultValue={frontendRoutes}
            style={{ width: "400px" }}
          />

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable Button"
            checked={status == "active"}
            onChange={(e) => handleChangeStatus(e)}
          />
        </Form>
        <Button
          onClick={(e) => handleUpdateSubmit(e)}
          style={{ width: "200px", alignSelf: "end" }}
        >
          Edit Permission
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default EditPermissionPopup;
