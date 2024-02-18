import React, { useEffect, useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { environmentVariables } from "../../config/env.config";
import "./../Pages/Updatedcss/HeaderUpdatedStyle.css";

import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const LogoutButtonContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-left: 20px;
  }
`;

const LogoutButton = styled.div`
  border: none;
  border-radius: 6px;
  color: #fff;
  font-weight: 700;
  margin-top: 10px;
  padding: 10px 14px;
  background: linear-gradient(to right, #01c3ccdb, #2a76e8f2);
`;

function Sidebar({ isSidebarVisible, handleToggleSidebar }) {
  const sidebarClass = `app-sidebar ${isSidebarVisible ? "visible" : ""}`;
  const storedData = localStorage.getItem("user");
  const userDataObj = JSON.parse(storedData);

  const MenuAdmin = () => {
    return (
      <>
        <li>
          <NavLink
            to="/dashboard"
            className="app-menu__item"
            href="dashboard.html"
          >
            <i className="app-menu__icon fa fa-home"></i>
            <span className="app-menu__label">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/category"
            className="app-menu__item"
            href="dashboard.html"
          >
            <i className="app-menu__icon fa-solid fa-business-time"></i>
            <span className="app-menu__label">Manage Category</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/allproducts"
            className="app-menu__item"
            href="dashboard.html"
          >
            <i className="app-menu__icon fa-solid fa-business-time"></i>
            <span className="app-menu__label">Manage Products</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/roles" className="app-menu__item" href="dashboard.html">
            <i className="app-menu__icon fa-solid fa-business-time"></i>
            <span className="app-menu__label">Manage Roles</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/subadmins"
            className="app-menu__item"
            href="dashboard.html"
          >
            <i className="app-menu__icon fa-solid fa-business-time"></i>
            <span className="app-menu__label">Manage Sub Admins</span>
          </NavLink>
        </li>

        {/* <li className="treeview">
          <a className="app-menu__item" href="#" data-toggle="treeview">
            <i className="app-menu__icon fa-solid fa-credit-card"></i>
            <span className="app-menu__label">Physical Card</span>
            <i className="treeview-indicator bi bi-chevron-right"></i>
          </a>
          <ul className="treeview-menu">
            <li>
              <NavLink className="treeview-item" to="/requestCard_admin">
                <div className="pointcircal"></div> Orders
              </NavLink>
            </li>
          </ul>
        </li> */}
        <li>
          <NavLink
            to="/zipcodes_available"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon bi bi-ui-checks"></i>
            <span className="app-menu__label">Manage Zipcodes</span>
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/CustomizedPlansSuperAdmin"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon bi bi-ui-checks"></i>
            <span className="app-menu__label">Customized Plans</span>
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/Coupons_admin"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon fa-solid fa-gift"></i>
            <span className="app-menu__label">Manage Coupons</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className="app-menu__item" href="docs.html">
            <i className="app-menu__icon fa-solid fa-gift"></i>
            <span className="app-menu__label">Manage Orders</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ui_inner_sections"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon fa-solid fa-indian-rupee-sign"></i>
            <span className="app-menu__label">UI Inner Banners</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/ui_landing_page_section" className="app-menu__item">
            <i className="app-menu__icon fa-regular fa-credit-card"></i>
            <span className="app-menu__label">UI Landing Page Sections</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/eyewear_collection"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon bi bi-ui-checks"></i>
            <span className="app-menu__label">
              Beautiful Eyewear Collection
            </span>
          </NavLink>
        </li>
        <li className="treeview">
          <NavLink
            to="/uiFrameData"
            className="treeview-item"
            href="form-samples.html"
          >
            <i className="app-menu__icon fa-solid fa-users"></i>
            <span className="app-menu__label">UI Frame Data</span>
          </NavLink>
        </li>
        <li className="treeview">
          <NavLink
            to="/bestseller"
            className="treeview-item"
            href="form-samples.html"
          >
            <i className="app-menu__icon fa-solid fa-users"></i>
            <span className="app-menu__label">BestSeller & Fashion Trend</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/pages" className="app-menu__item" href="docs.html">
            <i className="app-menu__icon fa-solid fa-business-time"></i>
            <span className="app-menu__label">Add/Manage Pages</span>
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/Setting_admin"
            className="app-menu__item"
            href="docs.html"
          >
            <i className="app-menu__icon fa-solid fa-gear"></i>
            <span className="app-menu__label">Settings</span>
          </NavLink>
        </li> */}
      </>
    );
  };

  return (
    <>
      <div
        className="app-sidebar__overlay"
        data-toggle="sidebar"
        id="app_sideBarStyle_wrapper"
      ></div>
      <aside className={sidebarClass} id="app_sidebarStyle_maincontainer">
        <ul className="app-menu">
          <div className="MobilesidebarcloseButton">
            {/* <i class="fa-solid fa-square-xmark"></i> */}
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <MenuAdmin></MenuAdmin>

          <LogoutButtonContainer>
            <LogoutButton
              style={{
                display: "flex",
                width: "50%",
                justifyContent: "center",
              }}
            >
              <Link to="/" style={{ color: "#fff", fontSize: "16px" }}>
                Logout
              </Link>
            </LogoutButton>
          </LogoutButtonContainer>
        </ul>
      </aside>
    </>
  );
}
//112 16:28
export default Sidebar;

/* 

 const MenuAdmin=()=>{
    return ( <>
    <li>
      <NavLink
        to="/super_dashboard"
        className="app-menu__item"
        href="super_dashboard.html"
      >
        <i className="app-menu__icon fa fa-home"></i>
        <span className="app-menu__label">Dashboard</span>
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/businesslist"
        className="app-menu__item"
        href="dashboard.html"
      >
        <i className="app-menu__icon fa-solid fa-business-time"></i>
        <span className="app-menu__label">Business</span>
      </NavLink>
    </li>
    <li className="treeview" onClick={Dropmenu}>
      <a className="app-menu__item" href="#" data-toggle="treeview">
        <i className="app-menu__icon fa-solid fa-users"></i>
        <span className="app-menu__label">Staff</span>
        <i className="treeview-indicator bi bi-chevron-right"></i>
      </a>
      <ul className="treeview-menu">
        <li>
          <NavLink
            to="/Roles"
            className="treeview-item"
            href="form-samples.html"
          >
            <div className="pointcircal"></div> Roles
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user"
            className="treeview-item"
            href="form-components.html"
          >
            <div className="pointcircal"></div> Users
          </NavLink>
        </li>
      </ul>
    </li>


    <li className="treeview" onClick={Dropmenu}>
      <a className="app-menu__item" href="#" data-toggle="treeview">
        <i className="app-menu__icon fa-solid fa-credit-card"></i>
        <span className="app-menu__label">Physical Card</span>
        <i className="treeview-indicator bi bi-chevron-right"></i>
      </a>
      <ul className="treeview-menu">
        <li>
          <NavLink className="treeview-item" to="/requestCard_admin">
            <div className="pointcircal"></div> Orders
          </NavLink>
        </li>
      </ul>
    </li>
    <li>
      <NavLink
        to="/PlansSuperAdmin"
        className="app-menu__item"
        href="docs.html"
      >
        <i className="app-menu__icon bi bi-ui-checks"></i>
        <span className="app-menu__label">Plans</span>
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/CustomizedPlansSuperAdmin"
        className="app-menu__item"
        href="docs.html"
      >
        <i className="app-menu__icon bi bi-ui-checks"></i>
        <span className="app-menu__label">Customized Plans</span>
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/Coupons_admin"
        className="app-menu__item"
        href="docs.html"
      >
        <i className="app-menu__icon fa-solid fa-gift"></i>
        <span className="app-menu__label">Coupons</span>
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/Currency_admin"
        className="app-menu__item"
        href="docs.html"
      >
        <i className="app-menu__icon fa-solid fa-indian-rupee-sign"></i>
        <span className="app-menu__label">Currency</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/addPhysicalCard" className="app-menu__item">
        <i className="app-menu__icon fa-regular fa-credit-card"></i>
        <span className="app-menu__label">Add Physical Card</span>
      </NavLink>
    </li>

    <li className="treeview" onClick={Dropmenu}>
      <a className="app-menu__item" href="#" data-toggle="treeview">
        <i className="app-menu__icon fa-solid fa-users"></i>
        <span className="app-menu__label">Bulk</span>
        <i className="treeview-indicator bi bi-chevron-right"></i>
      </a>
      <ul className="treeview-menu">
        <li>
          <NavLink
            to="/bulk_upload"
            className="treeview-item"
            href="form-samples.html"
          >
            <div className="pointcircal"></div> Bulk Upload
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/userUploadList"
            className="treeview-item"
            href="form-components.html"
          >
            <div className="pointcircal"></div> Imported Users
          </NavLink>
        </li>
      </ul>
    </li>
    <li>
      <NavLink
        to="/Setting_admin"
        className="app-menu__item"
        href="docs.html"
      >
        <i className="app-menu__icon fa-solid fa-gear"></i>
        <span className="app-menu__label">Settings</span>
      </NavLink>
    </li>



  </>)
  }
*/
