import styled from "@emotion/styled";
import type { FC } from "react";
import { memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Colors } from "./Colors";
import { SourceBox } from "./SourecBox";
import { StatefulTargetBox as TargetBox } from "./TargetBox";

export const Drag: FC = memo(function Container() {
  return (
    <div style={{ overflow: "hidden", clear: "both", margin: "-.5rem" }}>
      <DndProvider backend={HTML5Backend}>
        <Wrap style={{ float: "left" }}>
          <SourceBox color={Colors.BLUE} />
        </Wrap>

        <div style={{ float: "left", marginLeft: "5rem", marginTop: ".5rem" }}>
          <TargetBox />
        </div>
      </DndProvider>
    </div>
  );
});

const Wrap = styled.div`
  width: 20rem;
  height: 25rem;
  border: 1px solid;
`;
