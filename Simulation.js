const SimulationPage = ({ isEmbedded = false }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 0 });
    const [showDragHint, setShowDragHint] = useState(false);
    const [background, setBackground] = useState('/assets/img/space.jpg');

    const handleBackgroundChange = (e) => {
        setBackground(e.target.value);
    };

    useEffect(() => {
        if (sceneRef.current && window.THREE) {
            const scene = sceneRef.current;
            const value = background;

            if (value.startsWith('/assets')) {
                const textureLoader = new window.THREE.TextureLoader();
                textureLoader.load(value, (texture) => {
                    scene.background = texture;
                });
            } else {
                scene.background = new window.THREE.Color(value);
            }
        }
    }, [background]);


    useEffect(() => {
        let renderer, camera, controls, animateId;
        
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.getElementById(src)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                script.id = src;
                document.body.appendChild(script);
            });
        };

        const initThreeJsScene = async () => {
            try {
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
                await Promise.all([
                    loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"),
                    loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js")
                ]);

                sceneRef.current = new window.THREE.Scene();
                const scene = sceneRef.current;
                
                const textureLoader = new window.THREE.TextureLoader();
                textureLoader.load(background, (texture) => {
                    scene.background = texture;
                });

                camera = new window.THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
                camera.position.set(-9, -3, 20); 
                setCameraPosition({ x: -9, y: -3, z: 20 });

                renderer = new window.THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
                mountRef.current.appendChild(renderer.domElement);

                const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.8);
                scene.add(ambientLight);
                const directionalLight = new window.THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(5, 10, 7.5);
                scene.add(directionalLight);

                controls = new window.THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 2;
                controls.maxDistance = 50;

                const hideHintOnFirstInteraction = () => {
                    setShowDragHint(false);
                    controls.removeEventListener('start', hideHintOnFirstInteraction);
                };
                controls.addEventListener('start', hideHintOnFirstInteraction);

                const loader = new window.THREE.GLTFLoader();
                loader.load(
                    '/assets/models/gateway.glb',
                    (gltf) => {
                        const model = gltf.scene;
                        const box = new window.THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new window.THREE.Vector3());
                        model.position.sub(center);
                        scene.add(model);
                        setIsLoading(false);
                        setShowDragHint(true);
                    },
                    undefined,
                    (error) => {
                        console.error('An error happened while loading the model:', error);
                        setIsLoading(false);
                    }
                );

                const animate = function () {
                    animateId = requestAnimationFrame(animate);
                    controls.update();
                    
                    setCameraPosition(prevPos => {
                        const newX = parseFloat(camera.position.x.toFixed(2));
                        const newY = parseFloat(camera.position.y.toFixed(2));
                        const newZ = parseFloat(camera.position.z.toFixed(2));
                        if (newX !== prevPos.x || newY !== prevPos.y || newZ !== prevPos.z) {
                            return { x: newX, y: newY, z: newZ };
                        }
                        return prevPos;
                    });

                    renderer.render(scene, camera);
                };
                animate();

            } catch (error) {
                console.error("Failed to load three.js scripts:", error);
                setIsLoading(false);
            }
        };

        initThreeJsScene();

        const handleResize = () => {
            if (mountRef.current && renderer) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener('resize', handleResize);
            if (controls) controls.dispose();
            if (mountRef.current && renderer && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            document.getElementById("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")?.remove();
            document.getElementById("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js")?.remove();
            document.getElementById("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js")?.remove();
        };

    }, []);

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                     <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Interactive 3D Simulation</h1>
                        <p className="text-lg text-slate-600">
                            Click and drag to rotate the model, or use the dropdown to change the scene.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <label htmlFor="bg-select" className="block text-lg font-bold text-slate-800 mb-1">Background</label>
                        <select
                            id="bg-select"
                            value={background}
                            onChange={handleBackgroundChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-lg border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 rounded-md shadow-sm"
                        >
                            <option value="/assets/img/moon.jpg">Moon</option>
                            <option value="/assets/img/space.jpg">Space</option>
                            <option value="/assets/img/blue.jpg">Blue</option>
                            <option value="#ffffff">White</option>
                            <option value="#000000">Black</option>
                        </select>
                    </div>
                </div>
            </div>
            <div ref={mountRef} className="relative w-full flex-grow bg-slate-900 rounded-xl shadow-inner" style={{minHeight: '60vh'}}>
                {isLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-slate-900 z-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-white font-semibold">Loading Model...</p>
                        </div>
                    </div>
                )}
                {showDragHint && (
                    <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none transition-opacity duration-500">
                        <div className="bg-black bg-opacity-60 text-white font-semibold px-4 py-2 rounded-lg animate-pulse">
                            Click and drag to explore
                        </div>
                    </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-gray-300 text-xs font-mono p-2 rounded-md pointer-events-none">
                    <p>Camera Position:</p>
                    <p>X: {cameraPosition.x}</p>
                    <p>Y: {cameraPosition.y}</p>
                    <p>Z: {cameraPosition.z}</p>
                </div>
            </div>
             {isEmbedded && (
                <div className="mt-8 text-center">
                    <a href="https://github.com/NicholasReardon133/3D-Portfolio-Gateway" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors">
                        <Github size={24} className="mr-3" />
                        View on GitHub
                    </a>
                </div>
            )}
        </div>
    );
};