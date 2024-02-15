import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddVariantSchema } from "./../../../common/VariantSchema/variantSchema";
import { useFormik } from "formik";

const AddVariantPopup = ({
  open,
  setOpen,
  categoryData,
  productId,
  setUpdatedState,
  updatedState,
}) => {
  const initialValues = {
    colorValue: "",
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddVariantSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("colorValue", values.colorValue, categoryData);
      let data = new FormData();
      data.append("color_id", values.colorValue);
      data.append("product_id", productId);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant`,

        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setUpdatedState(!updatedState);
          setOpen(false);
          toast.success("New Variant Added Successfully");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });

      //   let formData = new FormData();
      //   formData.append("mainTitle", "color");
      //   let config = {
      //     method: "post",
      //     url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      //     withCredentials: true,
      //     data: formData,
      //   };
      //   axios
      //     .request(config)
      //     .then((response) => {
      //       toast.success("Color Added Successfully");
      //       setUpdatedState(!updatedState);
      //       resetForm({});
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       toast.error(error?.response?.data?.message || error?.message, {
      //         position: toast.POSITION.TOP_RIGHT,
      //       });
      //     });
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      {/* <select
        value={d.color}
        onChange={(e) => handleInputChange(e, index, "color")}
      >
        <option value="" disabled>
          Select Color
        </option>
        {data?.color?.map((option, index) => (
          <option
            value={option?.id}
            key={index}
            style={{ backgroundColor: option?.value }}
          >
            {option?.value}
          </option>
        ))}
      </select> */}
      <Modal.Header closeButton>
        <Modal.Title>Add Color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Select
              value={values.colorValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="colorValue"
            >
              <option value="" disabled>
                Select color
              </option>

              {categoryData?.color?.map((item, index) => {
                return (
                  <option
                    value={item?.id}
                    key={index}
                    style={{ backgroundColor: item?.value }}
                  >
                    {item?.value}
                  </option>
                );
              })}
            </Form.Select>
            {formik.touched.colorValue && formik.errors.colorValue ? (
              <div style={{ color: "red" }}>{formik.errors.colorValue}</div>
            ) : null}
          </Form.Group>
          {/* <Form.Group>
            <Form.Control
              type="color"
              name="colorValue"
              value={values.colorValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          {formik.touched.colorValue && formik.errors.colorValue ? (
            <div style={{ color: "red" }}>{formik.errors.colorValue}</div>
          ) : null} */}
          {/* <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable Button"
            checked={status === "active"}
            onChange={handleSwitchChange}
          /> */}
        </Form>
        <Button
          onClick={() => handleSubmit()}
          style={{ width: "200px", alignSelf: "end" }}
        >
          Add new Variant
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantPopup;
