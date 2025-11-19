import gsap from "gsap";

import { Howl } from "howler";

import * as THREE from "three";
import { OrbitControls } from "./utils/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import smokeVertexShader from "./shaders/smoke/vertex.glsl";
import smokeFragmentShader from "./shaders/smoke/fragment.glsl";
import themeVertexShader from "./shaders/theme/vertex.glsl";
import themeFragmentShader from "./shaders/theme/fragment.glsl";


let flowerObjects1 = [];
let flowerObjects2 = [];
let flowerObjects3 = [];
let flowerObjects4 = [];
let leftBirdWing;
let rightBirdWing;
let leftBirdWing2;
let rightBirdWing2;
let birdBody2;
let leftBirdWing3;
let rightBirdWing3;
let birdBody3;
let birdBody;
let leafObjects = [];
const navButtons = document.querySelectorAll(".nav-button");
let coffeePosition;
/**  -------------------------- Audio setup -------------------------- */

// Background Music
let isMusicFaded = false;
const MUSIC_FADE_TIME = 500;
const BACKGROUND_MUSIC_VOLUME = 0.8;
const FADED_VOLUME = 0;

// Generate a random number between 1 and 6
const randomIndex = 1;

// Build the path to the randomly selected audio file
const randomAudioSrc = `/audio/music/audio${randomIndex}.mp3`;

// Create a new Howl instance with the randomly selected audio file
const backgroundMusic = new Howl({
  src: [randomAudioSrc],
  loop: true,
  volume: BACKGROUND_MUSIC_VOLUME,
  html5: true
});

// Button
const buttonSounds = {
  click: new Howl({
    src: ["/audio/sfx/click/bubble.mp3"],
    preload: true,
    volume: 0.5,
    html5: true
  }),
};

/** -------------------------- Scene setup -------------------------- */
const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color("#D9CAD1");
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 0;  // Jarak zoom minimum. Biarkan 5 atau atur ke 1 jika ingin lebih dekat.
controls.maxDistance = Infinity; // Ganti 65 dengan Infinity agar zoom out tidak terbatas.
controls.minPolarAngle = 0;   // Biarkan 0 untuk melihat dari atas.
controls.maxPolarAngle = Infinity; // Ganti Math.PI / 2 menjadi Math.PI (180 derajat) untuk melihat hingga ke bawah objek.
controls.minAzimuthAngle = -Infinity; // Hapus batasan horizontal kiri
controls.maxAzimuthAngle = Infinity;  // Hapus batasan batasan horizontal kanan (Ini memberi putaran 360 derajat penuh)

controls.enableDamping = true;
controls.dampingFactor = 0.05;

const MOBILE_RESOLUTION = 768;

const HOME_POSITION = new THREE.Vector3(-8.897775230466557, 7.661037396040191, 44.3284156350184);
const HOME_TARGET = new THREE.Vector3(-5.609463049876454, -4.840251888259694, 3.2020049420625756);

camera.position.copy(HOME_POSITION);
controls.target.copy(HOME_TARGET);
controls.update();

// --- Posisi Story (Point E, F, G, H) ---
// Story Point E (Start/Restart)
const S_E_POS = new THREE.Vector3(-8.525656049894154, 29.98472634516598, -28.30948852275964);
const S_E_TARGET = new THREE.Vector3(-14.55965486069327, 32.043256163451034, -48.34318720155553);

// Story Point F
const S_F_POS = new THREE.Vector3(-0.7316092379410435, 30.66503009104131, -26.982871287326073);
const S_F_TARGET = new THREE.Vector3(-7.751342090318966, 33.059848162127636, -50.28934137122706);

// Story Point G
const S_G_POS = new THREE.Vector3(-3.877814937935634, 21.151841366089997, -22.743071743771157);
const S_G_TARGET = new THREE.Vector3(-12.065285825677778, 23.945039291252648, -49.92659130510777);

// Story Point H (End)
const S_H_POS = new THREE.Vector3(2.1158958117217113, 24.000217622531167, -31.027866708629222);
const S_H_TARGET = new THREE.Vector3(-4.219413087549358, 26.161540931686577, -52.061955959349845);

// Variabel Kontrol
let isStoryPlaying = false;
let storyTimeline = null;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

/** -------------------------- Modal Stuff -------------------------- */
const modals = {
  location: document.querySelector(".modal.location"),
};
// ---

const overlay = document.querySelector(".overlay");

let touchHappened = false;
overlay.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    e.preventDefault();
    const modal = document.querySelector('.modal[style*="display: block"]');
    if (modal) hideModal(modal);
  },
  { passive: false }
);

overlay.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    e.preventDefault();
    const modal = document.querySelector('.modal[style*="display: block"]');
    if (modal) hideModal(modal);
  },
  { passive: false }
);

document.querySelectorAll(".modal-exit-button").forEach((button) => {
  function handleModalExit(e) {
    e.preventDefault();
    const modal = e.target.closest(".modal");

    gsap.to(button, {
      scale: 5,
      duration: 0.5,
      ease: "back.out(2)",
      onStart: () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.set(button, {
              clearProps: "all",
            });
          },
        });
      },
    });

    buttonSounds.click.play();
    hideModal(modal);
  }

  button.addEventListener(
    "touchend",
    (e) => {
      touchHappened = true;
      handleModalExit(e);
    },
    { passive: false }
  );

  button.addEventListener(
    "click",
    (e) => {
      if (touchHappened) return;
      handleModalExit(e);
    },
    { passive: false }
  );
});

navButtons.forEach(button => {
  const modalType = button.getAttribute('data-modal');
  
  // Helper untuk menutup modal yang terbuka
  const closeOpenModal = () => {
      const currentOpenModal = document.querySelector('.modal[style*="display: block"]');
      if(currentOpenModal) { hideModal(currentOpenModal); }
  };

  if (modalType === 'wedding') { 
      button.addEventListener('click', (e) => {
          e.preventDefault();
          closeOpenModal();
          startLoopingRotation();
      });
  } 
  
  else if (modalType === 'story') { 
      button.addEventListener('click', (e) => {
          e.preventDefault();
          closeOpenModal();
          playStoryAnimation();
      });
  } 
  
  else if (modalType === 'location') { 
      button.addEventListener('click', (e) => {
          e.preventDefault();
          closeOpenModal();
          showModal(modals.location);
      });
  }
  
  if (button.classList.contains('message')) {
       button.addEventListener('click', (e) => {
          e.preventDefault();
          closeOpenModal();
          
          controls.enabled = false;
          gsap.to(camera.position, {
              x: HOME_POSITION.x, y: HOME_POSITION.y, z: HOME_POSITION.z, 
              duration: 1.5, ease: "power2.inOut"
          });
          gsap.to(controls.target, {
              x: HOME_TARGET.x, y: HOME_TARGET.y, z: HOME_TARGET.z, 
              duration: 1.5, ease: "power2.inOut", 
              onUpdate: () => controls.update(),
              onComplete: () => { controls.enabled = true; }
          });
      });
  }
});

let isModalOpen = true;

const showModal = (modal) => {
  modal.style.display = "block";
  overlay.style.display = "block";

  isModalOpen = true;
  controls.enabled = false;

  if (currentHoveredObject) {
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersects = [];

  gsap.set(modal, {
    opacity: 0,
    scale: 0,
  });
  gsap.set(overlay, {
    opacity: 0,
  });

  gsap.to(overlay, {
    opacity: 1,
    duration: 0.5,
  });

  gsap.to(modal, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "back.out(2)",
  });
};

const hideModal = (modal) => {
  isModalOpen = false;
  controls.enabled = true;

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.5,
  });

  gsap.to(modal, {
    opacity: 0,
    scale: 0,
    duration: 0.5,
    ease: "back.in(2)",
    onComplete: () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    },
  });
};

/** -------------------------- Loading Screen & Intro Animation -------------------------- */

setTimeout(() => {
  document.querySelectorAll(".instructions").forEach((el) => {
    el.style.opacity = "1";
    el.style.animation = "fadeSlideUp 1s ease forwards";
  });
}, 800);

const manager = new THREE.LoadingManager();

const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".loading-screen-button");
const desktopInstructions = document.querySelector(".desktop-instructions");
const mobileInstructions = document.querySelector(".mobile-instructions");

manager.onLoad = function () {
  loadingScreenButton.style.border = "4px solid #e2d393";
  loadingScreenButton.style.background = "#fef4d3";
  loadingScreenButton.style.color = "#5c4a1a";
  loadingScreenButton.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
  loadingScreenButton.textContent = "Enter Room";
  loadingScreenButton.style.cursor = "pointer";
  loadingScreenButton.style.transition =
    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, color 0.3s";

  let isDisabled = false;
  let touchHappened = false;

  function handleEnter() {
    if (isDisabled) return;

    isDisabled = true;
    loadingScreenButton.style.cursor = "default";
    loadingScreenButton.style.border = "4px solid #c8b76a";
    loadingScreenButton.style.background = "#fdf6e3";
    loadingScreenButton.style.color = "#7a6b2f";
    loadingScreenButton.style.boxShadow = "none";
    loadingScreenButton.textContent = "~ Enjoy ~";

    loadingScreen.style.background = "#fdf6e3";
    document.querySelector(".instructions").style.color = "#8c7b45";

    toggleFavicons?.();
    backgroundMusic?.play();
    playReveal?.();
    playIntroAnimation();
  }

  loadingScreenButton.addEventListener("mouseenter", () => {
    if (!isDisabled) loadingScreenButton.style.transform = "scale(1.1)";
  });

  loadingScreenButton.addEventListener("mouseleave", () => {
    loadingScreenButton.style.transform = "scale(1)";
  });

  loadingScreenButton.addEventListener("touchend", (e) => {
    touchHappened = true;
    e.preventDefault();
    handleEnter();
  });

  loadingScreenButton.addEventListener("click", (e) => {
    if (touchHappened) return;
    handleEnter();
  });
};

function playReveal() {
  const tl = gsap.timeline();

  tl.to(loadingScreen, {
    scale: 0.5,
    duration: 1.2,
    delay: 0.25,
    ease: "back.in(1.8)",
  }).to(
    loadingScreen,
    {
      y: "200vh",
      transform: "perspective(1000px) rotateX(45deg) rotateY(-35deg)",
      duration: 1.2,
      ease: "back.in(1.8)",
      onComplete: () => {
        isModalOpen = false;
        // playIntroAnimation();
        loadingScreen.remove();
      },
    },
    "-=0.1"
  );
}

// === START: FUNGSI ANIMASI KAMERA BARU ===

let loopTimeline;
// Asumsi: let introTimeline; dideklarasikan secara global/accessible
// Asumsi: let controls; dideklarasikan secara global/accessible

function startLoopingRotation() {
    const P_C = new THREE.Vector3(-1.203887804350924, 6.355986850477607, 16.360666899635156);
    const P_D = new THREE.Vector3(4.933312240836284, 6.069414462610857, 14.738033468252114);
    const T_CD = new THREE.Vector3(-1.96467613412305, 0.5190966535008179, 2.0712027160863795);
    const Z_OFFSET = 5; // Jauhkan kamera sejauh 7 unit di sumbu Z
    const X_OFFSET = 2.5;  // Geser kamera ke KANAN sejauh 2 unit di sumbu X
    const Y_ADJUSTMENT = 3; // Turunkan Target (T_CD) sejauh 3 unit (membuat objek terlihat lebih rendah/di tengah)

    if (window.innerWidth < MOBILE_RESOLUTION) {
      // P_C (Kamera Awal Loop)
      P_C.x += X_OFFSET;
      P_C.z += Z_OFFSET;
      
      P_D.x += X_OFFSET;
      P_D.z += Z_OFFSET;
      
      // Terapkan Offset Z, X, DAN Y_ADJUSTMENT ke T_CD (Target Pandangan)
      T_CD.x += X_OFFSET;
      T_CD.z += Z_OFFSET;
      T_CD.y += Y_ADJUSTMENT;
    }

    // 1. CLEANUP: Hentikan animasi yang mungkin sedang berjalan
    if (introTimeline) {
      introTimeline.kill();
    }
    if (loopTimeline) {
        loopTimeline.kill();
    }
    // Tambahkan cleanup untuk Story Timeline
    if (storyTimeline) {
        storyTimeline.kill();
    }
    if (isStoryPlaying) {
        isStoryPlaying = false;
    }

    // Nonaktifkan kontrol Orbit saat transisi dimulai
    controls.enabled = false;

    playFlowerAnimation();
    
    // 2. TRANSISI HALUS KE POINT C (Posisi Mulai Loop)
    // Transisi ke P_C selama 1.5 detik.
    gsap.to(camera.position, {
        x: P_C.x, y: P_C.y, z: P_C.z, 
        duration: 1.5, ease: "power2.inOut" 
    });
    
    gsap.to(controls.target, {
        x: T_CD.x, y: T_CD.y, z: T_CD.z, 
        duration: 1.5, ease: "power2.inOut",
        onUpdate: () => controls.update(),
        
        // 3. MULAI LOOP setelah transisi ke P_C selesai
        onComplete: () => {
            // Aktifkan kembali kontrol
            controls.enabled = true;
            
            loopTimeline = gsap.timeline({
                repeat: -1,
                defaults: { 
                    duration: 6.0,
                    ease: "sine.inOut"
                }
            });
            
            // ROTATE (C -> D)
            loopTimeline.to(camera.position, {
                x: P_D.x, y: P_D.y, z: P_D.z,
            })
            .to(controls.target, {
                x: T_CD.x, y: T_CD.y, z: T_CD.z,
                onUpdate: () => controls.update(),
            }, "<"); 

            // ROTATE BACK (D -> C)
            loopTimeline.to(camera.position, {
                x: P_C.x, y: P_C.y, z: P_C.z,
            })
            .to(controls.target, {
                x: T_CD.x, y: T_CD.y, z: T_CD.z,
                onUpdate: () => controls.update(),
            }, "<");
        }
    });
}

let introTimeline; 

function playIntroAnimation() {
  const P_A = new THREE.Vector3(-8.897775230466557, 7.661037396040191, 44.3284156350184);
  const T_A = new THREE.Vector3(-5.609463049876454, -4.840251888259694, 3.2020049420625756);
  
  // Posisi B (HOME VIEW)
  const P_B = HOME_POSITION; 
  const T_B = HOME_TARGET; 
  
  // 1. SET POSISI AWAL (Point A)
  camera.position.copy(P_A);
  controls.target.copy(T_A);
  controls.update();

  // Nonaktifkan kontrol selama animasi intro
  controls.enabled = false;

  // Nonaktifkan kontrol selama animasi intro
  controls.enabled = false;

  introTimeline = gsap.timeline({ // <<< Pastikan disimpan ke variabel global
    defaults: { duration: 3.0, ease: "power2.inOut" }, 
    onComplete: () => {
      // Setelah intro selesai, mulai looping animasi
      startLoopingRotation();
      // Kontrol akan diaktifkan di dalam startLoopingRotation()
    }
  });

  // JUMP 1 (A -> B, Durasi 1.0s)
  introTimeline.to(camera.position, {
    x: P_B.x,
    y: P_B.y,
    z: P_B.z,
  })
  .to(controls.target, {
    x: T_B.x,
    y: T_B.y,
    z: T_B.z,
    onUpdate: () => controls.update(),
  }, "<");
}

// === END: FUNGSI ANIMASI KAMERA BARU ===

function playStoryAnimation() {
  const Z_OFFSET = 5;
  const X_OFFSET = 1.5;  
  // --- Global Cleanup: Hentikan animasi lain yang mungkin berjalan ---
  if (introTimeline) {
      introTimeline.kill();
  }
  if (loopTimeline) {
      loopTimeline.kill();
  }
  
  // Logika restart storyTimeline (jika tombol diklik ulang)
  if (isStoryPlaying && storyTimeline) {
      storyTimeline.kill();
  }
  
  isStoryPlaying = true;
  controls.enabled = false; // Matikan kontrol Orbit saat memulai animasi
  
  // --- DEKLARASI POSISI LOKAL DAN PENYESUAIAN MOBILE ---
  // Salin posisi default ke variabel lokal
  let P_E = S_E_POS.clone();
  let T_E = S_E_TARGET.clone();
  let P_F = S_F_POS.clone();
  let T_F = S_F_TARGET.clone();
  let P_G = S_G_POS.clone();
  let T_G = S_G_TARGET.clone();
  let P_H = S_H_POS.clone();
  let T_H = S_H_TARGET.clone();

  // Cek resolusi mobile dan terapkan Z_OFFSET
  if (window.innerWidth < MOBILE_RESOLUTION) {
    P_E.z += Z_OFFSET;
    P_E.x += X_OFFSET; 
    T_E.z += Z_OFFSET;
    T_E.x += X_OFFSET; 
    
    P_F.z += Z_OFFSET;
    P_F.x += X_OFFSET; 
    T_F.z += Z_OFFSET;
    T_F.x += X_OFFSET; 
    
    P_G.z += Z_OFFSET;
    P_G.x += X_OFFSET; 
    T_G.z += Z_OFFSET;
    T_G.x += X_OFFSET; 
    
    P_H.z += Z_OFFSET;
    P_H.x += X_OFFSET; 
    T_H.z += Z_OFFSET;
    T_H.x += X_OFFSET;
  }
  // -------------------------------------------------------------------
  
  // Durasi transisi awal yang diinginkan
  const initialTransitionDuration = 3.5; 
  
  // Buat timeline UTAMA (Dideklarasikan hanya sekali)
  storyTimeline = gsap.timeline({
      defaults: { duration: 1.0, ease: "power2.inOut" }, 
      onComplete: () => {
          isStoryPlaying = false;
          controls.enabled = true; // Aktifkan kontrol hanya di akhir urutan
      }
  });

  // 1. TRANSISI AWAL (Dari posisi kamera saat ini ke Point E yang disesuaikan)
  storyTimeline.to(camera.position, {
      x: P_E.x, y: P_E.y, z: P_E.z, // Menggunakan P_E yang sudah di-offset
      duration: initialTransitionDuration
  }, 0)
  .to(controls.target, {
      x: T_E.x, y: T_E.y, z: T_E.z, // Menggunakan T_E yang sudah di-offset
      duration: initialTransitionDuration,
      onUpdate: () => controls.update(),
  }, 0); 

  
  // --- SEQ 1: Hold & Idle Movement di Point E (4s) ---
  storyTimeline.to(controls.target, {
      x: T_E.x + 0.5, // Pindah target sedikit ke samping (menggunakan T_E yang sudah di-offset sebagai basis)
      y: T_E.y + 0.2, // Pindah target sedikit ke atas
      duration: 4.0, 
      ease: "sine.inOut",
      onUpdate: () => controls.update(),
  }, ">"); 

  
  // --- SEQ 2: Transition E -> F (1s move + 4s hold) ---
  storyTimeline.to(camera.position, {
      x: P_F.x, y: P_F.y, z: P_F.z, // Menggunakan P_F yang sudah di-offset
  }, ">") 
  .to(controls.target, {
      x: T_F.x, y: T_F.y, z: T_F.z, // Menggunakan T_F yang sudah di-offset
      onUpdate: () => controls.update(),
  }, "<")
  // Hold & Idle Movement di Point F (4s)
  .to(controls.target, {
      x: T_F.x - 0.5, 
      z: T_F.z - 0.2, 
      duration: 4.0, 
      ease: "sine.inOut",
      onUpdate: () => controls.update(),
  }, ">");

  // --- SEQ 3: Transition F -> G (1s move + 4s hold) ---
  storyTimeline.to(camera.position, {
      x: P_G.x, y: P_G.y, z: P_G.z, // Menggunakan P_G yang sudah di-offset
  }, ">")
  .to(controls.target, {
      x: T_G.x, y: T_G.y, z: T_G.z, // Menggunakan T_G yang sudah di-offset
      onUpdate: () => controls.update(),
  }, "<")
  // Hold & Idle Movement di Point G (4s)
  .to(camera.position, { 
      x: P_G.x + 0.3, 
      y: P_G.y - 0.3, 
      duration: 4.0, 
      ease: "sine.inOut",
  }, ">");

  // --- SEQ 4: Transition G -> H (1s move + 4s hold) ---
  storyTimeline.to(camera.position, {
      x: P_H.x, y: P_H.y, z: P_H.z, // Menggunakan P_H yang sudah di-offset
  }, ">")
  .to(controls.target, {
      x: T_H.x, y: T_H.y, z: T_H.z, // Menggunakan T_H yang sudah di-offset
      onUpdate: () => controls.update(),
  }, "<")
  // Hold & Idle Movement di Point H (4s)
  .to(controls.target, { 
      x: T_H.x + 0.4, 
      y: T_H.y + 0.1, 
      duration: 4.0, 
      ease: "sine.inOut",
      onUpdate: () => controls.update(),
  }, ">");
}

/** -------------------------- Loaders & Texture Preparations -------------------------- */
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);

const environmentMap = new THREE.CubeTextureLoader()
  .setPath("textures/skybox/")
  .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);
  const isMobile = window.innerWidth < 768;
  const sizePath = isMobile ? "2048/" : "";

  const textureNames = ["first", "second", "third", "fourth", "fifth"];

  const textureMap = textureNames.reduce((map, name, index) => {
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    map[key] = {
      day: `/textures/room/day/${sizePath}${name}_texture_set_day.webp`,
      night: `/textures/room/night/${sizePath}${name}_texture_set_night.webp`,
    };
    return map;
  }, {});
  
  const loadedTextures = {
    day: {},
    night: {},
  };

Object.entries(textureMap).forEach(([key, paths]) => {
  // Load and configure day texture
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.minFilter = THREE.LinearFilter;
  dayTexture.magFilter = THREE.LinearFilter;
  loadedTextures.day[key] = dayTexture;

  // Load and configure night texture
  const nightTexture = textureLoader.load(paths.night);
  nightTexture.flipY = false;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.minFilter = THREE.LinearFilter;
  nightTexture.magFilter = THREE.LinearFilter;
  loadedTextures.night[key] = nightTexture;
});

// Reuseable Materials
const createMaterialForTextureSet = (textureSet) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uDayTexture1: { value: loadedTextures.day.First },
      uNightTexture1: { value: loadedTextures.night.First },
      uDayTexture2: { value: loadedTextures.day.Second },
      uNightTexture2: { value: loadedTextures.night.Second },
      uDayTexture3: { value: loadedTextures.day.Third },
      uNightTexture3: { value: loadedTextures.night.Third },
      uDayTexture4: { value: loadedTextures.day.Fourth },
      uNightTexture4: { value: loadedTextures.night.Fourth },
      uDayTexture5: { value: loadedTextures.day.Fifth },
      uNightTexture5: { value: loadedTextures.night.Fifth },
      uMixRatio: { value: 0 },
      uTextureSet: { value: textureSet },
    },
    vertexShader: themeVertexShader,
    fragmentShader: themeFragmentShader,
  });

  Object.entries(material.uniforms).forEach(([key, uniform]) => {
    if (uniform.value instanceof THREE.Texture) {
      uniform.value.minFilter = THREE.LinearFilter;
      uniform.value.magFilter = THREE.LinearFilter;
    }
  });

  return material;
};

const roomMaterials = {
  First: createMaterialForTextureSet(1),
  Second: createMaterialForTextureSet(2),
  Third: createMaterialForTextureSet(3),
  Fourth: createMaterialForTextureSet(4),
  Fifth: createMaterialForTextureSet(5),
};

// Smoke Shader setup
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(0.33, 1, 0.33);

const perlinTexture = textureLoader.load("/shaders/perlin.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

const smokeMaterial = new THREE.ShaderMaterial({
  vertexShader: smokeVertexShader,
  fragmentShader: smokeFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uPerlinTexture: new THREE.Uniform(perlinTexture),
  },
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
});

const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);

const videoElement = document.createElement("video");
videoElement.src = "/textures/video/Screen2.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.autoplay = true;
videoElement.volume = 0.8;
videoElement.play();

const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;
videoTexture.center.set(0.5, 0.5);
videoTexture.rotation = Math.PI / 2;

/** -------------------------- Model and Mesh Setup -------------------------- */

// LOL DO NOT DO THIS USE A FUNCTION TO AUTOMATE THIS PROCESS HAHAHAAHAHAHAHAHAHA
let hourHand;
let minuteHand;

// Load a repeating normal map (e.g. waternormals.jpg)
const waterDayColor = new THREE.Color(0x558bc8);
const waterNightColor = new THREE.Color(0x0a1e3f);

loader.load("/models/wedding_model.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (!child.isMesh) return;

    const name = child.name;
    let materialAssigned = false;
    
    if (child.name.includes("Flower1_Fourth_Raycaster_")) {
      child.scale.set(0, 0, 0); 
      flowerObjects1.push(child);
    }

    if (child.name.includes("Flower2_Fourth_Raycaster_")) {
      child.scale.set(0, 0, 0); 
      flowerObjects2.push(child);
    }

    if (child.name.includes("Flower3_Fourth_Raycaster_")) {
      child.scale.set(0, 0, 0); 
      flowerObjects3.push(child);
    }

    if (child.name.includes("Flower4_Fourth_Raycaster_")) {
      child.scale.set(0, 0, 0); 
      flowerObjects4.push(child);
    }

    if (child.name.includes("Birdwing1_Left_Second")) {
      leftBirdWing = child;
      leftBirdWing.userData.initialRotation = leftBirdWing.rotation.clone(); 
    }
    
    if (child.name.includes("Birdwing1_Right_Second")) {
        rightBirdWing = child;
        rightBirdWing.userData.initialRotation = rightBirdWing.rotation.clone();
    }
    
    if (child.name === "Bird1_Second_Raycaster") {
        birdBody = child;
        birdBody.userData.initialPosition = birdBody.position.clone();
    }

    if (child.name.includes("Birdwing2_Left_Second")) {
      leftBirdWing2 = child;
      leftBirdWing2.userData.initialRotation = leftBirdWing2.rotation.clone(); 
    }
    
    if (child.name.includes("Birdwing2_Right_Second")) {
        rightBirdWing2 = child;
        rightBirdWing2.userData.initialRotation = rightBirdWing2.rotation.clone();
    }
    
    if (child.name === "Bird2_Second_Raycaster") {
        birdBody2 = child;
        birdBody2.userData.initialPosition = birdBody2.position.clone();
    }

    if (child.name.includes("Birdwing3_Left_Second")) {
      leftBirdWing3 = child;
      leftBirdWing3.userData.initialRotation = leftBirdWing3.rotation.clone(); 
    }
    
    if (child.name.includes("Birdwing3_Right_Second")) {
        rightBirdWing3 = child;
        rightBirdWing3.userData.initialRotation = rightBirdWing3.rotation.clone();
    }
    
    if (child.name === "Bird3_Second_Raycaster") {
        birdBody3 = child;
        birdBody3.userData.initialPosition = birdBody3.position.clone();
    }

    if (child.name.includes("FlowerSmall_Fourth_Raycaster_")) {
      leafObjects.push(child);
      child.userData.initialPosition = child.position.clone(); 
      child.userData.initialRotation = child.rotation.clone(); 
      child.scale.set(0, 0, 0);
    }

    if (child.name.includes("Vase_First_Raycaster_3")) {
      coffeePosition = child.position.clone();
    }

    Object.keys(textureMap).forEach((key) => {
      if (name.includes(key)) {
        child.material = roomMaterials[key];
        roomMaterials[key].uniforms.uMixRatio.value = 0;
        materialAssigned = true; // <-- Set flag jadi true
      }
    });

    // Cek mesh mana yang gagal
    if (!materialAssigned) {
      console.log(`WARNING: Mesh "${name}" tidak punya material. Tampil hitam!`);
    }
  });

  if (coffeePosition) {
    smoke.position.set(
      coffeePosition.x,
      coffeePosition.y + 0.5,
      coffeePosition.z
    );
  }

  scene.add(glb.scene);
});

/** -------------------------- Raycaster setup -------------------------- */

const raycasterObjects = [];
let currentIntersects = [];
let currentHoveredObject = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function playHoverAnimation(object, isHovering) {
  let scale = 1.4;
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  gsap.killTweensOf(object.position);

  if (object.name.includes("Coffee")) {
    gsap.killTweensOf(smoke.scale);
  }

  if (isHovering) {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * scale,
      y: object.userData.initialScale.y * scale,
      z: object.userData.initialScale.z * scale,
      duration: 0.5,
      ease: "back.out(2)",
    });
  } else {
    // Reset scale for all objects
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "back.out(2)",
    });
  }
}

window.addEventListener("mousemove", (e) => {
  touchHappened = false;
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener(
  "touchstart",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);

// Other Event Listeners
const themeToggleButton = document.querySelector(".theme-toggle-button");
const muteToggleButton = document.querySelector(".mute-toggle-button");
const weddingButton = document.querySelector("#wedding");
const storyButton = document.querySelector("#story");
const locationButton = document.querySelector("#location");
const messageButton = document.querySelector("#message");
const sunSvg = document.querySelector(".sun-svg");
const moonSvg = document.querySelector(".moon-svg");
const soundOffSvg = document.querySelector(".sound-off-svg");
const soundOnSvg = document.querySelector(".sound-on-svg");

const updateMuteState = (muted) => {
  if (muted) {
    backgroundMusic.volume(0);
  } else {
    backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
  }

  buttonSounds.click.mute(muted);
};

const handleMuteToggle = (e) => {
  e.preventDefault();

  isMuted = !isMuted;
  updateMuteState(isMuted);
  buttonSounds.click.play();

  gsap.to(muteToggleButton, {
    rotate: -45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (!isMuted) {
        soundOffSvg.style.display = "none";
        soundOnSvg.style.display = "block";
      } else {
        soundOnSvg.style.display = "none";
        soundOffSvg.style.display = "block";
      }

      gsap.to(muteToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(muteToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });
};

let isMuted = false;
muteToggleButton.addEventListener(
  "click",
  (e) => {
    backgroundMusic.volume(0);
    if (touchHappened) return;
    handleMuteToggle(e);
  },
  { passive: false }
);

muteToggleButton.addEventListener(
  "touchend",
  (e) => {
    backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
    touchHappened = true;
    handleMuteToggle(e);
  },
  { passive: false }
);

weddingButton.addEventListener(
  "click",
  (e) => {
    backgroundMusic.volume(0);
    if (touchHappened) return;
    playIntroAnimation(e);
  },
  { passive: false }
);

weddingButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    playIntroAnimation(e);
  },
  { passive: false }
);

storyButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    playStoryAnimation(e);
  },
  { passive: false }
);

storyButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    playStoryAnimation(e);
  },
  { passive: false }
);

locationButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    showModal(modals.location);
  },
  { passive: false }
);

locationButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    showModal(modals.location);
  },
  { passive: false }
);

// Themeing stuff
const toggleFavicons = () => {
  const isDark = document.body.classList.contains("dark-theme");
  const theme = isDark ? "light" : "dark";

  document.querySelector(
    'link[sizes="96x96"]'
  ).href = `media/${theme}-favicon/favicon-96x96.png`;
  document.querySelector(
    'link[type="image/svg+xml"]'
  ).href = `/media/${theme}-favicon/favicon.svg`;
  document.querySelector(
    'link[rel="shortcut icon"]'
  ).href = `media/${theme}-favicon/favicon.ico`;
  document.querySelector(
    'link[rel="apple-touch-icon"]'
  ).href = `media/${theme}-favicon/apple-touch-icon.png`;
  document.querySelector(
    'link[rel="manifest"]'
  ).href = `media/${theme}-favicon/site.webmanifest`;
};

let isNightMode = false;

const skyBackground = document.getElementById('sky-background');

const handleThemeToggle = (e) => {
  e.preventDefault();
  toggleFavicons();

  const isDark = document.body.classList.contains("dark-theme");
  document.body.classList.remove(isDark ? "dark-theme" : "light-theme");
  document.body.classList.add(isDark ? "light-theme" : "dark-theme");

  isNightMode = !isNightMode;
  buttonSounds.click.play();

  if (isNightMode) {
    scene.background = new THREE.Color(0x0a0a23);
    // fade in stars, etc.
  } else {
    scene.background = new THREE.Color("#D9CAD1");
    // fade out stars, etc.
  }

  // Animate button
  gsap.to(themeToggleButton, {
    rotate: 45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (isNightMode) {
        sunSvg.style.display = "none";
        moonSvg.style.display = "block";
      } else {
        moonSvg.style.display = "none";
        sunSvg.style.display = "block";
      }

      gsap.to(themeToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(themeToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });

  // Animate room materials
  Object.values(roomMaterials).forEach((material) => {
    gsap.to(material.uniforms.uMixRatio, {
      value: isNightMode ? 1 : 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  });

  // Fade starry sky background
  gsap.to(skyBackground, {
    opacity: isNightMode ? 1 : 0,
    duration: 1.5,
    ease: "power2.inOut"
  });
};

// Click event listener
themeToggleButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    handleThemeToggle(e);
  },
  { passive: false }
);

themeToggleButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    handleThemeToggle(e);
  },
  { passive: false }
);

/** -------------------------- Render and Animations Stuff -------------------------- */
const clock = new THREE.Clock();

function breatheAnimation(objects) {
  objects.forEach(object => {
      // Skala acak antara 0.8 hingga 1.0 (Rentang 0.2 + Minimum 0.8)
      const randomTargetScale = (Math.random() * 0.2) + 0.8; 
      
      // Durasi acak antara 1.5s dan 3.5s
      const randomDuration = (Math.random() * 2) + 1.5; 

      gsap.to(object.scale, {
          x: randomTargetScale,
          y: randomTargetScale,
          z: randomTargetScale,
          duration: randomDuration,
          ease: "sine.inOut", // Easing yang halus seperti bernapas
          yoyo: true,         // Bolak-balik
          repeat: -1,         // Ulangi tanpa batas
          delay: Math.random() * 1.5, // Delay awal acak agar tidak sinkron
      });
  });
}

function playFlowerAnimation() {
  const getNumber = (name) => parseInt(name.split('_').pop());
  const sortFlowers = (objects) => {
      objects.sort((a, b) => getNumber(a.name) - getNumber(b.name));
  };

  sortFlowers(flowerObjects1);
  sortFlowers(flowerObjects2);
  sortFlowers(flowerObjects3);
  sortFlowers(flowerObjects4);
  
  // Gabungkan kedua array untuk kemudahan memanggil breatheAnimation
  const allFlowers = [...flowerObjects1, ...flowerObjects2, ...flowerObjects3, ...flowerObjects4];
  const allFallingLeaves = leafObjects;

  const tl = gsap.timeline({
      delay: 1.0, 
      // HAPUS onComplete di sini: onComplete: () => { breatheAnimation(allFlowers); }
  });

  const targets1 = flowerObjects1.map(obj => obj.scale);
  const targets2 = flowerObjects2.map(obj => obj.scale);
  const targets3 = flowerObjects3.map(obj => obj.scale);
  const targets4 = flowerObjects4.map(obj => obj.scale);

  const animationConfig = {
      x: 1,
      y: 1,
      z: 1,
      duration: 3.5, 
      ease: "back.out(2)", 
      stagger: 0.15 
  };

  // --- 1. Animasi Mekar Flower1 ---
  tl.to(targets1, animationConfig, 0); // Dimulai di detik 0
  tl.to(targets2, animationConfig, 0); // Dimulai di detik 0
  tl.to(targets3, animationConfig, 0); // Dimulai di detik 0
  tl.to(targets4, animationConfig, 0); // Dimulai di detik 0

  // --- 3. PANGGIL FUNGSI BREATHING ---
  // Menggunakan .call() untuk memanggil fungsi.
  // '>-0.5' berarti: Mulai 0.5 detik SEBELUM animasi sebelumnya (mekar bunga terakhir) selesai.
  // Ini memberi jeda yang mulus. Sesuaikan nilai 0.5 jika perlu.
  tl.call(breatheAnimation, [allFlowers], null, ">-0.1");
  tl.call(fallAnimation, [allFallingLeaves], null, ">-0.5");
}

// Ubah fungsi applyFlap:
function applyFlap(object, direction = 1, body = null, currentTime, rotationAxis = 'x') {
  const time = currentTime; 
  if (!object) return;

  if (!object.userData.initialRotation) {
      console.warn(`Object missing initialRotation userData.`);
      return;
  }

  const flapAngle = THREE.MathUtils.degToRad(90); // Sudut maksimum kepakan
  const flapSpeed = 25.0; // Kecepatan kepakan
  
  const wingOffset = (flapAngle / 2) * (1 + Math.cos(time * flapSpeed));
  
  const initialRotation = object.userData.initialRotation[rotationAxis];

  if (rotationAxis === 'x') {
      object.rotation.x = initialRotation + direction * wingOffset;
  } else if (rotationAxis === 'y') {
      object.rotation.y = initialRotation + direction * wingOffset;
  } else if (rotationAxis === 'z') {
      object.rotation.z = initialRotation + direction * wingOffset;
  } else {
      console.warn(`Invalid rotation axis: ${rotationAxis}. Must be 'x', 'y', or 'z'.`);
  }

  if (body) {
      if (!body.userData.initialPosition) {
          console.warn(`Body missing initialPosition userData.`);
      } else {
          const bounce = Math.sin(time * flapSpeed) * 0.03;
          body.position.y = body.userData.initialPosition.y + bounce;
      }
  }
}

function fallAnimation(objects) {
  objects.forEach(object => {
      const initialY = object.userData.initialPosition.y;
      const initialX = object.userData.initialPosition.x;
      const initialZ = object.userData.initialPosition.z;

      // Variabel Acak untuk Setiap Daun
      const fallDistance = 2.5 + (Math.random() * 0.5); 
      const targetY = initialY - fallDistance; 
      
      // 1. Durasi JATUH (Diacak antara 4.5 hingga 5.5 detik)
      const fallDuration = 6.5 + (Math.random() * 1.0); 
      
      // 2. Durasi SIKLUS TOTAL (Diacak, dari 6 hingga 10 detik per siklus)
      const cycleDuration = 8 + (Math.random() * 4); 
      
      const sideOffset = 0.2 + (Math.random() * 0.6); 
      const targetX = initialX + sideOffset * (Math.random() > 0.5 ? 1 : -1);
      const targetZ = initialZ + sideOffset * (Math.random() > 0.5 ? 1 : -1);
      const randomRotations = (Math.random() * 4) + 1;
      
      // --- Timeline Jatuh (Tanpa Yoyo) ---
      gsap.timeline({
          repeat: -1, 
          delay: Math.random() * cycleDuration, // Delay acak berdasarkan siklus total
          
          // Menggunakan timeScale untuk mengatur kecepatan agar total siklus sesuai cycleDuration
          timeScale: fallDuration / cycleDuration, 
          
          onRepeat: () => {
              // Saat siklus jatuh selesai dan mengulang, pindahkan daun kembali ke posisi awal
              object.position.copy(object.userData.initialPosition);
              object.rotation.copy(object.userData.initialRotation);
          }
      })
      // 1. ANMASI SCALE IN
      .to(object.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.5, 
          ease: "back.out(2)"
      }, 0) 

      // 2. ANMASI POSISI & ROTASI (Jatuh)
      .to(object.position, {
          y: targetY,
          x: targetX,
          z: targetZ,
          duration: fallDuration, // Gunakan fallDuration di sini
          ease: "linear", 
      }, "<") 
      .to(object.rotation, {
          x: `+=${THREE.MathUtils.degToRad(360 * randomRotations)}`,
          y: `+=${THREE.MathUtils.degToRad(360 * randomRotations)}`,
          z: `+=${THREE.MathUtils.degToRad(360 * randomRotations)}`,
          duration: fallDuration, // Gunakan fallDuration di sini
          ease: "linear",
      }, "<") 
      
      // 3. ANMASI SCALE-OUT (Hilang)
      .to(object.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.2, 
          ease: "power1.in"
      }, `+=${fallDuration * 0.9}`); 
  });
}

const render = (timestamp) => {
  // --- DEBUGGING KAMERA DI SINI ---
  // console.log("Camera Position:", camera.position);
  // console.log("Controls Target:", controls.target);

  const elapsedTime = clock.getElapsedTime(); 
  smokeMaterial.uniforms.uTime.value = elapsedTime;

  // Panggil fungsi dengan waktu sebagai parameter
  applyFlap(leftBirdWing, -1, birdBody, elapsedTime, 'x');
  applyFlap(rightBirdWing, 1, birdBody, elapsedTime, 'x');

  applyFlap(leftBirdWing2, -1, birdBody2, elapsedTime, 'y');
  applyFlap(rightBirdWing2, 1, birdBody2, elapsedTime, 'y');

  applyFlap(leftBirdWing3, 1, birdBody3, elapsedTime, 'x');
  applyFlap(rightBirdWing3, -1, birdBody3, elapsedTime, 'x');

  //Update Orbit Controls
  controls.update();

  // Raycaster
  if (!isModalOpen) {
    raycaster.setFromCamera(pointer, camera);

    // Get all the objects the raycaster is currently shooting through / intersecting with
    currentIntersects = raycaster.intersectObjects(raycasterObjects);

    for (let i = 0; i < currentIntersects.length; i++) {}

    if (currentIntersects.length > 0) {
      const currentIntersectObject = currentIntersects[0].object;

      if (currentIntersectObject.name.includes("Hover")) {
        if (currentIntersectObject !== currentHoveredObject) {
          if (currentHoveredObject) {
            playHoverAnimation(currentHoveredObject, false);
          }

          playHoverAnimation(currentIntersectObject, true);
          currentHoveredObject = currentIntersectObject;
        }
      }

      if (currentIntersectObject.name.includes("Pointer")) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    } else {
      if (currentHoveredObject) {
        playHoverAnimation(currentHoveredObject, false);
        currentHoveredObject = null;
      }
      document.body.style.cursor = "default";
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();