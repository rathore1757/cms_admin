import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const WeightGroup = ({
  open,
  setOpen,
  WeightGroupInfo,
  setUpdatedState,
  updatedState,
}) => {
  console.log(WeightGroupInfo, "WeightGroupInfo");
  const [name, setName] = useState(WeightGroupInfo?.value);
  const [status, setStatus] = useState(WeightGroupInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    let data = {
      mainTitle: "weight_group",
      value: name,
      status: status,
      id: WeightGroupInfo?.id,
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
        toast.success("Weight Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Weight Group</Modal.Title>
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
          Edit Weight Group
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default WeightGroup;
