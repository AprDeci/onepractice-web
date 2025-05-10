import { useUtilStore } from "../store/utilStore";
import nlp from "compromise/one";
const utilStore = useUtilStore();
// 分割答案工具类,每四个(ABCD)为一组
export const splitAnswer = (answers: string[]) => {
  return Array.from({ length: Math.ceil(answers.length / 4) }, (_, i) =>
    answers.slice(i * 4, i * 4 + 4)
  );
};

// 查词
// 使用NLP分词文本
export const wrapWordsWithSpan = (inputString: string) => {
  const spanClass = utilStore.dictionaryMode ? "word wordactive" : "word";
  return nlp(inputString)
    .json()
    .flatMap((sentence) =>
      sentence.terms.map((word) => {
        // 检查是否是数字或特定模式（如 _12_）
        const isNumber = /^[\d_]+$/.test(word.text);

        if (isNumber) {
          // 如果是数字或特定模式，不包裹span
          return `${word.pre}${word.text}${word.post}`;
        } else {
          // 否则正常包裹span
          return `${word.pre}<span class="${spanClass}" word="true">${word.text}</span>${word.post}`;
        }
      })
    )
    .join("");
};
// 标记
export const mark = (selected) => {
  const selection = selected.selection.value;
  if (!selection || !selection.rangeCount) return;

  const originalRange = selection.getRangeAt(0);

  // 1. 找出选区跨越的所有div元素
  const divs = findDivsInSelection(originalRange);

  // 2. 如果没有跨越多个div，按原方式处理
  if (divs.length <= 1) {
    processSingleRange(originalRange);
  }
  // 3. 如果跨越多个div，为每个div创建单独的范围
  else {
    processMultipleDivs(originalRange, divs);
  }

  selection.removeAllRanges();
};

// 找出选区内的所有div
function findDivsInSelection(range) {
  const divs = new Set();
  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ELEMENT, {
    acceptNode: function (node) {
      if (node.tagName === "DIV" && range.intersectsNode(node)) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });

  let divNode;
  while ((divNode = walker.nextNode())) {
    divs.add(divNode);
  }

  return Array.from(divs);
}

// 处理单个范围
function processSingleRange(range) {
  const { startContainer, endContainer } = range;

  // 检查起始节点是否是span内的部分文本
  if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.tagName === "SPAN") {
    range.setStart(startContainer, 0);
  }

  // 检查结束节点是否是span内的部分文本
  if (endContainer.nodeType === Node.TEXT_NODE && endContainer.parentNode.tagName === "SPAN") {
    range.setEnd(endContainer, endContainer.length);
  }

  wrapWithMakElement(range);
}

// 处理跨越多个div的情况
function processMultipleDivs(originalRange, divs) {
  divs.forEach((div) => {
    const divRange = document.createRange();

    // 确定当前div内的选区起始点
    const startResult = findBoundaryInDiv(originalRange, div, true);
    const endResult = findBoundaryInDiv(originalRange, div, false);

    divRange.setStart(startResult.node, startResult.offset);
    divRange.setEnd(endResult.node, endResult.offset);

    wrapWithMakElement(divRange);
  });
}

// 找出div内的边界点
function findBoundaryInDiv(originalRange, div, isStart) {
  if (isStart) {
    // 如果原始起点在当前div内
    if (div.contains(originalRange.startContainer)) {
      return {
        node: originalRange.startContainer,
        offset: originalRange.startOffset
      };
    }
    // 否则从div的第一个子节点开始
    return {
      node: findFirstTextNode(div),
      offset: 0
    };
  } else {
    // 如果原始终点在当前div内
    if (div.contains(originalRange.endContainer)) {
      return {
        node: originalRange.endContainer,
        offset: originalRange.endOffset
      };
    }
    // 否则到div的最后一个子节点结束
    const lastTextNode = findLastTextNode(div);
    return {
      node: lastTextNode,
      offset: lastTextNode.length || 0
    };
  }
}

// 查找div内的第一个文本节点
function findFirstTextNode(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  return walker.nextNode() || node;
}

// 查找div内的最后一个文本节点
function findLastTextNode(node) {
  let lastTextNode = node;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

  while (walker.nextNode()) {
    lastTextNode = walker.currentNode;
  }
  return lastTextNode;
}

// 用mak元素包裹选区
function wrapWithMakElement(range) {
  const documentFragment = range.extractContents();
  const span = document.createElement("mak");
  span.className = "highlight";

  span.style.background = `linear-gradient(to right, rgba(${utilStore.markcolor}, 0.1), rgba(${utilStore.markcolor}, 0.9) 3%, rgba(${utilStore.markcolor}, 0.9) 35%, rgba(${utilStore.markcolor}, 0.9) 70%, rgba(${utilStore.markcolor}, 0.8) 95%, rgba(${utilStore.markcolor}, 0.3))`;

  span.appendChild(documentFragment);
  range.insertNode(span);
}
