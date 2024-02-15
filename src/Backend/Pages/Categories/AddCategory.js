import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { AddCategorySchema } from "../../../common/Schemas/AddCategorySchema";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryPopup from "../../Components/Popups/CategoryPopup";
import GenderPopup from "../../Components/Popups/GenderPopup";
import CategoryForm from "./CategoryForm";
import GenderForm from "./GenderForm";
import ShapeForm from "./ShapeForm";
import MaterialForm from "./MaterialForm";
import ColorForm from "./ColorForm";
import SizeForm from "./SizeForm";
import WeightGroupForm from "./WeightGroupForm";
import ShapePopup from "../../Components/Popups/ShapePopup";
import SizePopup from "../../Components/Popups/SizePopup";
import MaterialPopup from "../../Components/Popups/MaterialPopup";
import ColorPopup from "../../Components/Popups/ColorPopup";
import WeightGroup from "../../Components/Popups/WeightGroupPopup";
import PriceRangeForm from "./PriceRangeForm";
import PriceRangePopup from "../../Components/Popups/PriceRangePopup";
import styled from "styled-components";

// Create a styled component
const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
  `;
const CategorySingle = styled.div`
  margin-bottom: 50px;
`;


const AddCategory = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showGenderPopup, setShowGenderPopup] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showMaterialPopup, setShowMaterialPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showWeightGroupPopup, setShowWeightGroupPopup] = useState(false);
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false);

  // const [genderInCategory, setGenderInCategory] = useState([]);

  const [updatedState, setUpdatedState] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState();
  const [genderInfo, setGenderInfo] = useState();
  const [shapeInfo, setShapeInfo] = useState();
  const [sizeInfo, setSizeInfo] = useState();
  const [materialInfo, setMaterialInfo] = useState();
  const [colorInfo, setColorInfo] = useState();
  const [WeightGroupInfo, setWeightGroupInfo] = useState();
  const [PriceRangeInfo, setPriceRangeInfo] = useState();

  // const handleButtonClick = () => {
  //   formik.setValues({
  //     ...formik.values,
  //     isButtonDisabled: !formik.values.isButtonDisabled,
  //   });
  // };

  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery(
    "category",
    fetchCategoriesData
  );

  useEffect(() => {
    refetch();
  }, [updatedState]);

  // console.log("categoryData", data);

  const handleDeleteCategory = (item, title) => {
    console.log("item", item?.id);
    let config = {
      method: "delete",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/delete_category_by_id?id=${item?.id}&title=${title}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success(`${title} Deleted Successfully`);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  return (
    <>
      <CategorySingle>
        {" "}
        <Heading>Categories</Heading>
        <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <CategoryForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          </div>
          {data?.categories?.map((item, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={index}
              >
                <div
                  style={{
                    margin: "10px",
                    backgroundColor: "lightgray",
                    padding: "10px",
                  }}
                >
                  {item?.value}
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setShowCategoryPopup(true);
                      setCategoryInfo(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(item, "categories")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}

          
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Gender</Heading>
        <div>
          <div>
            {data?.gender?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  {" "}
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowGenderPopup(true);
                        setGenderInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(item, "gender")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <GenderForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Gender"
                  className="logform-input"
                  name="gender"
                  value={formik.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
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
            </Form> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Shape</Heading>
        <div>
          <div>
            {data?.shape?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowShapePopup(true);
                        setShapeInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteCategory(item, "shape")}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ShapeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Material</Heading>
        <div>
          <div>
            {data?.material?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowMaterialPopup(true);
                        setMaterialInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(item, "material")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <MaterialForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Color</Heading>
        <div>
          <div>
            {data?.color?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowColorPopup(true);
                        setColorInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteCategory(item, "color")}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ColorForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Size</Heading>
        <div>
          <div>
            {data?.size?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowSizePopup(true);
                        setSizeInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteCategory(item, "size")}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <SizeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Weight Groups</Heading>
        <div>
          <div>
            {data?.weight_group?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                  >
                    {item?.value}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowWeightGroupPopup(true);
                        setWeightGroupInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(item, "weight_group")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <WeightGroupForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Price Range</Heading>
        <div>
          <div>
            {data?.price_range?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  {" "}
                  <div
                    style={{
                      margin: "10px",
                      backgroundColor: "lightgray",
                      padding: "10px",
                    }}
                    key={index}
                  >
                    {item?.min} - {item?.max}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowPriceRangePopup(true);
                        setPriceRangeInfo(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(item, "price_range")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <PriceRangeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
            {/* <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="category"
                  className="logform-input"
                  name="category"
                  value={formik.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}>{formik.errors.category}</div>
                ) : null}
              </Form.Group>
            </Form> */}
            {/* <Button
              onClick={() => setShowPopup(!showPopup)}
              style={{ width: "200px", alignSelf: "end" }}
            >
              Add Gender
            </Button> */}
          </div>
        </div>
      </CategorySingle>
      
      {showCategoryPopup && (
        <CategoryPopup
          open={showCategoryPopup}
          setOpen={setShowCategoryPopup}
          categoryInfo={categoryInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></CategoryPopup>
      )}
      {showGenderPopup && (
        <GenderPopup
          open={showGenderPopup}
          setOpen={setShowGenderPopup}
          genderInfo={genderInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></GenderPopup>
      )}
      {showShapePopup && (
        <ShapePopup
          open={showShapePopup}
          setOpen={setShowShapePopup}
          shapeInfo={shapeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></ShapePopup>
      )}
      {showSizePopup && (
        <SizePopup
          open={showSizePopup}
          setOpen={setShowSizePopup}
          sizeInfo={sizeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></SizePopup>
      )}
      {showMaterialPopup && (
        <MaterialPopup
          open={showMaterialPopup}
          setOpen={setShowMaterialPopup}
          materialInfo={materialInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></MaterialPopup>
      )}
      {showColorPopup && (
        <ColorPopup
          open={showColorPopup}
          setOpen={setShowColorPopup}
          colorInfo={colorInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></ColorPopup>
      )}
      {showWeightGroupPopup && (
        <WeightGroup
          open={showWeightGroupPopup}
          setOpen={setShowWeightGroupPopup}
          WeightGroupInfo={WeightGroupInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></WeightGroup>
      )}
      {showPriceRangePopup && (
        <PriceRangePopup
          open={showPriceRangePopup}
          setOpen={setShowPriceRangePopup}
          PriceRangeInfo={PriceRangeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></PriceRangePopup>
      )}
      {/* {showPopup ? (
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="logform-lable custom-placeholder-color">
              Slug
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Slug"
              className="logform-input"
              name="slug"
              value={formik.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.slug && formik.errors.slug ? (
              <div style={{ color: "red" }}>{formik.errors.slug}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="eyeeye-main">
            <Form.Label className="logform-lable">Title</Form.Label>
            <Form.Control
              // type={showPassword ? "text" : "password"}
              placeholder="Title"
              className="logform-input"
              name="title"
              value={formik.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          {formik.touched.title && formik.errors.title ? (
            <div style={{ color: "red" }}>{formik.errors.title}</div>
          ) : null}

          <Form.Group controlId="formBasicPassword" className="eyeeye-main">
            <Form.Label className="logform-lable">Value</Form.Label>
            <Form.Control
              // type={showPassword ? "text" : "password"}
              placeholder="Category"
              className="logform-input"
              name="category"
              value={formik.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          {formik.touched.category && formik.errors.category ? (
            <div style={{ color: "red" }}>{formik.errors.category}</div>
          ) : null}

          <Form.Group as={Row} className="mb-3">
            <Col xs={6}>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Enable/Disable Button"
                checked={formik.isButtonDisabled}
                onClick={handleButtonClick}
              />
            </Col>
          </Form.Group>

          <Button
            onClick={handleSubmit}
            disabled={isSubmit}
            variant="primary"
            className="login-button"
          >
            {isSubmit ? "Loader" : "Submit"}
          </Button>
        </Form>
      ) : (
        <></>
      )} */}
      <ToastContainer />
    </>
  );
};

export default AddCategory;
