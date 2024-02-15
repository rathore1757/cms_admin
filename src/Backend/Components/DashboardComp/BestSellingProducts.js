import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import bestSellImg from "../../../Images/banner1.jpg";
import { countryContext } from "../../../context/countryContext";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

const BestSellingProducts = () => {
  const { activeCountry } = useContext(countryContext);
  const [bestSellingData, setBestSellingData] = useState(null);
  const [filterKey, setFilterKey] = useState("all");
  const getProduct = (id) => {
    if (bestSellingData?.tempArr && bestSellingData?.tempArr.length > 0) {
      return bestSellingData.tempArr.filter((val) => val.productObj.id == id);
    } else {
      return [];
    }
  };

  const getBestSellingData = () => {
    let url;
    if (filterKey == "all") {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_best_seller_product?country_code=${activeCountry}&limit=5`;
    } else {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_best_seller_product?country_code=${activeCountry}&limit=5&${filterKey}=true`;
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setBestSellingData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getBestSellingData();
  }, [filterKey, activeCountry]);
  return (
    <>
      <div className="totalsells-main">
        <div className="totalsells-heading">
          <h2>Total sells</h2>
          <h3>Products sell across all channels</h3>
        </div>
        <div className="totalsells-filter">
        <select onChange={(e) => setFilterKey(e.target.value)}>
            <option value="this_week">7 Days</option>
            <option value="this_month">1 Month</option>
            <option value="this_year">1 Year</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      
      <div className="bestselling-main">
        <Table hover className="processing-time-table-main">
          <tbody className="tablet-tbody">
            <tr className="tablet-tbody-row">
              <td>Best Selling Products</td>
              <td>Quantity</td>
              <td>Quantity(%)</td>
            </tr>
            {bestSellingData &&
              bestSellingData?.productOrderWithQuantity.length > 0 &&
              bestSellingData?.productOrderWithQuantity.map((val) => (
                <tr className="tablet-tbody-row">
                  <td className="best-sell-img-details">
                    <div className="best-sell-img">
                      <img src={`${environmentVariables?.apiUrl}uploads/${getProduct(val?.product_id)[0]?.productObj?.thumbnail_img}`} />
                    </div>
                    <div className="best-sell-detais">
                      <h2>
                        {getProduct(val?.product_id)[0]?.productObj?.title}
                      </h2>
                      <p>SKU: <span>{`  
                        ${
                          getProduct(val?.product_id)[0]?.productObj
                            ?.sku
                        }`}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td>{getProduct(val?.product_id)[0]?.productObj?.sku}</td>
                  <td>{val?.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default BestSellingProducts;
