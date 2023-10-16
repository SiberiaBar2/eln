import React from "react";
import { Routes, Route } from "react-router-dom";
import { Numerator, Drag, Gantt, BeautyifyDnd, GanttOne } from "pages";

export const Content = () => {
  return (
    <div>
      <Routes>
        <Route path="drag" element={<Drag />} />
        <Route path="numerator" element={<Numerator />} />
        <Route path="gantt" element={<Gantt />} />
        <Route path="GanttOne" element={<GanttOne />} />
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment  */}
        {/* @ts-ignore */}
        <Route path="beautyifyDnd" element={<BeautyifyDnd />} />
        {/* <Route path="/" element={<Navigate to={"drag"} replace />} /> */}
      </Routes>
    </div>
  );
};
