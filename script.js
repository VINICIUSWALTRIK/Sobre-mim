const output = document.getElementById("terminal-output");
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const photo = document.getElementById("profile-photo");
const photoFallback = document.getElementById("photo-fallback");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const typedText = document.getElementById("typed-text");
const followerCore = document.querySelector(".follower-core");
const followerRing = document.querySelector(".follower-ring");
const followerSpark = document.querySelector(".follower-spark");
let fxLevel = "on";

const commands = {
  help: () => [
    "Comandos: about, experience, education, skills, certs, contact, projects",
    "Extras: clear, matrix, fx on, fx off, fx intense",
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

    if (value.startsWith("fx")) {
      const [, mode = ""] = value.split(/\s+/);
      const normalized = mode.trim();
      if (!["on", "off", "intense"].includes(normalized)) {
        printLine("Use: fx on | fx off | fx intense", "error");
        input.value = "";
        return;
      }
      setFxMode(normalized);
      printLine(`Efeitos visuais: ${normalized}`);
      input.value = "";
      return;
    }

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

function setFxMode(mode) {
  fxLevel = mode;
  document.body.classList.remove("fx-off", "fx-intense");
  if (mode === "off") document.body.classList.add("fx-off");
  if (mode === "intense") document.body.classList.add("fx-intense");
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

  const clearFx = () => {
    menu.style.setProperty("--fx-opacity", "0");
  };

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const menuRect = menu.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      menu.style.setProperty("--fx-left", `${rect.left - menuRect.left}px`);
      menu.style.setProperty("--fx-top", `${rect.top - menuRect.top}px`);
      menu.style.setProperty("--fx-width", `${rect.width}px`);
      menu.style.setProperty("--fx-height", `${rect.height}px`);
      menu.style.setProperty("--fx-opacity", "1");
    });
  });

  menu.addEventListener("mouseleave", clearFx);
}

function smoothScrollTo(targetY, duration = 1250) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initSlowAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const headerOffset = 90;
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      smoothScrollTo(Math.max(0, targetY), 1250);
    });
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

function initMouseFollowers() {
  if (!followerCore || !followerRing || !followerSpark) return;

  const target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  const core = { x: target.x, y: target.y };
  const ring = { x: target.x, y: target.y };
  const spark = { x: target.x, y: target.y };

  const lerp = (start, end, amount) => start + (end - start) * amount;

  window.addEventListener("pointermove", (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
  });

  function frame() {
    const ringLerp = fxLevel === "intense" ? 0.16 : 0.12;
    const sparkLerp = fxLevel === "intense" ? 0.28 : 0.2;
    core.x = lerp(core.x, target.x, 0.38);
    core.y = lerp(core.y, target.y, 0.38);
    ring.x = lerp(ring.x, target.x, ringLerp);
    ring.y = lerp(ring.y, target.y, ringLerp);
    spark.x = lerp(spark.x, target.x, sparkLerp);
    spark.y = lerp(spark.y, target.y, sparkLerp);

    followerCore.style.transform = `translate3d(${core.x - 4}px, ${core.y - 4}px, 0)`;
    followerRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
    followerSpark.style.transform = `translate3d(${spark.x}px, ${spark.y}px, 0)`;

    requestAnimationFrame(frame);
  }

  frame();
}

function initFollowerHideOnTopics() {
  const hideSelector = "nav a, .section-head h2, .section-head p, .btn, .menu-btn";
  const minimalSelector =
    ".timeline-card, .skill-card, .profile-card, .mini-card, .hero-main";

  document.addEventListener("pointermove", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const shouldHide = !!target.closest(hideSelector);
    const shouldBeMinimal = !!target.closest(minimalSelector);

    document.body.classList.toggle("mouse-hidden", shouldHide);
    document.body.classList.toggle("mouse-minimal", !shouldHide && shouldBeMinimal);
  });
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

function initFlowBackground() {
  const canvas = document.getElementById("flow-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  let nodes = [];
  let width = 0;
  let height = 0;

  function buildNodes() {
    const area = width * height;
    const count = Math.max(70, Math.min(160, Math.floor(area / 17000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.15,
      vy: (Math.random() - 0.5) * 1.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.02,
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i += 1) {
      const p = nodes[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      p.phase += p.speed;
      p.vx += Math.cos(p.phase) * 0.02;
      p.vy += Math.sin(p.phase * 1.15) * 0.02;

      if (dist < 300 && dist > 0.001) {
        const pull = (1 - dist / 300) * 0.032;
        p.vx += (dx / dist) * pull;
        p.vy += (dy / dist) * pull;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.994;
      p.vy *= 0.994;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 155) {
          const alpha = 1 - d / 155;
          ctx.strokeStyle = `rgba(120, 195, 255, ${alpha * 0.44})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(172, 221, 255, 0.45)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  window.addEventListener("resize", resize);

  resize();
  step();
}

initTerminal();
initReveal();
initTilt();
initPhoto();
initMenu();
initSlowAnchorScroll();
initTypewriter();
initMouseFollowers();
initFollowerHideOnTopics();
initFlowBackground();
initThree();
setFxMode("on");
