window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      // 创建div
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      // 查找div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  // api 可以操作elements
  const api = Object.create(jQuery.prototype); // 创建一个对象，这个对象的__proto__为括号里的东西
  // const api = {__proto__: jQuery.prototype}
  Object.assign(api, {
    elements: elements,
    odlApi: selectorOrArrayOrTemplate.odlApi,
  });
  // api.elements = elements
  // api.oldApi = selectorOrArrayOrTemplate.oldApi
  return api;
};
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,

  each(fn) {
    // 遍历
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each((e1) => node.appendChild(e1));
    } else if (node.jquery === true) {
      this.each((e1) => node.get(0).appendChild(e1));
    }
  },
  append(children) {
    if (children instanceof Element) {
      this.get(0).appendChild(children);
    } else if (children instanceof HTMLAllCollection) {
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i]);
      }
    } else if (children.jquery === true) {
      children.each((node) => this.get(0).appendChild(node));
    }
  },
  find(selector) {
    let array = [];
    this.each((node) => {
      array = array.concat(Array.from(node.querySelectorAll(selector)));
    });

    array.odlApi = this; // 这里的this 是 旧的 Api
    return jQuery(array); // 封装操作这个数组的对象 Api2
  },

  end() {
    return this.odlApi; // 这里的this 是 新的 Api
  },

  addClass(className) {
    this.each((selector) => {
      selector.classList.add(className);
    });
    return this; // this 就是 Api
  },

  print() {
    console.log(this.elements);
  },

  parent() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },

  children() {
    const array = [];
    this.each((node) => {
      array.push(...node.children);
    });
    return jQuery(array);
  },
};
