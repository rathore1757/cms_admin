import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import "../common.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditVariantPopup from "./EditVariantPopup";
import { CheckBox } from "@material-ui/icons";
import CountryPopup from "./COuntryPopup";
const Addbutton = styled.button`
  padding: 15px 20px;
  border: 0;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 250px;
  margin-bottom: 50px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 500;
  &:hover {
    background-color: #032160;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const ProductBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  // gap: 50px;
`;
const SingleProductBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProduvtImage = styled.div`
  width: 280px;
  img {
    width: 100%;
  }
`;
const Title = styled.div``;
const Status = styled.div``;
const OnlyProductDetails = styled.div``;
const VariantDetails = styled.div``;
const VariantHeading = styled.div`
  font-size: 20px;
`;
const VariantThumbNailUrl = styled.img`
  height: 30px;
  width: 30px;
`;

const AllProducts = () => {
  const [updatedState, setUpdatedState] = useState(false);
  const [editVariantpopup, setEditVariantPopup] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [variantData, setVariantData] = useState();
  const [variantPricing, setVariantPricing] = useState();
  const [checkedRows, setCheckedRows] = useState([]);
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const navigate = useNavigate();
  const fetchAllProducts = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/product/fetch_all_product_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery(
    "allproducts",
    fetchAllProducts
  );

  useEffect(() => {
    refetch();
  }, [updatedState]);

  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery("categoryinallproduct", fetchCategoriesData);

  // console.log("categoryData", categoryData);

  const HandleEditProduct = (item) => {
    console.log("item", item);
  };
  const handleViewRow = (item) => {
    // console.log("111111111", item);
    navigate(`/view/${item?.id}`);
  };
  const columns = [
    {
      name: "Title",
      selector: "title",
    },
    {
      name: "Status",
      selector: "status",
    },
    {
      name: "Category",
      selector: "cat_id",
      cell: (d) => {
        const category = categoryData?.categories.find(
          (m) => m.id === d.cat_id
        );
        return category ? category.value : "Unknown Material";
      },
    },
    {
      name: "Material",
      selector: "material_id",
      cell: (d) => {
        const material = categoryData?.material.find(
          (m) => m.id === d.material_id
        );
        return material ? material.value : "Unknown Material";
      },
    },
    {
      name: "Shape",
      selector: "shape_id",
      cell: (d) => {
        const shape = categoryData?.shape.find((m) => m.id === d.shape_id);
        return shape ? shape.value : "Unknown Material";
      },
    },
    {
      name: "View",
      selector: "view",
      cell: (d, index) => (
        <button onClick={(e) => handleViewRow(d, index)}>View</button>
      ),
    },
  ];
  const selectedItems = data;
  const tableExtensions = {
    export: false,
    print: false,
    // filter: false,
  };

  // console.log("data111", data);
  const rows = [
    { id: 1, name: "Row 1", subrows: ["Subrow 1.1", "Subrow 1.2"] },
    { id: 2, name: "Row 2", subrows: ["Subrow 2.1", "Subrow 2.2"] },
    // Add more rows with subrows as needed
  ];

  const handleEditVariantPricing = (item, data) => {
    // console.log(item);
    setEditVariantPopup(true);
    setVariantPricing(item);
    setVariantData(data);
  };
  const getCountryDetails = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get_active`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setCountryData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setCountryData([]);
      });
  };
  useEffect(() => {
    getCountryDetails();
  }, []);

  const handleCheckboxChange = (subrow) => {
    if (checkedRows.includes(subrow.variant_id)) {
      setCheckedRows(
        checkedRows.filter((rowId) => rowId !== subrow.variant_id)
      );
    } else {
      setCheckedRows([...checkedRows, subrow.variant_id]);
    }
  };
  // console.log("selectedCountries", selectedCountries);
  return (
    <div>
      <Addbutton
        onClick={() => {
          navigate("/addproducts");
        }}
      >
        + Add New Product
      </Addbutton>
      <div>
        <Heading>All Products</Heading>
        <ProductBox>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data?.map((row, index) => (
                    <TableRow key={index} style={{ verticalAlign: "top" }}>
                      <TableCell style={{ paddingTop: "40px", border: "0" }}>
                        {row.id}
                      </TableCell>
                      <TableCell className="admin-main-product">
                        <Accordion className="admin-main-product-accordion">
                          <AccordionSummary
                            className="admin-main-product"
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <Typography>{row.title}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    style={{ width: "15%" }}
                                  ></TableCell>
                                  <TableCell
                                    style={{ width: "15%" }}
                                  ></TableCell>
                                  <TableCell style={{ width: "15%" }}>
                                    ID
                                  </TableCell>
                                  <TableCell style={{ width: "17%" }}>
                                    Color
                                  </TableCell>
                                  <TableCell style={{ width: "17%" }}>
                                    Country
                                  </TableCell>
                                  <TableCell style={{ width: "17%" }}>
                                    Price
                                  </TableCell>
                                  <TableCell style={{ width: "17%" }}>
                                    Stock
                                  </TableCell>
                                  <TableCell style={{ width: "17%" }}>
                                    Discount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.variants?.map((subrow, subindex) => {
                                  console.log(subrow);
                                  return subrow?.variant_price_details.length >
                                    0 ? (
                                    subrow?.variant_price_details?.map(
                                      (subsubrow, subsubindex) => {
                                        return (
                                          <TableRow
                                            key={subindex}
                                            style={{
                                              // display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <TableCell>
                                              <input
                                                type="checkbox"
                                                checked={
                                                  subsubrow?.country
                                                    ? true
                                                    : false
                                                }
                                                onChange={() =>
                                                  handleCheckboxChange(subrow)
                                                }
                                                onClick={() => {
                                                  if (!subsubrow.country) {
                                                    setVariantData(subrow);
                                                    setShowCountryPopup(true);
                                                  }
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                maxWidth: "100px",
                                                maxHeight: "60px",
                                                borderRadius: "3px",
                                              }}
                                            >
                                              <img
                                                style={{ width: "100%" }}
                                                src={`${environmentVariables?.apiUrl}uploads/${subrow?.thumbnail_url}`}
                                                alt="img"
                                              />
                                            </TableCell>
                                            <TableCell
                                             
                                            >
                                              {subrow?.variant_id}
                                            </TableCell>

                                            <TableCell>
                                              <div
                                                style={{
                                                  backgroundColor: `${subrow?.colorName}`,
                                                  height: "10px",
                                                  width: "10px",
                                                }}
                                              ></div>
                                            </TableCell>
                                            <TableCell>
                                              {subsubrow?.country}
                                            </TableCell>
                                            <TableCell onClick={() =>
                                                handleEditVariantPricing(
                                                  subsubrow,
                                                  subrow
                                                )
                                              }>
                                             <span style={{border: "1px solid #000" , borderRadius:"5px", padding:"15px 50px", cursor:"pointer"}}> {subsubrow?.price} </span>
                                            </TableCell>
                                            <TableCell>
                                              {subsubrow?.stock}
                                            </TableCell>
                                            <TableCell>
                                              {subsubrow?.discount}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  ) : (
                                    <TableRow>
                                      {" "}
                                      <TableCell>
                                        <input
                                          type="checkbox"
                                          checked={false}
                                          onChange={() =>
                                            handleCheckboxChange(subrow)
                                          }
                                          onClick={() => {
                                            setVariantData(subrow);
                                            setShowCountryPopup(true);
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {subrow?.variant_id}
                                      </TableCell>
                                      <TableCell>
                                        <div
                                          style={{
                                            backgroundColor: `${subrow?.colorName}`,
                                            height: "10px",
                                            width: "10px",
                                          }}
                                        ></div>
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Typography
                          className="admin-view-edit"
                          onClick={() => handleViewRow(row)}
                        >
                          View / Edit
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <DataTableExtensions
            columns={columns}
            data={selectedItems}
            {...tableExtensions}
          >
            <DataTable
              noHeader
              defaultSortField="id"
              defaultSortAsc={false}
              highlightOnHover
              pagination
            />
          </DataTableExtensions> */}

          {/* {data?.map((item, index) => {
            return (
              <SingleProductBox key={index}>
                <div onClick={() => HandleEditProduct(item)}>Edit</div>
                <OnlyProductDetails>
                  <ProduvtImage>
                    <img
                      src={`${
                        environmentVariables?.apiUrl
                      }uploads/${item?.thumbnail_img?.replace(/"/g, "")}`}
                    />
                  </ProduvtImage>
                  <Title>Title: {item?.title}</Title>
                  <Title>Slug: {item?.slug}</Title>

                  <Status>
                    Status: {item?.status === "active" ? "Active" : "Inactive"}
                  </Status>
                  {categoryData?.categories
                    .filter((innerItem) => innerItem?.id === item?.cat_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Category: {innerItem?.title}
                      </Status>
                    ))}

                  {categoryData?.material
                    .filter((innerItem) => innerItem?.id === item?.material_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Material: {innerItem?.value}
                      </Status>
                    ))}

                  {categoryData?.shape
                    .filter((innerItem) => innerItem?.id === item?.shape_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Shape: {innerItem?.value}
                      </Status>
                    ))}

                  <Status>
                    {" "}
                    Gender:
                    {categoryData?.gender
                      .filter((innerItem) =>
                        item?.gender?.includes(innerItem.id.toString())
                      )
                      .map((innerItem, innerIndex, array) => (
                        <span key={innerIndex}>
                          {innerItem?.value}{" "}
                          {innerIndex !== array.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </Status>
                </OnlyProductDetails>
                <VariantDetails>
                  <VariantHeading>Variant Details</VariantHeading>
                  {item?.variants?.map?.((innerItem, innerIndex) => {
                    return (
                      <div
                        key={innerIndex}
                        style={{
                          backgroundColor: "lightgrey",
                          marginTop: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "10px",
                          }}
                        >
                          <div>name: {innerItem?.variant_name}</div>
                          <div>Sku: {innerItem?.sku}</div>
                          <VariantThumbNailUrl
                            src={`${
                              environmentVariables?.apiUrl
                            }uploads/${innerItem?.thumbnail_url?.replace(
                              /"/g,
                              ""
                            )}`}
                          />
                          <div>
                            {categoryData?.color
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id === innerItem?.color_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Color : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>
                            {categoryData?.weight_group
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id ===
                                  innerItem?.weight_group_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Weight : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>
                            {categoryData?.size
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id === innerItem?.size_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Size : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>Frame width: {innerItem?.frame_width}</div>
                          <div>Lens width: {innerItem?.lens_width}</div>
                          <div>Lens height: {innerItem?.lens_height}</div>
                          <div>Bridge weight: {innerItem?.bridge_width}</div>
                          <div>Temple length: {innerItem?.temple_length}</div>
                          <div>Status {innerItem?.status}</div>
                          <div>
                            <div>Price Details</div>
                            <div>
                              {innerItem?.variant_price_details?.map(
                                (variantItem, variantIndex) => {
                                  return (
                                    <div key={variantIndex}>
                                      <div>
                                        Country name :{variantItem?.country}
                                      </div>
                                      <div>Tax :{variantItem?.tax}</div>
                                      <div>
                                        Tax name:{variantItem?.tax_name}
                                      </div>
                                      <div>
                                        Discount :{variantItem?.discount}
                                      </div>
                                      <div>
                                        Country Code :
                                        {variantItem?.country_code}
                                      </div>
                                      <div>
                                        Symbol :{variantItem?.currency_symbol}
                                      </div>
                                      <div>Stock :{variantItem?.stock}</div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </VariantDetails>
              </SingleProductBox>
            );
          })} */}
          {editVariantpopup && (
            <EditVariantPopup
              open={editVariantpopup}
              setOpen={setEditVariantPopup}
              categoryData={categoryData}
              countryData={countryData}
              varaintId={variantData}
              variantData={variantPricing}
              setUpdatedState={setUpdatedState}
              updatedState={updatedState}
            />
          )}
          {showCountryPopup && (
            <CountryPopup
              open={showCountryPopup}
              setOpen={setShowCountryPopup}
              countryData={countryData}
              variantData={variantData}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              setUpdatedState={setUpdatedState}
              updatedState={updatedState}
            />
          )}
        </ProductBox>
      </div>
    </div>
  );
};

export default AllProducts;
