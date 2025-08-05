Gateway Space Station Simulation
📖 Overview
This project is an interactive, browser-based 3D simulation of a gateway-style space station, created using JavaScript and the Three.js library. The simulation focuses on creating an immersive scene by loading an external 3D model and allowing the user to explore it within a panoramic space environment. It demonstrates key techniques for building dynamic 3D web applications.

🛠️ Technologies Used
Core Language: JavaScript

3D Graphics Library: Three.js

💡 Key Concepts & Topics
This project serves as a practical example for several important 3D web development concepts:

1. External Model Loading
The core of the simulation is the ability to load and display a complex, pre-made 3D model. This is accomplished using the GLTFLoader in Three.js, which allows for the import of models in the efficient .gltf or .glb formats. This is a fundamental skill for creating detailed 3D scenes without having to define complex geometries in code.

2. Interactive Camera Manipulation
To make the scene explorable, the project implements camera controls. Using the OrbitControls add-on, the user can intuitively orbit, zoom, and pan the camera with their mouse. This transforms the static scene into an interactive experience, allowing for detailed inspection of the space station model from any angle.

3. Immersive Backgrounds (Skybox)
A realistic and immersive space environment is achieved by using a skybox. A CubeTextureLoader is used to apply a set of six images to the inside of a large cube that surrounds the entire scene. This creates a seamless 360° panoramic background that makes the user feel like they are truly in space.

4. Scene, Lighting, and Rendering
The project is built on the standard Three.js foundation, including:

Scene: The container for the station model, lights, and camera.

Lighting: Proper lighting, such as AmbientLight for global illumination and DirectionalLight to simulate a sun, is crucial for making the 3D model look realistic and detailed.

Renderer: The WebGLRenderer renders the complete scene and handles the animation loop via requestAnimationFrame to keep the experience smooth.
