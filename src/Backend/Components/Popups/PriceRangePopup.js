import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import { PriceRangeSchema } from "../../../common/Schemas/PriceRangeSchema";

const PriceRangePopup = ({
  open,
  setOpen,
  PriceRangeInfo,
  setUpdatedState,
  updatedState,
}) => {
  //   console.log(PriceRangeInfo, "PriceRangeInfo");
  const [status, setStatus] = useState(PriceRangeInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };
  const initialValues = {
    maxPriceValue: PriceRangeInfo?.max,
    minPriceValue: PriceRangeInfo?.min,
  };
  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: PriceRangeSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(
        values?.maxPriceValue,
        values?.minPriceValue,
        status,
        PriceRangeInfo?.id
      );

      let formData = new FormData();
      formData.append("mainTitle", "price_range");
      formData.append("min", values?.minPriceValue);
      formData.append("max", values?.maxPriceValue);
      formData.append("id", PriceRangeInfo?.id);
      formData.append("status", status);
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
          toast.success("Price Updated Successfully");
          setUpdatedState(!updatedState);
          setOpen(false);
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

  //   const handleSwitchChange = (e) => {
  //     const newStatus = e.target.checked ? "active" : "inactive";
  //     setStatus(newStatus);
  //   };

  //   const EditButtonClicked = () => {
  //     let data = {
  //       mainTitle: "price_range",
  //       min: minPriceValue,
  //       max: maxPriceValue,
  //       status: status,
  //       id: PriceRangeInfo?.id,
  //     };
  //     console.log("data", data);
  //     // let config = {
  //     //   method: "post",
  //     //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
  //     //   withCredentials: true,
  //     //   data: data,
  //     // };

  //     // axios
  //     //   .request(config)
  //     //   .then((response) => {
  //     //     console.log(JSON.stringify(response.data));
  //     //     toast.success("Price Updated Successfully");
  //     //     setUpdatedState(!updatedState);
  //     //     setOpen(false);
  //     //   })
  //     //   .catch((error) => {
  //     //     toast.error(error?.response?.data?.message || error?.message, {
  //     //       position: toast.POSITION.TOP_RIGHT,
  //     //     });
  //     //   });
  //   };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Price Range</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="number"
              placeholder="Min Price"
              className="logform-input"
              name="minPriceValue"
              value={values.minPriceValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.minPriceValue && formik.errors.minPriceValue ? (
              <div style={{ color: "red" }}>{formik.errors.minPriceValue}</div>
            ) : null}
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="number"
              placeholder="Max Price"
              className="logform-input"
              name="maxPriceValue"
              value={values.maxPriceValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.maxPriceValue && formik.errors.maxPriceValue ? (
              <div style={{ color: "red" }}>{formik.errors.maxPriceValue}</div>
            ) : null}
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
          onClick={() => handleSubmit()}
          style={{ width: "200px", alignSelf: "end" }}
        >
          Edit Price
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default PriceRangePopup;
