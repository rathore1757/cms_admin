import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { WeightGroupSchema } from "../../../common/Schemas/WeightGroupSchema";

const WeightGroupForm = ({ updatedState, setUpdatedState }) => {
  const initialValues = {
    weightValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: WeightGroupSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values?.weightValue, values?.isButtonDisabled);
      let formData = new FormData();
      formData.append("mainTitle", "weight_group");
      formData.append("value", values?.weightValue);
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
          // console.log(JSON.stringify(response.data));
          toast.success("Weight Added Successfully");
          setUpdatedState(!updatedState);
          resetForm({});
        })
        .catch((error) => {
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
          type="text"
          placeholder="Shape"
          className="logform-input"
          name="weightValue"
          value={values.weightValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.weightValue && formik.errors.weightValue ? (
          <div style={{ color: "red" }}>{formik.errors.weightValue}</div>
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
        Add Weight
      </Button>
    </Form>
  );
};

export default WeightGroupForm;
