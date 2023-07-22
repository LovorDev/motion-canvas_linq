import {makeScene2D} from "@motion-canvas/2d";
import {Rect, Txt,} from "@motion-canvas/2d/lib/components";
import {all, waitUntil} from "@motion-canvas/core/lib/flow";
import {createRef, makeRef, range, useRandom} from "@motion-canvas/core/lib/utils";
import {createSignal} from "@motion-canvas/core/lib/signals";
import {easeInQuad} from "@motion-canvas/core/lib/tweening";
import {whereMethod} from "./whereMethod";


const RED = '#9a4f50';
const DARK_RED = '#603232';
const ORANGE = '#c28d75';
const GRAY = '#9a9a97';
const LIGHT = '#c5ccb8';
const circleSize = 200;
const circlesCount = 20;



export default makeScene2D(function* (view) {

    view.fontFamily('JetBrains Mono')
    view.fontStyle('monospace')

    const random = useRandom(112, true);
    const halfWidth = view.width() / 2;
    const halfHeight = view.height() / 2;

    const firstCircles: Rect[] = new Array(circlesCount / 2)
    const secondCircles: Rect[] = new Array(circlesCount / 2)
    let allCircles = new Array(circlesCount);

    const rect = createRef<Rect>()
    const firstText = createSignal("");


    const secondText = createSignal("");
    range(circlesCount).map((pos, i) => (
        <Rect
            textAlign={'end'}
            fill={RED}
            width={0}
            height={0}
            radius={30}
            x={random.nextInt(-halfWidth, halfWidth)}
            y={random.nextInt(-halfHeight, halfHeight)}
            lineWidth={5}
            ref={makeRef(allCircles, i)}>
            <Txt text={i % 2 === 0 ? firstText : secondText} fontSize={40} fill={LIGHT}></Txt>
        </Rect>
    ));

    let i1 = 0;
    let i2 = 0;

    for (let i = 0; i < allCircles.length; i++) {
        const circle = allCircles[i];
        if (i % 2 === 0)
            firstCircles[i1++] = circle;
        else
            secondCircles[i2++] = circle;
    }

    allCircles = shuffle(allCircles)

    let enemiesArrayText = createRef<Txt>()
    let redEnemiesArrayText = createRef<Txt>()

    view.add(<><Rect direction={'row'} alignItems={'end'} gap={10} ref={rect} width={view.width() * .9}
                     fill={'rgba(97,97,97,0)'} stroke={'black'} radius={20}
                     padding={20}>
            {allCircles}
            <Txt ref={enemiesArrayText}
                 position={[-680, -40]}
                 layout={false}
                 fill ={DARK_RED} 
            />         
            <Txt ref={redEnemiesArrayText}
                 position={[0, -40]}
                 layout={false}
                 fill ={LIGHT} 
            />
        </Rect>
        </>
    );

    yield* all(
        ...allCircles.map((c) => (c.size(circleSize, 1))),
        firstText("enemy", 1),
        secondText("enemy", 1)
    );

    yield* waitUntil('event_1');

    function* changeColor() {
        yield* all(
            ...firstCircles.map((circle) => circle.fill(ORANGE, .8))
        );
    }


    const rectWidth = rect().width() - 34;
    const targetSize = circleSize / 2.5 - 5;

    yield* waitUntil('event_2');

    yield* all(
        firstText("", .5),
        secondText("", .5),
        ...allCircles.map((c) => c.size(targetSize, 1)),
        ...allCircles.map((c) => c.radius(20, 1)),
        ...allCircles.map((c, i) => c.position([(rectWidth / circlesCount * i + 5) - rectWidth / 2 + targetSize / 2, 0], 1)),
    )

    rect().layout(true);
    yield* all(
        rect().fill(GRAY, 1),
        ...allCircles.map((c) => c.stroke(DARK_RED, 1)),
    )

    // yield* waitUntil('event_3');

    let width = rect().width();

    yield* all(
        rect().size([width, 200], 1),
        enemiesArrayText().text('enemies [ ]', 1)
    )

    yield* waitUntil('end');

    yield* rect().position.y(-400, 1, easeInQuad);


    yield* waitUntil('dif colors');

    yield* changeColor();

    yield redEnemiesArrayText().text('List<\Enemy> redEnemies', 1)
    

    yield* whereMethod(view,allCircles, targetSize);

});

const shuffle = ([...arr]) => {
    let m = arr.length;
    let random = useRandom(12);
    while (m) {
        const i = Math.floor(random.nextFloat(0, 1) * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};
