// 初期データ読み込み
let point = Number(localStorage.getItem("point")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let lastDate = localStorage.getItem("lastDate") || null;
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || {};
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: "study",
    title: "行政書士の勉強3時間",
    point: 50
  },
  {
    id: "workout",
    title: "筋トレ（腹筋・背筋・腕立て30回）",
    point: 20
  }
];

const today = new Date().toDateString();

// 初回描画
render();

// 描画処理
function render() {
  document.getElementById("point").textContent = point;
  document.getElementById("streak").textContent = streak;
  document.getElementById("level").textContent = Math.floor(point / 100) + 1;

  renderTasks();
  updateProgress();
  updateTree();
}

// タスク表示
function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const button = document.createElement("button");
    button.textContent = "✔";
    button.onclick = () => completeTask(task.id, task.point);

    // 今日完了済みなら無効化
    if (completedTasks[today] && completedTasks[today].includes(task.id)) {
      button.disabled = true;
      button.textContent = "済";
    }

    const text = document.createElement("span");
    text.textContent = `${task.title} (+${task.point}pt)`;

    li.appendChild(button);
    li.appendChild(text);
    taskList.appendChild(li);
  });
}

// タスク完了処理
function completeTask(taskId, taskPoint) {
  if (completedTasks[today] && completedTasks[today].includes(taskId)) {
    alert("このタスクは今日はもう完了済みです！");
    return;
  }

  point += taskPoint;

  // 継続日数処理
  if (lastDate === null) {
    streak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      streak += 1;
    } else if (lastDate !== today) {
      streak = 1;
    }
  }

  lastDate = today;

  if (!completedTasks[today]) {
    completedTasks[today] = [];
  }

  completedTasks[today].push(taskId);

  saveData();
  render();
}

// タスク追加
function addTask() {
  const titleInput = document.getElementById("task-title");
  const pointInput = document.getElementById("task-point");

  const title = titleInput.value.trim();
  const taskPoint = Number(pointInput.value);

  if (title === "") {
    alert("タスク名を入力してね");
    return;
  }

  if (!taskPoint || taskPoint <= 0) {
    alert("ポイントは1以上で入力してね");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title: title,
    point: taskPoint
  };

  tasks.push(newTask);

  titleInput.value = "";
  pointInput.value = "";

  saveData();
  render();
}

// 達成率更新
function updateProgress() {
  const todayCompleted = completedTasks[today] || [];

  if (tasks.length === 0) {
    document.getElementById("progress").textContent = 0;
    return;
  }

  const progress = Math.floor((todayCompleted.length / tasks.length) * 100);
  document.getElementById("progress").textContent = progress;
}

// 🌱 木の成長
function updateTree() {
  const level = Math.floor(point / 100) + 1;
  const tree = document.getElementById("tree");

  if (level < 3) {
    tree.textContent = "🌱";
  } else if (level < 5) {
    tree.textContent = "🌿";
  } else if (level < 8) {
    tree.textContent = "🌳";
  } else {
    tree.textContent = "🌸";
  }
}

// データ保存
function saveData() {
  localStorage.setItem("point", point);
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDate", lastDate);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// リセット
function resetData() {
  if (confirm("本当にリセットする？")) {
    localStorage.clear();
    location.reload();
  }
}