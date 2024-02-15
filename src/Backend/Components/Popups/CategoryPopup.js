import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { environmentVariables } from "../../../config/env.config";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { toast } from "react-toastify";
import axios from "axios";

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const CategoryPopup = ({
  open,
  setOpen,
  categoryInfo,
  setUpdatedState,
  updatedState,
}) => {
  // console.log("categoryInfo", categoryInfo);
  const [selectedImage, setSelectedImage] = useState(categoryInfo?.image);
  const [category, setCategory] = useState(categoryInfo?.value);
  // const [image, setImage] = useState(categoryInfo?.image);
  const [status, setStatus] = useState(categoryInfo?.status);
  const [genderInCategory, setGenderInCategory] = useState(
    categoryInfo?.gender_arr
  );
  const fileInputRef = useRef(null);

  console.log("genderInCategory", genderInCategory);
  const options = [
    { label: "Men", value: "1" },
    { label: "Women", value: "2" },
    { label: "Kids", value: "3" },
  ];

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const handleOnchangeTheme = (val) => {
    const selectedValues = val.split(",");
    setGenderInCategory(selectedValues);
  };
  const EditButtonClicked = () => {
    console.log(category, selectedImage, status, genderInCategory);

    const formdata = new FormData();
    formdata.append("image", selectedImage);
    formdata.append("title", category);
    formdata.append("value", category);
    formdata.append("slug", category);
    formdata.append("status", status);
    formdata.append("id", categoryInfo?.id);
    for (let i = 0; i < genderInCategory.length; i++) {
      formdata.append(`gender_arr[${i}]`, genderInCategory[i]);
    }
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_category`,
      withCredentials: true,
      data: formdata,
    };
    axios
      .request(config)
      .then((response) => {
        toast.success("Category Added Successfully");
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
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="category"
              className="logform-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicImage">
            <Image
              src={`${environmentVariables?.apiUrl}uploads/filterProduct/category/${selectedImage}`}
            />
            <Form.Label>Choose Image</Form.Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
            />
          </Form.Group>
          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeTheme}
            options={options}
            defaultValue={genderInCategory}
          />
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
          Edit Category
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryPopup;
