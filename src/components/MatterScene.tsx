import { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Bodies, Composite } from "matter-js";
// using poly-decomp creates much better concave beans, but also adds some buggy lines in the middle of the bean
// I think it has something to do with how the program triangulate the vertices
import decomp from "poly-decomp";
(globalThis as any).decomp = decomp;

const beanShape = [
    { x: 12.0, y: .3 },
    { x: 16.5, y: .3 },
    { x: 21.6, y: 1.4 },
    { x: 27.6, y: 4.4 },
    { x: 32.9, y: 9.1 },
    { x: 35.9, y: 13.1 },
    { x: 37.5, y: 17.7 },
    { x: 37.1, y: 21.6 },
    { x: 35.2, y: 25.0 },
    { x: 32.8, y: 27.1 },
    { x: 29.6, y: 28.1 },
    { x: 25.3, y: 27.8 },
    { x: 22.3, y: 26.2 },
    { x: 18.9, y: 21.3 },
    { x: 16.7, y: 19.5 },
    { x: 14.2, y: 18.7 },
    { x: 6.8, y: 18.5 },
    { x: 4.3, y: 17.5 },
    { x: 1.9, y: 15.4 },
    { x: .4, y: 10.8 },
    { x: .9, y: 6.7 },
    { x: 2.1, y: 4.7 },
    { x: 6.3, y: 1.6 },
];

export default function MatterScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const renderRef = useRef<Render | null>(null);
    const runnerRef = useRef<Runner | null>(null);
    const [numberOfShapes, setNumberOfShapes] = useState(Math.floor(Math.random() * 500));

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
                    wireframes: false
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
                shapes.push(Bodies.fromVertices(960, 1080 - (i * 50), [beanShape], { render: { fillStyle: color, strokeStyle: 'transparent' } }, false));
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
            <button onClick={() => setNumberOfShapes(Math.floor(Math.random() * 500))}>Re-render Shapes</button>
            <canvas ref={canvasRef} style={{ width: '75vw', height: '75vh', display: 'block', margin: '0 auto', border: '1px solid #ccc' }} />
        </>
    )
}