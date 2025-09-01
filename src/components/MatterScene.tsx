import { useEffect, useRef } from "react";
import Matter, { Engine, Render, Runner, Bodies, Composite } from "matter-js";
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

const containers = [
    [ // jar
        Bodies.rectangle(960, 900, 720, 20, { isStatic: true }),
        Bodies.rectangle(600, 560, 700, 20, { isStatic: true, angle: 1.5708 }),
        Bodies.rectangle(1320, 560, 700, 20, { isStatic: true, angle: 1.5708 }),
    ], [ // circle
        createHollowCircle(960, 540, 500, 450, 100),
    ], [ // inverted triangle
        Bodies.rectangle(645, 650, 900, 20, { isStatic: true, angle: 0.785398 }),
        Bodies.rectangle(1270, 650, 900, 20, { isStatic: true, angle: 2.35619 }),
    ]
]

function createHollowCircle(x: number, y: number, outerRadius: number, innerRadius: number, segments: number) {
    const bodies = [];
    const thickness = outerRadius - innerRadius;

    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const midRadius = innerRadius + (thickness / 2);

        const outerX = x + midRadius * Math.cos(angle);
        const outerY = y + midRadius * Math.sin(angle);

        if (outerY > 100) {
            const segmentBody = Matter.Bodies.rectangle(outerX, outerY, thickness, (outerRadius * 2 * Math.PI) / segments, { angle: angle, isStatic: true });
            bodies.push(segmentBody)
        }
    }
    return Matter.Composite.create({ bodies: bodies });
}

export default function MatterScene(props: { numberOfBeans: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const renderRef = useRef<Render | null>(null);
    const runnerRef = useRef<Runner | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const engine = Engine.create();
            engine.positionIterations = 50;
            engine.velocityIterations = 50;
            const render = Render.create({
                element: canvasRef.current.parentElement as HTMLElement,
                canvas: canvasRef.current,
                engine: engine,
                options: {
                    width: 1920,
                    height: 1080,
                    wireframes: false,
                    background: '#636262',
                }
            });

            const runner = Runner.create();

            engineRef.current = engine;
            renderRef.current = render;
            runnerRef.current = runner;

            Composite.add(engine.world, containers[Math.floor(Math.random() * 3)]);
            // Composite.add(engine.world, containers[2]);
            let beans = [];
            for (let i = 0; i < props.numberOfBeans; i++) {
                const color = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`; // random hex color
                beans.push(Bodies.fromVertices(960, 100 - (i * 25), [beanShape], { render: { fillStyle: color, strokeStyle: 'transparent' } }, false));
            }
            Composite.add(engine.world, beans);

            Render.run(render);
            Runner.run(runner, engine);

            return () => {
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
            };
        }
    }, [props.numberOfBeans]);

    return (
        <div className='bean-screen'>
            <canvas ref={canvasRef} style={{ width: '75vw', height: '75vh', display: 'block', margin: '0 auto', border: '1px solid #ccc' }} />
        </div>
    )
}