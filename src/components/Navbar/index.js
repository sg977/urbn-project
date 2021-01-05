import React from "react";
import { Link } from "react-router-dom";
import { PageHeader, Button } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import "./style.css";

// Depending on the current path, this component sets the "active" class on the appropriate navigation link item
function Navbar() {
  return (
<div className="site-page-header-ghost-wrapper">
    <PageHeader
      ghost={false}
      title="Eat Out"
      subTitle="Life After Qurantine"
      extra={[
          <button type="primary">
            <HomeOutlined />
            <Link
            to="/urbn-project"
            className={
            window.location.pathname === "/urbn-project" || window.location.pathname === "/urbn-project"
              ? "nav-link active"
              : "nav-link"
            }
        >
        Home
            </Link>
            </button>,

        <Button>
            <SearchOutlined />
            <Link
            to="/urbn-project/discover"
            className={window.location.pathname === "/urbn-project/discover" ? "nav-link active" : "nav-link"}
            >
        Discover
            </Link>
        </Button>
      ]}
    >
    </PageHeader>
  </div>
  );
}

export default Navbar;