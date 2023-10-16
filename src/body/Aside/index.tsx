import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
// import { asideList, ROUTERPATH } from "../contants";

export const asideList = ["拖拽", "分子式", "甘特图", "列表拖拽", "甘特图1"];

export const ROUTERPATH: { [x: string]: string } = {
  拖拽: "drag",
  分子式: "numerator",
  甘特图: "gantt",
  列表拖拽: "beautyifyDnd",
  甘特图1: "GanttOne",
};
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = asideList.map((aside) => {
  return {
    key: aside,
    label: aside,
  };
});

export const Aside: React.FC = () => {
  const navigate = useNavigate();

  const nowSecKey =
    (sessionStorage.getItem("secondKeys") as string) || "推荐歌单";
  const defaultMenu = sessionStorage.getItem("subMenu") as string;

  const onClick: MenuProps["onClick"] = (e) => {
    sessionStorage.setItem("subMenu", e.keyPath[1]);
    sessionStorage.setItem("secondKeys", e.key);
    console.log("aaaaaa", `${ROUTERPATH[e.key]}`);

    navigate(`main/${ROUTERPATH[e.key]}`);
  };

  return (
    <AntMenu
      theme={"light"}
      onClick={onClick}
      defaultOpenKeys={[defaultMenu]}
      mode="inline"
      items={items}
      selectedKeys={[nowSecKey]}
    />
  );
};

const AntMenu = styled(Menu)`
  width: 20rem;
  height: 100%;
  background: rgb(250, 250, 252);
`;
