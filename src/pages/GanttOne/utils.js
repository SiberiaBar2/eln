export const DAY = 24 * 3600 * 1000;

export function addDays(date, days) {
  const d = new Date(date.valueOf());
  d.setDate(d.getDate() + days);
  return d;
}

export function getDates(begin, end) {
  const dates = [];
  let s = new Date(begin);
  s.setHours(24, 0, 0, 0);
  while (s.getTime() <= end) {
    dates.push(s.getTime());
    s = addDays(s, 1);
  }
  return dates;
}

let ctx = null;
export function textWidth(text, font, pad) {
  ctx = ctx || document.createElement("canvas").getContext("2d");
  ctx.font = font;
  return ctx.measureText(text).width + pad;
}

export function formatMonth(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return `${y}/${m > 9 ? m : `0${m}`}`;
}

export function formatDay(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
}

export function minDate(a, b) {
  if (a && b) {
    return a > b ? b : a;
  }
  return a || b;
}

export function maxDate(a, b) {
  if (a && b) {
    return a < b ? b : a;
  }
  return a || b;
}

export function max(list, defaultValue) {
  if (list.length) {
    return Math.max.apply(null, list);
  }
  return defaultValue;
}

export function p2s(arr) {
  return arr.map((p) => `${p[0]},${p[1]}`).join(" ");
}

export function s2p(str) {
  return str.split(" ").map((s) => {
    const p = s.split(",");
    return [parseFloat(p[0]), parseFloat(p[1])];
  });
}

function walkLevel(nodes, level) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.level = `${level}${i + 1}`;
    node.text = `${node.level} ${node.name}`;
    walkLevel(node.children, `${node.level}.`);
  }
}

function walkDates(nodes) {
  let start = null;
  let end = null;
  let percent = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.children.length) {
      const tmp = walkDates(node.children);
      node.start = tmp.start;
      node.end = tmp.end;
      node.percent = tmp.percent;
      if (tmp.start && tmp.end) {
        node.duration = (tmp.end - tmp.start) / DAY;
      } else {
        node.duration = 0;
      }
    } else {
      node.percent = node.percent || 0;
      if (node.start) {
        node.end = addDays(node.start, node.duration || 0);
      }
      if (node.type === "milestone") {
        node.end = node.start;
      }
    }
    start = minDate(start, node.start);
    end = maxDate(end, node.end);
    percent += node.percent;
  }
  if (nodes.length) {
    percent /= nodes.length;
  }
  return { start, end, percent };
}

export function formatData(tasks, links, walk) {
  const map = {};
  const tmp = tasks.map((t, i) => {
    map[t.id] = i;
    return { ...t, children: [], links: [] };
  });
  const roots = [];
  tmp.forEach((t) => {
    const parent = tmp[map[t.parent]];
    if (parent) {
      parent.children.push(t);
    } else {
      roots.push(t);
    }
  });
  links.forEach((l) => {
    const s = tmp[map[l.source]];
    const t = tmp[map[l.target]];
    if (s && t) {
      s.links.push(l);
    }
  });

  walkLevel(roots, "");
  walkDates(roots);

  if (walk) {
    walk(roots);
  }

  const list = [];
  roots.forEach((r) => {
    const stack = [];
    stack.push(r);
    while (stack.length) {
      const node = stack.pop();
      const len = node.children.length;
      if (len) {
        node.type = "group";
      }
      list.push(node);
      for (let i = len - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  });
  return list;
}

export function hasPath(vmap, a, b) {
  const stack = [];
  stack.push(vmap[a]);
  while (stack.length) {
    const v = stack.pop();
    if (v.id === b) {
      return true;
    }
    for (let i = 0; i < v.links.length; i++) {
      stack.push(v.links[i]);
    }
  }
  return false;
}

export function toposort(links) {
  const vmap = {};
  links.forEach((l) => {
    const init = (id) => ({ id, out: [], in: 0 });
    vmap[l.source] = init(l.source);
    vmap[l.target] = init(l.target);
  });
  for (let i = 0; i < links.length; i++) {
    const l = links[i];
    vmap[l.target].in++;
    vmap[l.source].out.push(i);
  }
  const s = Object.keys(vmap)
    .map((k) => vmap[k].id)
    .filter((id) => !vmap[id].in);
  const sorted = [];
  while (s.length) {
    const id = s.pop();
    sorted.push(id);
    for (let i = 0; i < vmap[id].out.length; i++) {
      const index = vmap[id].out[i];
      const v = vmap[links[index].target];
      v.in--;
      if (!v.in) {
        s.push(v.id);
      }
    }
  }
  return sorted;
}

export function autoSchedule(tasks, links, lockMilestone = false) {
  const vmap = {};
  links.forEach((l) => {
    vmap[l.source] = { id: l.source, links: [] };
    vmap[l.target] = { id: l.target, links: [] };
  });
  const dag = [];
  links.forEach((l) => {
    const { source, target } = l;
    if (!hasPath(vmap, target, source)) {
      dag.push(l);
      vmap[source].links.push(vmap[target]);
    }
  });
  const sorted = toposort(dag);
  const tmap = {};
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.type === "milestone") {
      task.duration = 0;
    }
    tmap[task.id] = i;
  }
  const ins = {};
  sorted.forEach((id) => {
    ins[id] = [];
  });
  dag.forEach((l) => {
    ins[l.target].push(l);
  });
  sorted.forEach((id) => {
    const task = tasks[tmap[id]];
    if (!task) return;
    const days = task.duration || 0;
    if (lockMilestone && task.type === "milestone") {
      return;
    }
    let start = null;
    let end = null;
    for (let i = 0; i < ins[id].length; i++) {
      const l = ins[id][i];
      const v = tasks[tmap[l.source]];
      if (v && v.start) {
        const s = addDays(v.start, l.lag || 0);
        const e = addDays(s, v.duration || 0);
        if (l.type === "SS") {
          start = maxDate(start, s);
        }
        if (l.type === "FS") {
          start = maxDate(start, e);
        }
        if (l.type === "SF") {
          end = maxDate(end, s);
        }
        if (l.type === "FF") {
          end = maxDate(end, e);
        }
      }
    }
    if (end) {
      task.start = addDays(end, -days);
    }
    if (start) {
      task.start = start;
    }
  });
}

function rand(begin) {
  let date;
  let days;
  if (begin) {
    days = Math.random() * 60 + 5;
    date = new Date(begin);
  } else {
    days = Math.random() * 60 - 60;
    date = new Date();
  }
  date.setDate(date.getDate() + days);
  return date;
}

export function getData() {
  const tasks = [
    {
      id: 1,
      name: "Waterfall model",
    },
    {
      id: 11,
      parent: 1,
      name: "Requirements",
    },
    {
      id: 12,
      parent: 1,
      name: "Design",
    },
    {
      id: 13,
      parent: 1,
      name: "Implement",
      type: "milestone",
    },
    {
      id: 14,
      parent: 1,
      name: "Verification",
    },
    {
      id: 2,
      name: "Development",
    },
    {
      id: 21,
      parent: 2,
      name: "Preliminary",
    },
    {
      id: 22,
      parent: 2,
      name: "Systems design",
    },
    {
      id: 23,
      parent: 2,
      name: "Development",
    },
    {
      id: 24,
      parent: 2,
      name: "Integration",
    },
  ];
  tasks.forEach((v) => {
    v.start = rand();
    v.duration = Math.random() * 90;
    v.percent = Math.random();
  });
  const links = [
    {
      source: 11,
      target: 12,
      type: "FS",
      lag: 3,
    },
    {
      source: 12,
      target: 13,
      type: "FS",
      lag: 5,
    },
    {
      source: 13,
      target: 14,
      type: "FS",
    },
    {
      source: 13,
      target: 21,
      type: "FS",
    },
    {
      source: 23,
      target: 24,
      type: "SF",
    },
  ];
  return { tasks, links };
}

export function formatXML(xml) {
  var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
  var wsexp = / *(.*) +\n/g;
  var contexp = /(<.+>)(.+\n)/g;
  xml = xml
    .replace(reg, "$1\n$2$3")
    .replace(wsexp, "$1\n")
    .replace(contexp, "$1\n$2");
  var pad = 0;
  var formatted = "";
  var lines = xml.split("\n");
  var indent = 0;
  var lastType = "other";
  // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
  var transitions = {
    "single->single": 0,
    "single->closing": -1,
    "single->opening": 0,
    "single->other": 0,
    "closing->single": 0,
    "closing->closing": -1,
    "closing->opening": 0,
    "closing->other": 0,
    "opening->single": 1,
    "opening->closing": 0,
    "opening->opening": 1,
    "opening->other": 1,
    "other->single": 0,
    "other->closing": -1,
    "other->opening": 0,
    "other->other": 0,
  };

  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];

    // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
    if (ln.match(/\s*<\?xml/)) {
      formatted += ln + "\n";
      continue;
    }

    var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
    var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
    var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
    var type = single
      ? "single"
      : closing
      ? "closing"
      : opening
      ? "opening"
      : "other";
    var fromTo = lastType + "->" + type;
    lastType = type;
    var padding = "";

    indent += transitions[fromTo];
    for (var j = 0; j < indent; j++) {
      padding += "  ";
    }
    if (fromTo == "opening->closing")
      formatted = formatted.substr(0, formatted.length - 1) + ln + "\n";
    // substr removes line break (\n) from prev loop
    else formatted += padding + ln + "\n";
  }

  return formatted;
}
