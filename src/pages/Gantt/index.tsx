import React, {
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";

import "gantt-schedule-timeline-calendar/dist/style.css";
import "./index.css";

let gstc: any, state: any;

// helper functions

function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {} as any;
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    rows[id] = {
      id,
      label: `Row ${i}`,
    };
  }
  return rows;
}

function generateItems() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {} as any;
  let start = GSTC.api.date().startOf("day").subtract(6, "day");
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * 100).toString());
    start = start.add(1, "day");
    items[id] = {
      id,
      label: `Item ${i}`,
      rowId,
      time: {
        start: start.valueOf(),
        end: start.add(1, "day").endOf("day").valueOf(),
      },
    };
  }
  return items;
}

function initializeGSTC(element: any) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      // eslint-disable-next-line max-len
      "====BEGIN LICENSE KEY====\nEr2kZ0UbKjPJt7llt/U6N5v9lgqgV1Eao6tdUqXYmOyz9HUxNICNJNpWuCuM9MY/MLvZngMMGDbtWF2JQDbsCNsxVzR97HsmVs8oAUhf7cE/NoCgFowA5BtoKVwfvraZptBnx6OxCcy07sQcmbrjroEW6WuP/V2LtB61zu+3ZzO//5ITfu/kaveR/1fwamPv6+Nef4Pz07S+sxYOGlIfu+kwPKlbxLv5VBDDXBnoRA4ZsWv9Q4D9rndxqlP0xl4Zc09JkQW67NtsJbdFG7kzNVjRamlGXh8AtmUHVK8Kmu9gBX/lykPsbNRF4zH4KghPOz+g+abI+SUwTmV0MwhlJA==||U2FsdGVkX1+Vi0iAfWC01IwLWuu79UmTwVaUEmjya6Va2zQ+HjTYgPGAwaFDCwwzq8x7Q+VDUKkQvEAOSww/LbfSN/IYrqwLp1FSlSpXX0c=\nl4zU925R2jXoISr/lDQt7c4w5GOmCFQDq2HANs9UHROi8PiMZ/vOd0MbU/Ppf71qUFTi1TgIQb9MU/yYCeUcPc/jdtJuP3Rm34wT+WW4+As3DtkkV1zROXBwZ3qRk2voH0xWRoFNzavFTZ1MLLwAiazTB58W0z2vaPBJQ6rVnBxtjOqXQphfVjQ1Nkr4i9yUiIK5n6CFjYfnRK9oWxl8QsMNJsmjCeJEo6Swh/97rgZQ/5HSAPSAeZngIXyKRX5MTcrxQqTzVlbxpvlIQehgU54p5ZFW5h9C/ECJ7YcbQ6YOcPt1gIAt+RLVhM6pmFuNMG6Zg2LDIkloecl/6YIeDA==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
    list: {
      columns: {
        data: {
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 60,
            data: ({ row }: any) => GSTC.api.sourceID(row.id),
            header: {
              content: "ID",
            },
          },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            width: 200,
            data: "label",
            header: {
              content: "Label",
            },
          },
        },
      },
      rows: generateRows(),
    },
    chart: {
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  console.log("elementinit", element);
  gstc = GSTC({
    element,
    state,
  });
}

export function Gantt() {
  const callback = useCallback((element: any) => {
    console.log("试剂", element);

    console.log(element ? "是" : "不是");
    setTimeout(() => {
      if (element) initializeGSTC(element);
    }, 100);
  }, []);

  // const viewRef = useRef<HTMLDivElement>(null);
  // console.log("viewRef.current", viewRef.current);

  // useLayoutEffect(() => {
  //   console.log("viewRef.curren useMemot", viewRef.current);

  //   if (viewRef.current) initializeGSTC(viewRef.current);
  // }, [viewRef.current]);
  // const [value, setValue] = useState("");

  useEffect(() => {
    // setValue("11");
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  }, []);

  function updateFirstRow() {
    state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row: any) => {
      row.label = "Changed dynamically";
      return row;
    });
  }

  function changeZoomLevel() {
    state.update("config.chart.time.zoom", 21);
  }

  const renderView = () => {
    try {
      return (
        <div
          className="gstc-wrapper"
          // ref={viewRef}
          // style={{
          //   height: "100%",
          // }}
          ref={callback}
        ></div>
      );
    } catch (error) {}
  };

  return (
    <div>
      <div className="toolbox">
        <button onClick={updateFirstRow}>Update first row</button>
        <button onClick={changeZoomLevel}>Change zoom level</button>
        {/* <button
          onClick={() => {
            setValue("2222");
          }}
        >
          增加
        </button> */}
      </div>
      {/* {value} */}
      {renderView()}
    </div>
  );
}
