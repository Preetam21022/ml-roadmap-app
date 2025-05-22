import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

const emailLoginBtn = document.getElementById("emailLoginBtn");
const signupBtn = document.getElementById("signupBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const resetBtn = document.getElementById("resetProgressBtn");
const authSection = document.getElementById("auth-section");
const roadContainer = document.getElementById("road-container");
const roadmap = document.getElementById("roadmap");
const car = document.getElementById("car");

emailLoginBtn.onclick = () => {
  console.log("Email login clicked");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log("Email login successful", userCredential.user);
    })
    .catch(error => {
      alert("Login failed: " + error.message);
      console.error("Login error:", error);
    });
};

signupBtn.onclick = () => {
  console.log("Signup clicked");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password to sign up.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log("Signup successful", userCredential.user);
      alert("Account created successfully. You are now logged in.");
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
      console.error("Signup error:", error);
    });
};


googleLoginBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .catch(error => {
      alert("Google login failed: " + error.message);
      console.error("Google login error:", error);
    });
};

logoutBtn.onclick = () => {
  signOut(auth);
};

resetBtn.onclick = () => {
  if (confirm("Are you sure you want to reset all progress?")) {
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem(`step_${i}`);
    }
    location.reload();
  }
};

const steps = [
  {
    title: "Step 1: Learn Python",
    tasks: [
      { text: "Watch Python playlist", link: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" },
      { text: "Read W3Schools Python Tutorial", link: "https://www.w3schools.com/python/" },
      { text: "Try Jupyter Notebooks", link: "https://jupyter.org/" }
    ]
  },
  {
    title: "Step 2: Learn Python Libraries",
    tasks: [
      { text: "Pandas Documentation", link: "https://pandas.pydata.org/docs/user_guide/index.html" },
      { text: "Numpy Guide", link: "https://numpy.org/doc/stable/user/quickstart.html" },
      { text: "Matplotlib Tutorial", link: "https://matplotlib.org/stable/tutorials/index.html" }
    ]
  },
  {
    title: "Step 3: Math for ML",
    tasks: [
      { text: "Khan Academy Statistics", link: "https://www.khanacademy.org/math/statistics-probability" },
      { text: "Linear Algebra - 3Blue1Brown", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { text: "Calculus - Khan Academy", link: "https://www.khanacademy.org/math/differential-calculus" }
    ]
  },
  {
    title: "Step 4: ML Algorithms",
    tasks: [
      { text: "Statistical Learning Course", link: "https://www.statlearning.com/" },
      { text: "Scikit-learn Tutorial", link: "https://scikit-learn.org/stable/tutorial/index.html" },
      { text: "Kaggle Projects", link: "https://www.kaggle.com/" }
    ]
  }
];

function moveCarToStep(index) {
  const roadmapWidth = roadmap.offsetWidth;
  const stepWidth = roadmap.children[0].offsetWidth;
  const spacing = (roadmapWidth - stepWidth * steps.length) / (steps.length - 1);
  const carPosition = index * (stepWidth + spacing);
  car.style.left = `${carPosition}px`;
  car.style.transform = "scaleX(1)";
}

function renderRoadmap() {
  roadmap.innerHTML = "";

  let lastUnlockedStep = 0;
  let lastCompletedStep = -1;

  steps.forEach((step, index) => {
    const stepEl = document.createElement("div");
    stepEl.className = "step";

    const header = document.createElement("h2");
    header.innerText = step.title;
    stepEl.appendChild(header);

    const taskStates = JSON.parse(localStorage.getItem(`step_${index}`)) || Array(step.tasks.length).fill(false);
    const isStepCompleted = taskStates.length > 0 && taskStates.every(Boolean);
    if (isStepCompleted && index > lastCompletedStep) {
      lastCompletedStep = index;
    }

    step.tasks.forEach((task, taskIndex) => {
      const taskEl = document.createElement("div");
      taskEl.className = "task";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = taskStates[taskIndex];

      checkbox.addEventListener("change", () => {
        taskStates[taskIndex] = checkbox.checked;
        localStorage.setItem(`step_${index}`, JSON.stringify(taskStates));
        renderRoadmap();
      });

      const link = document.createElement("a");
      link.href = task.link;
      link.target = "_blank";
      link.textContent = task.text;

      taskEl.appendChild(checkbox);
      taskEl.appendChild(link);
      stepEl.appendChild(taskEl);
    });

    const isUnlocked = index === 0 || steps.slice(0, index).every((_, i) => {
      const prev = JSON.parse(localStorage.getItem(`step_${i}`)) || [];
      return prev.every(Boolean);
    });

    if (!isUnlocked) stepEl.classList.add("locked");
    else lastUnlockedStep = index;

    roadmap.appendChild(stepEl);
  });

  const carTargetStep = lastCompletedStep === -1 ? 0 : lastCompletedStep;
  moveCarToStep(carTargetStep);

  document.getElementById("progress-indicator").innerText = `Step ${lastUnlockedStep + 1} of ${steps.length}`;
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User logged in:", user.email);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        createdAt: serverTimestamp()
      }, { merge: true });

      authSection.style.display = "none";
      roadContainer.style.display = "block";
      logoutBtn.style.display = "inline-block";
      resetBtn.style.display = "inline-block";

      renderRoadmap();
    } else {
      console.log("No user logged in.");
      authSection.style.display = "block";
      roadContainer.style.display = "none";
      logoutBtn.style.display = "none";
      resetBtn.style.display = "none";
    }
  });
});
