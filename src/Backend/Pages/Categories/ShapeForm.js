import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { AddShapeSchema } from "../../../common/Schemas/AddShapeSchema";
import { useFormik } from "formik";

const ShapeForm = ({ updatedState, setUpdatedState }) => {
  const initialValues = {
    shapeValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddShapeSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values?.shapeValue, values?.isButtonDisabled);
      let formData = new FormData();
      formData.append("mainTitle", "shape");
      formData.append("value", values?.shapeValue);
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
          console.log(JSON.stringify(response.data));
          toast.success("Category Added Successfully");
          setUpdatedState(!updatedState);
          resetForm({});
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Shape"
          className="logform-input"
          name="shapeValue"
          value={values.shapeValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.shapeValue && formik.errors.shapeValue ? (
          <div style={{ color: "red" }}>{formik.errors.shapeValue}</div>
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
        Add Shape
      </Button>
    </Form>
  );
};

export default ShapeForm;
