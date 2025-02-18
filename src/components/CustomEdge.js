/*
 * @Author: wackccdream 569435455@qq.com
 * @Date: 2025-02-15 16:29:14
 * @LastEditors: wackccdream 569435455@qq.com
 * @LastEditTime: 2025-02-18 11:11:10
 * @FilePath: \----------------------项目区e:\ITEM\TXSJ\src\CustomEdge.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BezierEdge, BezierEdgeModel } from "@logicflow/core";

class CustomEdge extends BezierEdge {}

class CustomEdgeModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    console.log(style);

    // svg属性
    style.strokeWidth = 1;
    style.stroke = "#ababac";
    return style;
  }
  /**
   * 重写此方法，使保存数据是能带上锚点数据。
   */
  getData() {
    const data = super.getData();
    console.log(data);
    console.log(this);
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    data.sourceNodeId = this.sourceNodeId;
    data.targetNodeId = this.targetNodeId;
    data.properties = this.properties;
    data.startPoint = this.startPoint;
    data.endPoint = this.endPoint;
    data.pointsList = this.pointsList;
    // data.text = this.text;
    // data.text.value = this.text.value;
    return data;
  }

  // 动态获取锚点位置（核心逻辑）
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { properties } = this;

    console.log(properties);
    // const { graphModel } = this;

    // 实时获取锚点位置
    // const sourceNode = graphModel.getNode(this.sourceNodeId);
    // const targetNode = graphModel.getNode(this.targetNodeId);
    // if (sourceNode && targetNode) {
    //   this.startPoint = sourceNode.getAnchorPosition(this.sourceAnchorId);
    //   this.endPoint = targetNode.getAnchorPosition(this.targetAnchorId);
    // }

    return style;
  }

  /**
   * 给边自定义方案，使其支持基于锚点的位置更新边的路径
   */
  updatePathByAnchor() {
    // TODO
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId);
    const sourceAnchor = sourceNodeModel
      .getDefaultAnchor()
      .find((anchor) => anchor.id === this.sourceAnchorId);
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId);
    const targetAnchor = targetNodeModel
      .getDefaultAnchor()
      .find((anchor) => anchor.id === this.targetAnchorId);
    const startPoint = {
      x: sourceAnchor.x,
      y: sourceAnchor.y,
    };
    this.updateStartPoint(startPoint);
    const endPoint = {
      x: targetAnchor.x,
      y: targetAnchor.y,
    };
    this.updateEndPoint(endPoint);
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = [];
    this.initPoints();
  }

  setAttributes() {
    this.isAnimation = true;
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.strokeDasharray = "5 10";
    // style.animationDuration = "15s";
    return style;
  }
}

export default {
  type: "custom-edge",
  view: CustomEdge,
  model: CustomEdgeModel,
};
