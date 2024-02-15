import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styled from "styled-components";

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
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`;
const Description = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const UIFrameData = () => {
  const [uiFrameData, setUiFrameData] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uiFrameFilteredData, setUiFrameFilteredData] = useState({});
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = () => {
    let data = {
      heading: heading,
      description: description,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/add_ui_frame_config`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getUIFrameData();
        handleClose();
        toast.success("Values updated");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };
  const handleEditFrameConfig = (val) => {
    setHeading(val?.heading);
    setDescription(val?.description);
    handleShow();
  };
  const getUIFrameData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/get_ui_frame_config`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setUiFrameData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUIFrameData();
  }, []);
  return (
    <div>
      {uiFrameData &&
        uiFrameData.map((val) => (
          <div className="mt-4">
            <Heading>{val?.heading}</Heading>
            <Description>{val?.description}</Description>
            <EditButton onClick={() => handleEditFrameConfig(val)}>
              Edit
            </EditButton>
          </div>
        ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit UI Frame Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                value={heading}
                type="text"
                placeholder=""
                autoFocus
                disabled
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UIFrameData;
