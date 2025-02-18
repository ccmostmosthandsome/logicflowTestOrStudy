/*
 * @Author: wackccdream 569435455@qq.com
 * @Date: 2025-02-13 17:30:11
 * @LastEditors: wackccdream 569435455@qq.com
 * @LastEditTime: 2025-02-14 14:53:35
 * @FilePath: \----------------------项目区c:\Users\56943\Downloads\项目\体系设计\logicflow-node-red-vue3-master\logicflow-node-red-vue3-master\src\components\sqlNode.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HtmlNode, HtmlNodeModel } from "@logicflow/core";

class SqlNode extends HtmlNode {
  setHtml(rootEl) {
    rootEl.innerHTML = "";
    const {
      properties: { fields, tableName },
    } = this.props.model;
    rootEl.setAttribute("class", "table-container");
    const container = document.createElement("div");
    container.className = `table-node table-color-${Math.ceil(
      Math.random() * 4
    )}`;
    const tableNameElement = document.createElement("div");
    tableNameElement.innerText = tableName;
    tableNameElement.className = "table-name";
    container.appendChild(tableNameElement);
  
    const tableAddElement = document.createElement("span");
    tableAddElement.className = "table-add";
    tableAddElement.innerText = "+";
    container.appendChild(tableAddElement);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < fields.length; i++) {
      const item = fields[i];
      const itemElement = document.createElement("div");
      itemElement.className = "table-feild";
      const itemKey = document.createElement("input");
      itemKey.className = "table-input";
      itemKey.readOnly = "true";
      itemKey.value = item.key;
      itemKey.type = "text";
      const itemType = document.createElement("span");
      itemType.innerText = item.type;
      itemType.className = "feild-type";
      const itemEdit = document.createElement("span");
      itemEdit.innerText = "B";
      itemEdit.setAttribute("data-flag", "edit");

      itemEdit.addEventListener("click", function (event) {
        let firstElementChild = event.target.parentNode.firstElementChild,
          flag = event.target.dataset.flag;
        if (flag == "edit") {
          firstElementChild.removeAttribute("readOnly");
          event.target.setAttribute("data-flag", "certain");
          event.target.innerText = "C";
        } else if (flag == "certain") {
          event.target.setAttribute("data-flag", "edit");
          firstElementChild.setAttribute("readOnly", "true");
          event.target.innerText = "B";
        }
      });
      // 点击加号
      tableAddElement.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e, "----")
      })
      itemElement.appendChild(itemKey);
      itemElement.appendChild(itemType);
      itemElement.appendChild(itemEdit);

      fragment.appendChild(itemElement);
    }
    container.appendChild(fragment);
    rootEl.appendChild(container);
  }
}

class SqlNodeModel extends HtmlNodeModel {
  /**
   * 给model自定义添加字段方法
   */
  addField(item) {
    this.properties.fields.push(item);
    this.setAttributes();
    // 为了保持节点顶部位置不变，在节点变化后，对节点进行一个位移,位移距离为添加高度的一半。
    this.move(0, 24 / 2);
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "none";
    style.hover.stroke = "none";
    return style;
  }
  setAttributes() {
    this.width = 200;
    const {
      properties: { fields },
    } = this;
    this.height = 60 + fields.length * 24;
    const circleOnlyAsTarget = {
      message: "只允许从右边的锚点连出",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return sourceAnchor.type === "right";
      },
    };
    this.sourceRules.push(circleOnlyAsTarget);
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      properties: { fields },
    } = this;
    const anchors = [];
    fields.forEach((feild, index) => {
      anchors.push({
        x: x - width / 2 + 10,
        y: y - height / 2 + 60 + index * 24,
        id: `${id}_1`,
        type: "left",
      });
      anchors.push({
        x: x + width / 2 - 10,
        y: y - height / 2 + 60 + index * 24,
        id: `${id}_1`,
        type: "right",
      });
    });
    return anchors;
  }
}

export default {
  type: "sql-node",
  model: SqlNodeModel,
  view: SqlNode,
};
