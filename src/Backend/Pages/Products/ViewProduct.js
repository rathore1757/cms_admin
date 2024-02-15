import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import { useParams, useNavigate } from "react-router-dom";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { toast } from "react-toastify";
import AddVariantPopup from "./AddVariantPopup";

const ViewProduct = () => {
  const { id } = useParams();
  console.log(id);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [productTitle, setProductTitle] = useState();
  const [slug, setSlug] = useState();
  const [description, setDescription] = useState();
  const [summary, setSummary] = useState();
  const [status, setStatus] = useState();
  // const [productCategory, setProductCategory] = useState();
  // const [productMaterial, setProductMaterial] = useState();
  // const [productShape, setProductShape] = useState();
  const [thumbnail, setThumbNail] = useState();
  const [genderArr, setGenderArr] = useState();
  const [frameWidth, setFrameWidth] = useState();
  const [lensWidth, setLensWidth] = useState();
  const [lensHeight, setLensHeight] = useState();
  const [bridgeWidth, setBridgeWidth] = useState();
  const [templeLength, setTempleLength] = useState();
  const [addPopup, setAddPopup] = useState(false);
  const [updatedState, setUpdatedState] = useState(false);

  //   const fetchProductById = async () => {
  //     const response = await axios.get(
  //       `${environmentVariables?.apiUrl}api/admin/product/fetch_product_by_id?id=${id}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     return response?.data?.data;
  //   };

  //   const { data, isLoading, error, refetch } = useQuery(
  //     "productbyid",
  //     fetchProductById
  //   );
  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const getProductById = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_product_by_id?id=${id}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setData();
      });
  };

  const {
    data: categoryData,
    // isLoading,
    // error,
    // refetch,
  } = useQuery("categoryinproductbyid", fetchCategoriesData);

  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    setGenderArr(selectedValues);
  };

  const options = categoryData?.gender.map((gender) => ({
    label: gender.value,
    value: gender.id?.toString(),
  }));
  // const options = [
  //   { label: "Men", value: "1" },
  //   { label: "Women", value: "2" },
  //   { label: "Kids", value: "3" },
  // ];
  console.log(genderArr, data, categoryData);
  const updateProduct = () => {
    console.log(
      id,
      summary,
      description,
      productTitle,
      slug,
      // productCategory,
      // productMaterial,
      // productShape,
      thumbnail,
      genderArr,
      status
    );
    let formdata = new FormData();
    formdata.append("summary", summary);
    formdata.append("description", description);
    formdata.append("product_id", id);
    formdata.append("title", productTitle);
    formdata.append("slug", slug);
    // formdata.append("cat_id", productCategory);
    // formdata.append("material_id", productMaterial);
    // formdata.append("shape_id", productShape);
    formdata.append("thumbnail_img", thumbnail);
    formdata.append("status", status);
    for (let i = 0; i < genderArr.length; i++) {
      formdata.append(`gender[${i}]`, genderArr[i]);
    }
    formdata.append("frame_width", frameWidth);
    formdata.append("lens_width", lensWidth);
    formdata.append("lens_height", lensHeight);
    formdata.append("bridge_width", bridgeWidth);
    formdata.append("temple_length", templeLength);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/product/edit_product`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        getProductById();
        toast.success("Product Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const tableExtensions = {
    export: false,
    print: false,
    filter: false,
  };
  const columns = [
    {
      name: "Color",
      selector: "colorName",

      cell: (d, index) => {
        return (
          <div
            style={{
              backgroundColor: `${d?.colorName}`,
              height: "10px",
              width: "10px",
            }}
          ></div>
        );
      },
    },
    {
      name: "View",
      selector: "view",
      cell: (d, index) => (
        <button onClick={(e) => navigate(`/variant/${d?.variant_id}`)}>
          View
        </button>
      ),
    },
  ];
  const selectedItems = data?.variantData;
  useEffect(() => {
    getProductById();
  }, [id, updatedState]);

  useEffect(() => {
    if (data) {
      console.log("data?.gender", data?.gender);
      setProductTitle(data.title);
      setSlug(data.slug);
      setDescription(data?.description);
      setSummary(data?.summary);
      setStatus(data?.status);
      // setProductCategory(data?.cat_id);
      // setProductMaterial(data?.material_id);
      // setProductShape(data?.shape_id);
      setThumbNail(data?.thumbnail_img);
      setGenderArr(data?.gender);
      setFrameWidth(data?.frame_width);
      setLensWidth(data?.lens_width);
      setLensHeight(data?.lens_height);
      setBridgeWidth(data?.bridge_width);
      setTempleLength(data?.temple_length);
    }
  }, [data]);
  if (loading) return <h1>Loading</h1>;
  //   if (error) return <h1>Error</h1>;
  console.log(data, options);
  return (
    <div>
      <div>Product</div>
      <div>
        {data && (
          <div>
            <input
              type="text"
              placeholder="Product Title"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
            />
            <textarea
              rows={4}
              // cols={50}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <textarea
              rows={4}
              // cols={50}
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <input
              type="checkbox"
              id="custom-switch"
              label="Enable/Disable Button"
              checked={status === "active"}
              onChange={(e) =>
                setStatus(e.target.checked ? "active" : "inactive")
              }
            />
            {/* <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>

              {categoryData?.categories?.map((item, index) => {
                return (
                  <option value={item?.id} key={index}>
                    {item?.title}
                  </option>
                );
              })}
            </select>

            <select
              value={productMaterial}
              onChange={(e) => setProductMaterial(e.target.value)}
            >
              <option value="" disabled>
                Select Material
              </option>

              {categoryData?.material?.map((item, index) => {
                return (
                  <option value={item?.id} key={index}>
                    {item?.value}
                  </option>
                );
              })}
            </select>

            <select
              value={productShape}
              onChange={(e) => setProductShape(e.target.value)}
            >
              <option value="" disabled>
                Select Shape
              </option>

              {categoryData?.shape?.map((item, index) => {
                return (
                  <option value={item?.id} key={item?.is}>
                    {item?.value}
                  </option>
                );
              })}
            </select> */}

            <input
              type="number"
              placeholder="Frame Width"
              value={frameWidth}
              onChange={(e) => setFrameWidth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Lens Width"
              value={lensWidth}
              onChange={(e) => setLensWidth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Lens Height"
              value={lensHeight}
              onChange={(e) => setLensHeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="Bridge Width"
              value={bridgeWidth}
              onChange={(e) => setBridgeWidth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Temple Length"
              value={templeLength}
              onChange={(e) => setTempleLength(e.target.value)}
            />

            <img src={`${environmentVariables?.apiUrl}uploads/${thumbnail}`} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbNail(e.target.files[0])}
              ref={fileInputRef}
            />

            <MultiSelect
              className="multi-select"
              onChange={handleOnchangeGender}
              options={options}
              defaultValue={genderArr}
              style={{ width: "100%" }}
            />
          </div>
        )}
        <button onClick={() => updateProduct()}>Update Product</button>
      </div>

      <div onClick={() => setAddPopup(true)}>Add New Variant</div>
      <h2>Product Variant</h2>
      <div>
        <DataTableExtensions
          columns={columns}
          data={selectedItems}
          {...tableExtensions}
        >
          <DataTable
            noHeader
            defaultSortField="id"
            defaultSortAsc={false}
            highlightOnHover
          />
        </DataTableExtensions>
      </div>
      {addPopup && (
        <AddVariantPopup
          open={addPopup}
          setOpen={setAddPopup}
          categoryData={categoryData}
          productId={id}
          updatedState={updatedState}
          setUpdatedState={setUpdatedState}
        />
      )}
    </div>
  );
};

export default ViewProduct;
