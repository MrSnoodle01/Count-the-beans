import { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Bodies, Composite } from "matter-js";


export default function MatterScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const renderRef = useRef<Render | null>(null);
    const runnerRef = useRef<Runner | null>(null);
    const [numberOfShapes, setNumberOfShapes] = useState(Math.floor(Math.random() * 300));

    useEffect(() => {
        if (canvasRef.current) {
            const engine = Engine.create();
            const render = Render.create({
                element: canvasRef.current.parentElement as HTMLElement,
                canvas: canvasRef.current,
                engine: engine,
                options: {
                    width: 1920,
                    height: 1080,
                    wireframes: false // Ensure colors are rendered
                }
            });

            const runner = Runner.create();

            engineRef.current = engine;
            renderRef.current = render;
            runnerRef.current = runner;

            const ground = Bodies.rectangle(960, 1080, 1920, 60, { isStatic: true });
            let shapes = [ground];
            for (let i = 0; i < numberOfShapes; i++) {
                const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; // random hex color
                shapes.push(Bodies.circle(960, 1080 - (i * 20), 10, { render: { fillStyle: color } }));
            }
            Composite.add(engine.world, shapes);

            Render.run(render);
            Runner.run(runner, engine);

            return () => {
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
            };
        }
    }, [numberOfShapes]);

    return (
        <>
            <h3>{numberOfShapes}</h3>
            <button onClick={() => setNumberOfShapes(Math.floor(Math.random() * 300))}>Randomize Shapes</button>
            <canvas ref={canvasRef} style={{ width: '75vw', height: '75vh', display: 'block', margin: '0 auto', border: '1px solid #ccc' }} />
        </>

    )
}