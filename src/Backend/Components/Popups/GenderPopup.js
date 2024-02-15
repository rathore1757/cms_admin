import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const GenderPopup = ({
  open,
  setOpen,
  genderInfo,
  setUpdatedState,
  updatedState,
}) => {
  console.log(genderInfo, "genderInfo");
  const [name, setName] = useState(genderInfo?.value);
  const [selectedImage, setSelectedImage] = useState(genderInfo?.image);
  const [status, setStatus] = useState(genderInfo?.status);
  const fileInputRef = useRef(null);

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    console.log(name, selectedImage, status);

    const formdata = new FormData();
    formdata.append("image", selectedImage);
    formdata.append("value", name);
    formdata.append("status", status);
    formdata.append("id", genderInfo?.id);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Gender Updated Successfully");
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
        <Modal.Title>Edit Gender</Modal.Title>
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

          <Form.Group controlId="formBasicImage">
            <Image
              src={`${environmentVariables?.apiUrl}uploads/filterProduct/gender/${selectedImage}`}
            />
            <Form.Label>Choose Image</Form.Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
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
          Edit Gender
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default GenderPopup;
