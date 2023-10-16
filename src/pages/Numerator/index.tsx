import React from "react";
import { Input } from "antd";
import MoleculeStructure from "./MoleculeStructure";
import { SMILES_LIST } from "./smiles";
// import MoleculeStructure from "@rdkit/rdkit";

type State = { smiles: string[]; isHave: boolean };

export class Numerator extends React.Component<any, State> {
  state = {
    smiles: SMILES_LIST,
    isHave: true,
  };
  render(): any {
    return (
      <div id="component-example-list" className="container">
        <section className="hero">
          <div className="hero-body">
            {/* <p className="title">Overview</p> */}
            <p className="subtitle">
              {/* You can draw any molecule from SMILES dynamically with RDKit.js . */}
            </p>
          </div>
        </section>
        <Input
          placeholder="请输入smiles字符串"
          onChange={(e) => {
            this.setState({
              smiles: e.target.value ? [e.target.value] : SMILES_LIST,
              isHave: e.target.value
                ? SMILES_LIST.includes(e.target.value)
                : true,
            });
          }}
        ></Input>
        <div
          id="structure-list"
          className="columns is-desktop"
          style={{
            margin: "12px",
            overflowX: "scroll",
            display: "flex",
            width: "80rem",
          }}
        >
          {this.state.smiles.length > 0 && this.state.isHave
            ? this.state.smiles.map((smiles) => (
                <div className="column" key={smiles}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <MoleculeStructure
                    id={smiles}
                    structure={smiles}
                    height={200}
                    width={200}
                    svgMode
                  />
                </div>
              ))
            : "暂无匹配项 或 输入的是不存在分子字符串"}
        </div>
        <pre>
          NC1=NC=NC2=C1N=CN2[C@@H]1O[C@H](COP(O)(=O)OP(O)(=O)OP(O)(O)=O)[C@@H](O)[C@H]1O
        </pre>
      </div>
    );
  }
}
