const roadmap = document.getElementById("roadmap");

const steps = [
  {
    title: "Step 1: Learn Python",
    tasks: [
      { text: "Watch Python playlist", link: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" },
      { text: "Read W3Schools Python Tutorial", link: "https://www.w3schools.com/python/" },
      { text: "Try Jupyter Notebooks", link: "https://jupyter.org/" },
    ]
  },
  {
    title: "Step 2: Learn Python Libraries",
    tasks: [
      { text: "Pandas Documentation", link: "https://pandas.pydata.org/docs/user_guide/index.html" },
      { text: "Numpy Guide", link: "https://numpy.org/doc/stable/user/quickstart.html" },
      { text: "Matplotlib Tutorial", link: "https://matplotlib.org/stable/tutorials/index.html" },
    ]
  },
  {
    title: "Step 3: Math for ML",
    tasks: [
      { text: "Khan Academy Statistics", link: "https://www.khanacademy.org/math/statistics-probability" },
      { text: "Linear Algebra - 3Blue1Brown", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { text: "Calculus - Khan Academy", link: "https://www.khanacademy.org/math/differential-calculus" },
    ]
  },
  {
    title: "Step 4: ML Algorithms",
    tasks: [
      { text: "Statistical Learning Course", link: "https://www.statlearning.com/" },
      { text: "Scikit-learn Tutorial", link: "https://scikit-learn.org/stable/tutorial/index.html" },
      { text: "Kaggle Projects", link: "https://www.kaggle.com/" },
    ]
  },
];

steps.forEach((step, index) => {
  const stepEl = document.createElement("div");
  stepEl.className = "step";

  const header = document.createElement("h2");
  header.innerText = step.title;
  stepEl.appendChild(header);

  const taskStates = JSON.parse(localStorage.getItem(`step_${index}`)) || Array(step.tasks.length).fill(false);

  step.tasks.forEach((task, taskIndex) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskStates[taskIndex];

    checkbox.addEventListener("change", () => {
      taskStates[taskIndex] = checkbox.checked;
      localStorage.setItem(`step_${index}`, JSON.stringify(taskStates));
      location.reload(); // refresh to check if step unlocks
    });

    const link = document.createElement("a");
    link.href = task.link;
    link.target = "_blank";
    link.textContent = task.text;

    taskEl.appendChild(checkbox);
    taskEl.appendChild(link);
    stepEl.appendChild(taskEl);
  });

  // Lock step if previous is incomplete
  const isUnlocked = index === 0 || steps.slice(0, index).every((_, i) => {
    const prev = JSON.parse(localStorage.getItem(`step_${i}`)) || [];
    return prev.every(Boolean);
  });

  if (!isUnlocked) stepEl.classList.add("locked");

  roadmap.appendChild(stepEl);
});
