import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const SizePopup = ({
  open,
  setOpen,
  sizeInfo,
  setUpdatedState,
  updatedState,
}) => {
  console.log(sizeInfo, "sizeInfo");
  const [name, setName] = useState(sizeInfo?.value);
  const [status, setStatus] = useState(sizeInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    console.log(name, status);

    let data = {
      mainTitle: "size",
      value: name,
      status: status,
      id: sizeInfo?.id,
    };

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
        toast.success("Size Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });

    // const formdata = new FormData();
    // formdata.append("value", name);
    // formdata.append("status", status);
    // formdata.append("id", sizeInfo?.id);
    // let config = {
    //   method: "post",
    //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
    //   withCredentials: true,
    //   data: formdata,
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     toast.success("Size Updated Successfully");
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
        <Modal.Title>Edit Size</Modal.Title>
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
          Edit Size
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SizePopup;
