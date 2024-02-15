import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { AddShapeSchema } from "../../../common/Schemas/AddShapeSchema";
import { useFormik } from "formik";
import { AddColorSchema } from "../../../common/Schemas/AddColorSchema";

const ColorForm = ({ updatedState, setUpdatedState }) => {
  const initialValues = {
    colorValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddColorSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values?.colorValue, values?.isButtonDisabled);
      let formData = new FormData();
      formData.append("mainTitle", "color");
      formData.append("value", values?.colorValue);
      formData.append(
        "status",
        values?.isButtonDisabled ? "active" : "inactive"
      );

      let config = {
        method: "post",
        url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
        withCredentials: true,
        data: formData,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success("Color Added Successfully");
          setUpdatedState(!updatedState);
          resetForm({});
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });

      //   const formdata = new FormData();
      //   formdata.append("image", selectedImage);
      //   formdata.append("value", values?.genderValue);
      //   formdata.append(
      //     "status",
      //     values?.isButtonDisabled ? "active" : "inactive"
      //   );
      //   let config = {
      //     method: "post",
      //     url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
      //     withCredentials: true,
      //     data: formdata,
      //   };
      //   axios
      //     .request(config)
      //     .then((response) => {
      //       fileInputRef.current.value = null;
      //       toast.success("Category Added Successfully");
      //       setUpdatedState(!updatedState);
      //       resetForm({});
      //       formik.setFieldValue("genderInCategory", []);
      //     })
      //     .catch((error) => {
      //       toast.error(error?.response?.data?.message || error?.message, {
      //         position: toast.POSITION.TOP_RIGHT,
      //       });
      //     });
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="color"
          className="logform-input"
          name="colorValue"
          value={values.colorValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.colorValue && formik.errors.colorValue ? (
          <div style={{ color: "red" }}>{formik.errors.colorValue}</div>
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
        style={{ width: "200px", alignSelf: "end" }}
        onClick={() => handleSubmit()}
      >
        Add Color
      </Button>
    </Form>
  );
};

export default ColorForm;
