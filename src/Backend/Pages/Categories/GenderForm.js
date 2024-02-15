import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { AddGenderSchema } from "../../../common/Schemas/AddGenderSchema";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";

const GenderForm = ({ updatedState, setUpdatedState }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);

  const initialValues = {
    genderValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddGenderSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        console.log(
          selectedImage,
          values?.genderValue,
          values?.isButtonDisabled
        );
        const formdata = new FormData();
        formdata.append("image", selectedImage);
        formdata.append("value", values?.genderValue);
        formdata.append(
          "status",
          values?.isButtonDisabled ? "active" : "inactive"
        );
        let config = {
          method: "post",
          url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
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
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Gender"
          className="logform-input"
          name="genderValue"
          value={values.genderValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.genderValue && formik.errors.genderValue ? (
          <div style={{ color: "red" }}>{formik.errors.genderValue}</div>
        ) : null}
      </Form.Group>
      <Form.Group controlId="formBasicImage">
        <Form.Label>Choose Image</Form.Label>
        <input
          type="file"
          accept="image/*"
          name="selectedImage"
          onChange={handleChangeImage}
          ref={fileInputRef}
        />
        {selectedImageError ? (
          <div style={{ color: "red" }}>Image is required</div>
        ) : null}
      </Form.Group>

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
      <Button
        onClick={() => handleSubmit()}
        style={{ width: "200px", alignSelf: "end" }}
      >
        Add Gender
      </Button>
    </Form>
  );
};

export default GenderForm;
