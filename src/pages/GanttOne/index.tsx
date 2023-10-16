import React, { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SVGGantt, CanvasGantt, StrGantt } from "gantt";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getData, formatXML, formatData, autoSchedule } from "./utils";

const $ = (s: any) => document.querySelector(s);
const { tasks, links } = getData();

function renderStr() {
  if ($("#str")) {
    $("#str").textContent = formatXML(strGantt.render());
  }
}
const data = [
  {
    id: 1,
    type: "group",
    text: "1 Waterfall model",
    start: new Date("2018-10-10T09:24:24.319Z"),
    end: new Date("2018-12-12T09:32:51.245Z"),
    percent: 0.71,
    links: [],
  },
  {
    id: 11,
    parent: 1,
    text: "1.1 Requirements",
    start: new Date("2018-10-21T09:24:24.319Z"),
    end: new Date("2018-11-22T01:01:08.938Z"),
    percent: 0.29,
    links: [
      {
        target: 12,
        type: "FS",
      },
    ],
  },
  {
    id: 12,
    parent: 1,
    text: "1.2 Design",
    start: new Date("2018-11-05T09:24:24.319Z"),
    end: new Date("2018-12-12T09:32:51.245Z"),
    percent: 0.78,
  },
];

// new SVGGantt("#svg-root", data, {
//   viewMode: "week",
// });

// new CanvasGantt("#canvas-root", data, {
//   viewMode: "week",
// });

const strGantt = new StrGantt(data, {
  viewMode: "week",
});

export const GanttOne = () => {
  const svgGanttRef = useRef<HTMLDivElement>(null);
  const canvasGanttRef = useRef<HTMLCanvasElement>(null);

  const svgRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const $ = (s: any) => document.querySelector(s);

  const [link, setLink] = useState("on");
  useEffect(() => {
    if (svgGanttRef.current) {
      svgRef.current = new SVGGantt(svgGanttRef.current, data, {
        viewMode: "week",
      });
    }
    if (canvasGanttRef.current) {
      canvasRef.current = new CanvasGantt(canvasGanttRef.current, data, {
        viewMode: "week",
      });
    }
  }, [svgGanttRef.current, canvasGanttRef.current]);

  function changeOptions(options: any) {
    svgRef?.current?.setOptions(options);
    canvasRef?.current?.setOptions(options);
    // strGantt.setOptions(options);
    // renderStr();
  }

  //   const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     const viewMode = e.target.value;
  //     changeOptions({ viewMode });
  //   };
  //   const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const showLinks = e.target.value;
  //     console.log("showLinks", showLinks, e);
  //     // setLink()
  //     changeOptions({ showLinks });
  //   };

  console.log('$("#viewMode")', $("#viewMode"));

  function changeData() {
    const list = formatData(tasks, links);
    svgRef.current.setData(list);
    canvasRef.current.setData(list);
    strGantt.setData(list);
    renderStr();
  }

  useEffect(() => {
    console.log('$("#viewMode") 变化', $("#viewMode"));
    if ($("#viewMode")) {
      $("#viewMode").onchange = (e: any) => {
        console.log("aaaaaaaaa", e.target.value);
        const viewMode = e.target.value;
        changeOptions({ viewMode });
      };
    }

    if ($("#showLinks")) {
      console.log('$("#showLinks") ===>', $("#showLinks"));
      $("#showLinks").onchange = (e: any) => {
        console.log(
          '$("#showLinks").checked',
          $("#showLinks").checked,
          "eeee",
          e,
        );

        const showLinks = $("#showLinks").checked;
        console.log("showLinks", showLinks);

        changeOptions({ showLinks });
      };
    }
    if ($("#showDelay")) {
      $("#showDelay").onchange = () => {
        const showDelay = $("#showDelay").checked;
        changeOptions({ showDelay });
      };
    }
    if ($("#autoSchedule")) {
      $("#autoSchedule").onclick = () => {
        autoSchedule(tasks, links);
        changeData();
      };
    }
  }, [$("#viewMode"), $("#showLinks"), $("#showDelay"), $("#autoSchedule")]);
  //   $("#showLinks").onchange = () => {
  //     const showLinks = $("#showLinks").checked;
  //     changeOptions({ showLinks });
  //   };
  //   $("#showDelay").onchange = () => {
  //     const showDelay = $("#showDelay").checked;
  //     changeOptions({ showDelay });
  //   };
  //   $("#autoSchedule").onclick = () => {
  //     utils.autoSchedule(tasks, links);
  //     changeData();
  //   };
  return (
    <div>
      <div id="ctrls">
        <select
          id="viewMode"
          style={{
            margin: "20px 0",
            height: "30px",
            width: "180px",
          }}
          //   onChange={onChange}
        >
          <option value="day">Day</option>
          <option value="week" selected>
            Week
          </option>
          <option value="month">Month</option>
        </select>
        <input
          type="checkbox"
          id="showLinks"
          //   value={link}
          // checked
          //   onChange={onCheck}
        />
        <label htmlFor="showLinks">Show Links</label>
        <input type="checkbox" id="showDelay" />
        <label htmlFor="showDelay">Show Delay</label>
        <button type="button" id="autoSchedule">
          Auto Schedule
        </button>
      </div>
      <div ref={svgGanttRef}></div>
      <canvas ref={canvasGanttRef}></canvas>
      {/* <pre>{strGantt.render()}</pre> */}
    </div>
  );
};
