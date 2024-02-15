import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const ShapePopup = ({
  open,
  setOpen,
  shapeInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [name, setName] = useState(shapeInfo?.value);
  const [status, setStatus] = useState(shapeInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    console.log(name, status);

    let data = {
      mainTitle: "shape",
      value: name,
      status: status,
      id: shapeInfo?.id,
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
        toast.success("Shape Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });

    // const formdata = new FormData();
    // formdata.append("image", selectedImage);
    // formdata.append("value", name);
    // formdata.append("status", status);
    // formdata.append("id", shapeInfo?.id);
    // let config = {
    //   method: "post",
    //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
    //   withCredentials: true,
    //   data: formdata,
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //     toast.success("Gender Updated Successfully");
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
        <Modal.Title>Edit Shape</Modal.Title>
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
          Edit Shape
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ShapePopup;
