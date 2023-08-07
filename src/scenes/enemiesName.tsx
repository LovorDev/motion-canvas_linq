import {makeScene2D, View2D} from "@motion-canvas/2d";
import {all, sequence, waitFor, waitUntil} from "@motion-canvas/core/lib/flow";
import {
    DEFAULT,
    Direction,
    easeInCubic, easeInOutBack,
    easeInQuint,
    easeOutBack,
    easeOutCubic,
    slideTransition
} from "@motion-canvas/core";
import {Rect, Txt, Line} from "@motion-canvas/2d/lib/components";
import {createRef, makeRef, range, Reference} from "@motion-canvas/core/lib/utils";
import {Colors} from "./utils";
import {CodeBlock, edit, remove} from "@motion-canvas/2d/lib/components/CodeBlock";
import {easeInQuad} from "@motion-canvas/core/lib/tweening";

const names = [
    "Timothy", "Jordan",
    "Eddie", "Montgomery",
    "Charles", "Charles",
    "John", "Simpson",
    "Louis", "Erickson",
    "Joseph", "Greer",
    "Stephen", "Charles",
    "Roy", "Montgomery",
    "Timothy", "Lucas",
    "Harold", "Simpson",
]

export default makeScene2D(function* (view) {

    view.fontFamily('JetBrains Mono')
    view.fontStyle('monospace')
    let enemyNamesArray: Txt[] = [];

    const height = 40
    const width = 180

    let nodeArray = range(20).map((pos, i) => (
        <Rect
            fill={"#313131"}
            position={[0, i * height * 1.12 - 400]}
            stroke={Colors.LIGHT}
            shadowBlur={10}
            shadowOffset={[-2, 2]}
            shadowColor={"#000000"}
            width={width} height={height} radius={8}
            ref={makeRef(enemyNamesArray, i)}>
            <Txt text={names[i]} fontSize={24} fill={Colors.LIGHT}/>
        </Rect>));

    view.add(
        <Rect position={[-800, 0]}> {nodeArray} </Rect>
    );

    const initCode = createRef<CodeBlock>();
    const codeRect = createRef<Rect>()
    view.add(
        <Rect layout
              ref={codeRect}
              fill={Colors.DARK_GRAY}
              position={[120, -240]}
              padding={[40, 40, 24, 40,]}
              radius={20}>
            <CodeBlock alignSelf={'stretch'} language="c#" ref={initCode} code={`var enemiesNames = enemies
            .Select(x => x.Name)
            .ToList();`}/>
        </Rect>
    );

    yield* slideTransition(Direction.Left, 2);

    yield* namesCodeBlock(view, enemyNamesArray, initCode, codeRect);

    yield* takeSkip(view, enemyNamesArray, initCode, codeRect);

    yield* waitUntil('new scene start');
})

function* namesCodeBlock(view: View2D, enemyNamesArray: Txt[], initCode: Reference<CodeBlock>, codeRect: Reference<Rect>) {

    const codeRef = createRef<CodeBlock>();

    yield* initCode().edit(1)`${edit(`var enemiesNames = enemies
            .Select(x => x.Name)
            .ToList();`, `enemiesNames: [20]`)}`

    const duration = 1.2;
    yield codeRect().radius(10, duration)
    yield initCode().fontSize(36, duration)
    yield codeRect().padding(codeRect().padding().scale(.5), duration)

    yield* codeRect().position([-690, -480], duration)

    yield* view.add(<CodeBlock position={[200, 0]} language="c#" ref={codeRef}
                               code={'var uniqNames = enemiesNames.Distinct().ToList();'}/>)

    yield initCode().edit(2)`enemiesNames: [${edit('20', '15')}]`
    yield* sequence(
        0.5,
        enemyNamesArray[5].opacity(.5, .35),
        enemyNamesArray[13].opacity(.5, .35),
        enemyNamesArray[15].opacity(.5, .35),
        enemyNamesArray[16].opacity(.5, .35),
        enemyNamesArray[19].opacity(.5, .35),
    )

    yield initCode().selection(DEFAULT, 1)

    yield* codeRef().edit(2)`var uniqNames = enemiesNames${edit('.Distinct().ToList()', '.ToHashSet()')};`

    yield* waitUntil('distinct hashset');

    yield initCode().edit(2)`enemiesNames: [${edit('15', '20')}]`
    yield sequence(
        0.5,
        enemyNamesArray[5].opacity(1, .35),
        enemyNamesArray[13].opacity(1, .35),
        enemyNamesArray[15].opacity(1, .35),
        enemyNamesArray[16].opacity(1, .35),
        enemyNamesArray[19].opacity(1, .35),
    )

    yield* codeRef().edit(2)`${remove('var uniqNames = enemiesNames.ToHashSet();')}`
    yield initCode().selection(DEFAULT, 1)
}

function* takeSkip(view: View2D, enemyNamesArray: Txt[], initCode: Reference<CodeBlock>, codeRect: Reference<Rect>) {

    let cellSize = 64
    let arrayLineRef = createRef<Line>()

    let takeRef = createRef<Rect>()
    let skipRef = createRef<Rect>()

    let takeCodeRef = createRef<CodeBlock>()
    let skipCodeRef = createRef<CodeBlock>()

    let skipLineSelection = createRef<Line>();
    let takeLineSelection = createRef<Line>();

    const cellsCount = 18;

    view.add(
        <Rect position={[200, 0]}>
            <Rect size={[cellSize * cellsCount - cellSize * .16, 80]} radius={12} clip>
                <Line
                    lineWidth={80}
                    lineDash={[cellSize * .92, cellSize * .08]}
                    stroke={'darkgray'}
                    ref={arrayLineRef}
                    opacity={0}
                    points={[
                        [-(cellSize * cellsCount) / 2, 0],
                        [(cellSize * cellsCount) / 2, 0],
                    ]}
                /></Rect>

            <Rect fill={'darkslateblue'}
                  layout
                  padding={[30, 30, 20, 30]}
                  position={[-200, -200]}
                  ref={takeRef}
                  radius={30}
                  stroke={'blue'}>
                <Line
                    position={[-130, 0]}
                    layout={false}
                    lineWidth={16}
                    stroke={'darkslateblue'}
                    radius={120}
                    endArrow
                    arrowSize={18}
                    points={[[0, 0], [-400, 0]]}
                    ref={takeLineSelection}/>
                <CodeBlock
                    language="c#"
                    ref={takeCodeRef}
                    code={'.Take(...)'}/>
            </Rect>
            <Rect fill={Colors.RED}
                  layout padding={[30, 30, 20, 30]}
                  position={[200, -200]}
                  ref={skipRef}
                  radius={30}
                  stroke={'blue'}>
                <Line
                    position={[-130, 0]}
                    layout={false}
                    lineWidth={16}
                    stroke={Colors.RED}
                    radius={36}
                    endArrow
                    end={0}
                    arrowSize={18}
                    points={[[0, 0], [-500, 0], [-500, -500], [-600, -500]]}
                    ref={skipLineSelection}/>
                <CodeBlock
                    language="c#"
                    ref={skipCodeRef}
                    code={'.Skip(...)'}/>
            </Rect>
        </Rect>
    )

    yield* arrayLineRef().opacity(1, 2);

    yield* sequence(
        .5,
        takeRef().opacity(1, 2),
        skipRef().opacity(1, 2),
    )

    yield* sequence(
        .5,
        takeRef().position([takeRef().position().x, 0], 1, easeInQuint),
        skipRef().position([skipRef().position().x, 0], 1, easeInQuint),
    )

    yield all(
        takeRef().radius([0, 20, 20, 0], 3),
        skipRef().radius([20, 0, 0, 20], 3),
    )

    yield* all(
        takeRef().position([160, 0], 3, easeInOutBack),
        skipRef().position([-160, 0], 3, easeInOutBack),
    )

    yield* waitUntil('Skip take')

    yield* all(
        takeRef().position([takeRef().position().x, -100], 2),
        skipRef().position([skipRef().position().x, 100], 2),
    )

    yield all(
        takeRef().radius(20, 6),
        skipRef().radius(20, 6),
    )

    yield* skipLineSelection().end(1, 2);

    yield sequence(
        1,
        skipCodeRef().edit(.9)`.Skip(${edit('...', '1')})`,
        skipCodeRef().edit(.9)`.Skip(${edit('1', '2')})`,
        skipCodeRef().edit(.9)`.Skip(${edit('2', '3')})`,
        skipCodeRef().edit(.9)`.Skip(${edit('3', '4')})`,
    )
    yield sequence(
        .8,
        waitFor(1),
        enemyNamesArray[0].opacity(.4,.6),
        enemyNamesArray[1].opacity(.4,.6),
        enemyNamesArray[2].opacity(.4,.6),
        enemyNamesArray[3].opacity(.4,.6),
    )
    yield* skipLineSelection().points([[0, 0], [-500, 0], [-500, -320], [-600, -320]], 4);
    

}
