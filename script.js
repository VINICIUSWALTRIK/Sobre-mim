const output = document.getElementById("terminal-output");
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const photo = document.getElementById("profile-photo");
const photoFallback = document.getElementById("photo-fallback");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const typedText = document.getElementById("typed-text");

const commands = {
  help: () => [
    "Comandos: about, experience, education, skills, certs, contact, projects",
    "Extras: clear, matrix",
  ],
  about: () => [
    "Vinicius Waltrik",
    "Analista de Projetos Jr. | Scrum | Gestão Ágil de TI",
    "Foco em execução, organização e entrega de valor.",
  ],
  experience: () => [
    "Casa do Construtor - Analista de Projetos Jr. (Out/2025 - Presente)",
    "Casa do Construtor - Analista de Suporte Jr. (Fev/2025 - Out/2025)",
    "Víncula - Metrologista (Dez/2022 - Fev/2025)",
  ],
  education: () => [
    "MBA em Gestão de Projetos de TI e Metodologias Ágeis - PUC-RS",
    "Tecnólogo em ADS - Claretiano",
    "Técnico em Qualidade - Colégio EduQ",
  ],
  skills: () => ["Scrum, Scrumban, Kanban, ClickUp, Trello, Backlog, Stakeholders"],
  certs: () => ["AI for Devs", "Acelerando Projetos", "JS do Zero", "Escopo de Projetos"],
  projects: () => ["PM Flow", "Support Insights", "Quality Metrics"],
  contact: () => ["Email: waltrikvinicius@gmail.com", "Telefone: (19) 99985-6156", "Rio Claro, SP"],
  clear: () => {
    output.innerHTML = "";
    return [];
  },
  matrix: () => {
    ["11010100101", "00101101001", "11100010100"].forEach((v) => printLine(v, "fx"));
    return ["sequence ok"];
  },
};

function printLine(text, type = "line") {
  const line = document.createElement("div");
  line.className = `line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function initTerminal() {
  printLine("Terminal iniciado.");
  printLine("Digite: help");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim().toLowerCase();
    if (!value) return;
    printLine(`> ${value}`, "command");
    const cmd = commands[value];
    if (!cmd) {
      printLine("Comando não encontrado.", "error");
      input.value = "";
      return;
    }
    cmd().forEach((line) => printLine(line));
    input.value = "";
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initTilt() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -7}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

function initPhoto() {
  if (!photo || !photoFallback) return;
  const showFallback = () => {
    photo.style.display = "none";
    photoFallback.style.display = "grid";
  };
  const showImage = () => {
    photo.style.display = "block";
    photoFallback.style.display = "none";
  };
  if (photo.complete && photo.naturalWidth > 0) showImage();
  else showFallback();
  photo.addEventListener("load", showImage);
  photo.addEventListener("error", showFallback);
}

function initMenu() {
  if (!menu || !menuBtn) return;
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

function initTypewriter() {
  if (!typedText) return;
  const lines = [
    "Transformo demanda em entrega clara e priorizada.",
    "Conecto negócio e tecnologia com ritos Scrum objetivos.",
    "Organizo backlog com foco em valor e melhoria contínua.",
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = lines[lineIndex];
    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typedText.textContent = current.slice(0, charIndex);

    let delay = deleting ? 28 : 52;
    if (!deleting && charIndex === current.length) {
      delay = 1300;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      delay = 320;
    }

    window.setTimeout(tick, delay);
  }

  tick();
}

function initThree() {
  if (!window.THREE) return;
  const canvas = document.getElementById("space-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.z = 7;

  scene.add(new THREE.AmbientLight(0x5f7cb8, 0.8));
  const keyLight = new THREE.PointLight(0x9dd3ff, 2.2, 45);
  keyLight.position.set(2, 2, 4);
  scene.add(keyLight);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.3, 1),
    new THREE.MeshStandardMaterial({ color: 0x4e8dff, transparent: true, opacity: 0.8, metalness: 0.3, roughness: 0.25 })
  );
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshBasicMaterial({ color: 0xa8d6ff, wireframe: true, transparent: true, opacity: 0.35 })
  );
  scene.add(shell);
  scene.add(wire);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);
  const addFallback = () => {
    modelGroup.add(
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.75, 0.2, 120, 20),
        new THREE.MeshStandardMaterial({ color: 0x6cb3ff, metalness: 0.35, roughness: 0.2 })
      )
    );
  };
  if (THREE.GLTFLoader) {
    new THREE.GLTFLoader().load(
      "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        model.position.set(0, -1.15, 0.2);
        modelGroup.add(model);
      },
      undefined,
      addFallback
    );
  } else addFallback();

  const pointer = { x: 0, y: 0 };
  const velocity = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    target.x = (event.clientX / window.innerWidth - 0.5) * 1.8;
    target.y = (event.clientY / window.innerHeight - 0.5) * -1.8;
  });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  function animate() {
    velocity.x = velocity.x * 0.9 + (target.x - pointer.x) * 0.03;
    velocity.y = velocity.y * 0.9 + (target.y - pointer.y) * 0.03;
    pointer.x += velocity.x;
    pointer.y += velocity.y;

    shell.rotation.x += 0.004 + pointer.y * 0.004;
    shell.rotation.y += 0.005 + pointer.x * 0.004;
    wire.rotation.y += 0.004;
    wire.position.x = pointer.x * 0.3;
    wire.position.y = pointer.y * 0.3;
    modelGroup.rotation.y += 0.007;
    modelGroup.position.x = pointer.x * 0.25;
    modelGroup.position.y = -0.2 + pointer.y * 0.22;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", resize);
  resize();
  animate();
}

initTerminal();
initReveal();
initTilt();
initPhoto();
initMenu();
initTypewriter();
initThree();
