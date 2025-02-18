<template>
  <el-card header="Graph">
    <div class="flex-wrapper">
      <!-- <el-button key="arrow1" type="primary" @click="() => setLine('bezier')"
        >连接线-贝塞尔曲线</el-button
      > -->
      <el-button key="arrow1" type="primary" @click="testCustomEdge"
        >连接线-贝塞尔曲线</el-button
      >
      <el-button key="arrow2" type="primary" @click="() => setLine('polyline')"
        >连接线-多段线</el-button
      >
      <el-button key="arrow2" type="primary" @click="() => setLine('line')"
        >连接线-直线</el-button
      >
      <el-button key="focusOn" type="primary" @click="focusOn">
        定位到node-1
      </el-button>
      <el-button key="undo" type="primary" @click="() => lfRef.undo()"
        >上一步</el-button
      >
      <el-button key="redo" type="primary" @click="() => lfRef.redo()"
        >下一步</el-button
      >
      <el-button key="clearData" type="primary" @click="() => lfRef.clearData()"
        >清空数据</el-button
      >
      <el-button key="changeType" type="primary" @click="changeNodeType"
        >切换节点为圆形</el-button
      >
      <el-button key="cancelEdit" type="primary" @click="cancelEdit"
        >禁止编辑</el-button
      >
      <el-button key="cancelEdit" type="primary" @click="canEdit"
        >允许编辑</el-button
      >
      <el-button key="getData" type="primary" @click="() => getGraphData()"
        >获取选中节点数据</el-button
      >
      <el-switch v-model="seletAllFlag" @change="switchChange" /> 开启多选功能
      <el-switch v-model="miniMapFlag" @change="switchMiniMapChange" />
      开启多选功能
      <el-button
        key="setZoom"
        type="primary"
        @click="() => lfRef.zoom(0.6, [400, 400])"
        >设置大小</el-button
      >
      <el-button key="selectElement" type="primary" @click="() => checkNode()"
        >选中指定节点</el-button
      >
      <el-button
        key=" translateCenter"
        type="primary"
        @click="() => lfRef.translateCenter()"
        >居中</el-button
      >
      <el-button key="fitView" type="primary" @click="() => lfRef.fitView()"
        >适应屏幕</el-button
      >
      <el-button key="deleteNode" type="primary" @click="() => delNode()"
        >删除节点</el-button
      >
      <el-button key="addLineText" type="primary" @click="addLineText()"
        >给线添加文字</el-button
      >
      <el-button key="addNode" type="primary" @click="addNode()"
        >添加数据在节点中</el-button
      >
      <el-button key="downloadXml" type="primary" @click="downloadXml()"
        >下载xml</el-button
      >
      <input type="file" className="upload" @Change="(ev) => uploadXml(ev)" />
    </div>
    <el-divider content-position="left">节点面板</el-divider>
    <div class="flex-wrapper">
      <div className="dnd-item wrapper" @mousedown="handleDragRect">矩形</div>
      <div className="dnd-item wrapper" @mousedown="handleDragCircle">圆形</div>
      <div className="dnd-item wrapper" @mousedown="handleDragDiamond">
        菱形
      </div>
      <div className="dnd-item wrapper" @mousedown="handleDragEllipse">
        椭圆
      </div>
      <div className="dnd-item wrapper" @mousedown="handleDragPolygon">
        多边形
      </div>
      <div className="dnd-item wrapper" @mousedown="handleDragText">文本</div>
    </div>
    <el-divider />
    <div ref="containerRef" id="graph" class="viewport"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LogicFlow from "@logicflow/core";
import {
  Control,
  Menu,
  SelectionSelect,
  MiniMap,
  DndPanel,
  lfJson2Xml,
  lfXml2Json,
  CurvedEdge,
} from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import "@logicflow/extension/lib/style/index.css";
import "./style1.css";
import sqlNode from "./sqlNode";
import CustomEdge from "./CustomEdge";
// import X2JS from "x2js";
// const config = {
//   // 是否忽略根元素
//   skipRoot: false,

//   // 属性前缀
//   attributePrefix: "_",

//   // 数组标签
//   arrayAccessForm: "none",

//   // 是否启用XML命名空间
//   enableNamespaces: false,

//   // 是否忽略注释
//   ignoreComment: true,

//   // 日期格式化
//   datetimeAccessFormPaths: ["root.date"],
// };

// // 创建实例
// const x2js = new X2JS(config);
// window.x2js = x2js;

const data = {
  nodes: [
    {
      id: "custom-node-1",
      text: "node-1",
      type: "polygon",
      x: 90,
      y: 94,
    },
    {
      id: "node_id_1",
      type: "sql-node",
      x: 100,
      y: 100,
      properties: {
        tableName: "Users",
        textEdit: false,

        fields: [
          {
            key: "id",
            type: "string",
          },
          {
            key: "name",
            type: "string",
          },
          {
            key: "age",
            type: "integer",
          },
          {
            key: "hh",
            type: "string",
          },
        ],
      },
    },
  ],
};
const seletAllFlag = ref(false);
const miniMapFlag = ref(false);
const lfRef = ref(null);
const containerRef = ref(null);
const flowId = ref("");
const deleteArr = ["custom-node-1", "node_id_1"];
onMounted(() => {
  if (containerRef.value) {
    const lf = new LogicFlow({
      container: containerRef.value,
      height: 400,
      multipleSelectKey: "ctrl",
      disabledTools: ["multipleSelect"],
      autoExpand: true,
      adjustEdgeStartAndEnd: true,
      allowRotate: true,
      edgeTextEdit: true,
      guards: {
        beforeDelete(data) {
          // 禁止删除起始节点
          return deleteArr.includes(data.id);
        },
      },
      keyboard: {
        enabled: true,
      },
      partial: true,
      background: {
        color: "#FFFFFF",
      },
      grid: true,
      plugins: [Control, Menu, SelectionSelect, MiniMap, DndPanel],
      edgeTextDraggable: true,
      edgeType: "bezier",
      style: {
        inputText: {
          background: "black",
          color: "white",
        },
      },
      idGenerator(type) {
        return type + "_" + Math.random();
      },
    });

    lf.on("graph:rendered", ({ graphModel }) => {
      flowId.value = graphModel?.flowId || "";
    });

    lf.on("edge:add", ({ data }) => {
      lf.graphModel.updateText(data.id, "文字");
    });

    // lf.on("anchor:drop", ({ data, e, nodeModel }) => {
    //     console.log(data, e, nodeModel, "anchor:dragend");
    // })

    lf.register(sqlNode);
    lf.register(CustomEdge);

    // 渲染数据
    lf.render(data);

    lfRef.value = lf;

    window.lf = lf;
  }
});

// 下载xml
const downloadXml = () => {
  const lf = lfRef?.value;
  if (lf) {
    const data = lf.getGraphData();
    const xml = lfJson2Xml(data);
    // const xml1 = x2js.js2xml(data);
    console.log(xml);
    // console.log(xml1);
    download("logic-flow.xml", xml);
    // download("logic-flow1.xml", xml1);
  }
};

const download = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// 上传xml
const uploadXml = (ev) => {
  const lf = lfRef?.value;
  if (lf) {
    const file = ev.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const xml = event.target.result;
        let root = `<?xml version="1.0" encoding="UTF-8" ?> <root>${xml}</root>`;
        let json = lfXml2Json(root);
        // const json = x2js.xml2js(root);
        json = convertStringsToNumbers(json);
        console.log(json);
        lf.render(json.root);
      }
    };
    reader.readAsText(file);
  }
};

// 将对象下字符串转为数字类型
const convertStringsToNumbers = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === "string" && !isNaN(obj[key])) {
      obj[key] = Number(obj[key]);
    } else if (typeof obj[key] === "object") {
      convertStringsToNumbers(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item) => {
        if (typeof item === "string" && !isNaN(item)) {
          return Number(item);
        }
        return item;
      });
    }
  }
  return obj;
};

// 添加线上文字
const addLineText = () => {
  const lf = lfRef?.value;
  if (lf) {
    // let data = lf.getGraphData();
    // console.log(data);
    // let properties = data.edges[0].properties;
    // properties.text = "文字";
    // lf.updateEdge(data.edges[0].id, properties);
    // edges.forEach(({ id, properties }) => {
    //     properties.text = "文字";
    //     lf.updateEdge(id, properties);
    // });
  }
};

// 切换多选方法
const switchChange = (val) => {
  const lf = lfRef?.value;
  if (lf) val ? lf.openSelectionSelect() : lf.closeSelectionSelect();
};

// 切换导航方法
const switchMiniMapChange = (val) => {
  const lf = lfRef?.value;
  if (lf) val ? MiniMap.show() : MiniMap.hide();
};

// 设置箭头
const setLine = (arrowName) => {
  const lf = lfRef?.value;
  if (lf) {
    lf.setDefaultEdgeType(arrowName);
  }
};

const testCustomEdge = () => {
  const lf = lfRef?.value;
  if (lf) lf.setDefaultEdgeType("custom-edge");
};

// 定位到指定节点
const focusOn = () => {
  lfRef?.value?.focusOn({
    id: "custom-node-1",
  });
};
// 切换节点类型
const changeNodeType = () => {
  const lf = lfRef?.value;
  if (lf) {
    const { nodes } = lf.getSelectElements();
    nodes.forEach(({ id, type }) => {
      lf.changeNodeType(id, type === "rect" ? "circle" : "rect");
    });
  }
};

// 取消编辑
const cancelEdit = () => {
  const lf = lfRef?.value;
  if (lf) {
    const { editConfigModel } = lf.graphModel;
    console.log(editConfigModel);
    editConfigModel.updateEditConfig({
      isSilentMode: true, // 是否为静默模式
      stopZoomGraph: true, // 禁止缩放画布
      stopScrollGraph: true, // 禁止鼠标滚动移动画布
      stopMoveGraph: true, // 禁止拖动画布
    });
  }
};

const canEdit = () => {
  const lf = lfRef?.value;
  if (lf) {
    const { editConfigModel } = lf.graphModel;
    console.log(editConfigModel);

    editConfigModel.updateEditConfig({
      isSilentMode: false,
      stopZoomGraph: false,
      stopScrollGraph: false,
      stopMoveGraph: false,
    });
  }
};

// 获取选中节点数据
const getGraphData = () => {
  const lf = lfRef?.value;
  if (lf) {
    const { nodes } = lf.getSelectElements();
    console.log(nodes);
  }
};

// 选中指定节点
const checkNode = () => {
  const lf = lfRef?.value;
  if (lf) {
    lf.selectElementById("custom-node-1");
  }
};

// 删除节点
const delNode = () => {
  const lf = lfRef?.value;
  if (lf) {
    console.log(lf);
    const { nodes } = lf.getSelectElements();
    console.log(nodes);
    nodes.forEach(({ id }) => {
      lf.deleteNode(id);
    });
  }
};

// 添加节点
const addNode = () => {
  const lf = lfRef?.value;
  if (lf) {
    const { nodes } = lf.getSelectElements();
    let data = lf.getGraphData();
    let item = data.nodes.find((item) => item.id === nodes[0].id);
    item.properties.fields.push({
      key: "address",
      type: "string",
    });
    lf.render(data);
  }
};

const handleDragRect = () => {
  lfRef?.value?.dnd.startDrag({
    type: "rect",
    text: "矩形",
  });
};
const handleDragCircle = () => {
  lfRef?.value?.dnd.startDrag({
    type: "circle",
    text: "圆形",
    r: 25,
  });
};

const handleDragDiamond = () => {
  lfRef?.value?.dnd.startDrag({
    type: "diamond",
    text: "菱形",
  });
};

const handleDragEllipse = () => {
  lfRef?.value?.dnd.startDrag({
    type: "ellipse",
    text: "椭圆",
    properties: {
      rx: 40,
      ry: 80,
    },
  });
};

const handleDragPolygon = () => {
  let x = 50,
    y = 50;
  lfRef?.value?.dnd.startDrag({
    type: "polygon",
    text: "多边形",
    properties: {
      points: [
        [x - 0.205 * 100, y - 0.5 * 100],
        [x + 0.205 * 100, y - 0.5 * 100],
        [x + 0.5 * 100, y - 0.205 * 100],
        [x + 0.5 * 100, y + 0.205 * 100],
        [x + 0.205 * 100, y + 0.5 * 100],
        [x - 0.205 * 100, y + 0.5 * 100],
        [x - 0.5 * 100, y + 0.205 * 100],
        [x - 0.5 * 100, y - 0.205 * 100],
      ],
    },
  });
};

// const handleDragText = () => {
//   lfRef?.value?.dnd.startDrag({
//     type: "text",
//     text: "文本",
//   });
// };

const handleDragText = () => {
  lfRef?.value?.dnd.startDrag({
    id: "node_id_2",
    type: "sql-node",
    x: 100,
    y: 100,

    text: {
      editable: false,
    },
    properties: {
      tableName: "Users",

      fields: [
        {
          key: "id",
          type: "string",
        },
        {
          key: "name",
          type: "string",
        },
        {
          key: "age",
          type: "integer",
        },
        {
          key: "hh",
          type: "string",
        },
      ],
    },
  });
};

const handleDragStar = () => {
  lfRef?.value?.dnd.startDrag({
    type: "star",
    text: "五角星",
  });
};
</script>
<style scoped>
.flex-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

*:focus {
  outline: none;
}

.rect {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;
}

.circle {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 50%;
}

.dnd-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
}

.wrapper {
  width: 80px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;
}
</style>
