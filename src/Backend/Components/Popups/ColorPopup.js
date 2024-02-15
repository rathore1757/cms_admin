import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const ColorPopup = ({
  open,
  setOpen,
  colorInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [name, setName] = useState(colorInfo?.value);
  const [status, setStatus] = useState(colorInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    let data = {
      mainTitle: "color",
      value: name,
      status: status,
      id: colorInfo?.id,
    };
    console.log("data", data);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Color Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });

    // for (let i = 0; i < genderInCategory.length; i++) {
    //   formdata.append(`gender_arr[${i}]`, genderInCategory[i]);
    // }
    // let config = {
    //   method: "post",
    //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_category`,
    //   withCredentials: true,
    //   data: formdata,
    // };
    // axios
    //   .request(config)
    //   .then((response) => {
    //     toast.success("Category Added Successfully");
    //     setUpdatedState(!updatedState);
    //     setOpen(false);
    //   })
    //   .catch((error) => {
    //     toast.error(error?.response?.data?.message || error?.message, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   });
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="color"
              className="logform-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable Button"
            checked={status === "active"}
            onChange={handleSwitchChange}
          />
        </Form>
        <Button
          onClick={() => EditButtonClicked()}
          style={{ width: "200px", alignSelf: "end" }}
        >
          Edit Color
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ColorPopup;
