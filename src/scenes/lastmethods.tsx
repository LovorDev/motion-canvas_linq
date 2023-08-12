import {jsx, makeScene2D} from "@motion-canvas/2d";
import {Colors} from "./utils";
import {makeRef, range, useLogger, useRandom} from "@motion-canvas/core/lib/utils";
import {CodeBlock} from "@motion-canvas/2d/lib/components/CodeBlock";
import {Line, Rect, Node, Layout, Circle} from "@motion-canvas/2d/lib/components";
import {all, sequence, waitUntil} from "@motion-canvas/core/lib/flow";
import {Direction, Logger, slideTransition, Vector2} from "@motion-canvas/core";
import {createSignal} from "@motion-canvas/core/lib/signals";
import {linear} from "@motion-canvas/core/lib/tweening/timingFunctions";

export default makeScene2D(function* (view) {

    const height = 80
    const width = 300
    const nodeCount = 6

    let enemyNamesRectArray: Rect[] = [];
    let enemyNamesTxtArray: CodeBlock[] = [];
    let directionLines: Line[] = [];
    var random = useRandom(523453)
    let firstPoint: Vector2[] = [new Vector2(278, -8)];
    let allLinePoints: Vector2[][] = range(nodeCount).map((_) => firstPoint.concat(range(random.nextInt(3, 6)).map((_) => new Vector2(random.nextInt(350, 500), random.nextInt(-100, 100)))))
    let lineCircles : Circle[][] = []
    let logger = useLogger();
    const percentage = createSignal(0.3);
    
    let nodeArray = range(nodeCount).map((pos, i) => {
        lineCircles[i]=[]
        return (
            <Layout>
                <Rect
                    layout
                    fill={"#313131"}
                    stroke={Colors.LIGHT}
                    shadowBlur={10}
                    shadowOffset={[-2, 2]}
                    shadowColor={"#000000"}
                    radius={20}
                    padding={20}
                    ref={makeRef(enemyNamesRectArray, i)}
                    justifyContent={'center'}
                >
                    <CodeBlock alignSelf={'center'} language={"c#"} code={'class Enemy { Vector3[] Destination; }'}
                               fontSize={32} ref={makeRef(enemyNamesTxtArray, i)}/>

                </Rect>
                <Line
                    layout={false}
                    lineDash={[8]}
                    lineWidth={6}
                    stroke={'#b391d7'}
                    ref={makeRef(directionLines, i)} lineCap={'butt'} lineJoin={'round'}
                    points={allLinePoints[i]}
                    end = {0}
                >
                    {allLinePoints[i].map((pos, j) => {
                            if (j === 0) return null
                            let enabled = false;
                            return <Circle fill={'white'}
                                           size={14}
                                           position={pos}
                                           ref={makeRef(lineCircles[i],j)}
                                           opacity={0}
                            />
                        }
                    )}
                </Line>
            </Layout>
        );
    });

    view.add(
        <Rect position={[-400, 0]} layout alignItems={'center'} gap={60} direction={'column'}> {nodeArray} </Rect>
    );

    yield* slideTransition(Direction.Left, 2);
    
    yield * sequence(
        .4,
        ...directionLines.map((x,i )=>all(x.end(1,2,linear),sequence(2/lineCircles[i].length,...lineCircles[i].map((j)=>j.opacity(1,.2)))))
    )

    yield* waitUntil("last methods")


    yield* waitUntil("point animation")


})
