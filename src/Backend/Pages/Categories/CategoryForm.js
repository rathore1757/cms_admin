import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { AddCategorySchema } from "../../../common/Schemas/AddCategorySchema";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Create a styled component
const CategoryInput = styled.input`
  padding: 12px 15px;
  width: 300px;
  font-size: 15px;
  border-radius: 5px;
  border: 1px solid #00000026;
  margin-right: 20px;
  margin-bottom: 20px;
`;


const CategoryAddFormMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CategoryAddForm = styled.div`
width: 100%;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #00000026;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TopInputs = styled.div`
  display: flex;
`;

const AddCategoryButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;



const CategoryForm = ({ updatedState, setUpdatedState }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);
  const options = [
    { label: "Men", value: 1 },
    { label: "Women", value: 2 },
    { label: "Kids", value: 3 },
  ];

  const initialValues = {
    categoryValue: "",
    genderInCategory: [],
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddCategorySchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        // console.log(
        //   selectedImage,
        //   values?.categoryValue,
        //   values?.isButtonDisabled,
        //   values?.genderInCategory
        // );
        const formdata = new FormData();
        formdata.append("image", selectedImage);
        formdata.append("title", values?.categoryValue);
        formdata.append("value", values?.categoryValue);
        formdata.append("slug", values?.categoryValue);
        formdata.append(
          "status",
          values?.isButtonDisabled ? "active" : "inactive"
        );
        for (let i = 0; i < values?.genderInCategory.length; i++) {
          formdata.append(`gender_arr[${i}]`, values?.genderInCategory[i]);
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
            fileInputRef.current.value = null;
            toast.success("Category Added Successfully");
            setUpdatedState(!updatedState);
            resetForm({});
            formik.setFieldValue("genderInCategory", []);
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
      } else {
        setSelectedImageError(true);
      }
    },
  });
  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");

    // setGenderInCategory(selectedValues);
    formik.setFieldValue("genderInCategory", selectedValues);
  };
  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
    setSelectedImageError(false);
  };
  const { values, errors, handleSubmit } = formik;
  return (
    <CategoryAddFormMain>
    <CategoryAddForm>
    <div className="flex">
      <TopInputs>
        <Form.Group controlId="formBasicEmail">
          <CategoryInput
            type="text"
            placeholder="Enter Category Name"
            className="logform-input"
            name="categoryValue"
            value={values.categoryValue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.categoryValue && formik.errors.categoryValue ? (
            <div style={{ color: "red" }}>{formik.errors.categoryValue}</div>
          ) : null}
        </Form.Group>
        
        <MultiSelect
          className="multi-select"
          onChange={handleOnchangeGender}
          placeholder="Select Sub-Categories"
          options={options}
          value={values.genderInCategory}
          style={{ width: "500px", marginRight:"20px" }}
        />
        {formik.touched.genderInCategory && formik.errors.genderInCategory ? (
          <div style={{ color: "red" }}>{formik.errors.genderInCategory}</div>
        ) : null}
      </TopInputs>
      <Form.Group controlId="formBasicImage">
        <Form.Label>Choose Image : </Form.Label>
        <input
          type="file"
          accept="image/*"
          name="selectedImage"
          onChange={handleChangeImage}
          // value={formik.values.selectedImage}
          ref={fileInputRef}
        />
        {selectedImageError ? (
          <div style={{ color: "red" }}>Image is required</div>
        ) : null}
      </Form.Group>
    </div>

      <Form.Check
        type="switch"
        id="custom-switch"
        label="Enable/Disable Button"
        checked={values.isButtonDisabled}
        onChange={() =>
          formik.setValues({
            ...formik.values,
            isButtonDisabled: !formik.values.isButtonDisabled,
          })
        }
      />
      </CategoryAddForm>
      <AddCategoryButton onClick={() => handleSubmit()}>
        Add Category
      </AddCategoryButton>
    </CategoryAddFormMain>
  );
};

export default CategoryForm;
