import {makeScene2D} from "@motion-canvas/2d";
import {all, sequence, waitUntil} from "@motion-canvas/core/lib/flow";
import {Color, DEFAULT, Direction, easeOutBack, slideTransition} from "@motion-canvas/core";
import {Rect, Txt} from "@motion-canvas/2d/lib/components";
import {CodeBlock, edit} from "@motion-canvas/2d/lib/components/CodeBlock";
import {Colors} from "./utils";
import {createRef} from "@motion-canvas/core/lib/utils";

export default makeScene2D(function* (view) {

    view.fontFamily('JetBrains Mono')
    view.fontStyle('monospace')

    let concatRectRef = createRef<Rect>()
    let intersectRectRef = createRef<Rect>()
    let exceptRectRef = createRef<Rect>()
    let unionRectRef = createRef<Rect>()

    view.add(
        <>
            <Rect
                ref={concatRectRef}
                size={[720, 240]}
                radius={40}
                fill={Colors.LIGHT}
                justifyContent={'center'}
                shadowOffset={[-10, 10]}
                shadowBlur={20}
                shadowColor={'black'}
                position={[-440, -300]}>
                <Txt text={".Concat()"} fontSize={92}/>
            </Rect>,
            <Rect
                ref={intersectRectRef}
                size={[720, 240]}
                radius={40}
                fill={Colors.LIGHT}
                justifyContent={'center'}
                shadowOffset={[-10, 10]}
                shadowBlur={20}
                shadowColor={'black'}
                position={[440, -300]}>
                <Txt text={".Intersect()"} fontSize={92}/>
            </Rect>,
            <Rect
                ref={exceptRectRef}
                size={[720, 240]}
                radius={40}
                fill={Colors.LIGHT}
                justifyContent={'center'}
                shadowOffset={[-10, 10]}
                shadowBlur={20}
                shadowColor={'black'}
                position={[-440, 300]}>
                <Txt text={".Except()"} fontSize={92}/>
            </Rect>,
            <Rect
                ref={unionRectRef}
                size={[720, 240]}
                radius={40}
                fill={Colors.LIGHT}
                justifyContent={'center'}
                shadowOffset={[-10, 10]}
                shadowBlur={20}
                shadowColor={'black'}
                position={[440, 300]}>
                <Txt text={".Union()"} fontSize={92}/>
            </Rect>,
        </>
    )

    yield* slideTransition(Direction.Left, 2);

    yield* waitUntil("first methods")

    yield* sequence(
        .2,
        all(unionRectRef().opacity(.1, 2),
            unionRectRef().position([800 * 3, -400], 2),),
        all(exceptRectRef().opacity(.1, 2),
            exceptRectRef().position([800 * 2, -400], 2),),
        all(intersectRectRef().opacity(.1, 2),
            intersectRectRef().position([800, -400], 2),),
        concatRectRef().position([0, -400], 2),
    )

    yield* waitUntil("concat method")

    let firstArrayCircle = createRef<Rect>()
    let secondArrayCircle = createRef<Rect>()

    let firstArrayText = createRef<Txt>()
    let secondArrayText = createRef<Txt>()

    let completeText = createRef<Txt>()
    let mainCodeRef = createRef<CodeBlock>()
    let mainRectRef = createRef<Rect>()

    let scale = 300
    view.add(
        <>
            <Rect
                ref={firstArrayCircle}
                fill={'orange'}
                radius={scale}
                position={[-600, 900]}
                justifyContent={'center'}
                size={scale * 2}
            >
                <Txt
                    ref={firstArrayText}
                    shadowOffset={[-6, 6]}
                    shadowBlur={10}
                    shadowColor={'rgba(0,0,0,0.38)'}
                    text={"[]{one, two, three,\n four, five, six}"}/>

            </Rect>
            <Rect
                ref={secondArrayCircle}
                fill={'lightgreen'}
                radius={scale}
                position={[600, 900]}
                justifyContent={'center'}
                size={scale * 2}
            >
                <Txt ref={secondArrayText}
                     shadowOffset={[-6, 6]}
                     shadowBlur={10}
                     shadowColor={'rgba(0,0,0,0.38)'}
                     text={"[]{one, red, three,\n green, black six}"}/>

            </Rect>
            <Txt
                position={[0, 100]}
                opacity={0}
                ref={completeText}
                shadowOffset={[-6, 6]}
                shadowBlur={10}
                shadowColor={'rgba(0,0,0,0.38)'}
            />
            <Rect layout
                  opacity={0}
                  ref={mainRectRef}
                  fill={'#5E4335'}
                  padding={[20, 20, 10, 20]}
                  position={[0, -200]}
                  radius={20}
                  shadowOffset={[-6, 6]}
                  shadowBlur={10}
                  shadowColor={'rgba(0,0,0,0.38)'}>
                <CodeBlock language="c#"
                           ref={mainCodeRef}
                           code={'var newList = first.Concat(second)'}/>
            </Rect>

        </>
    )

    yield secondArrayCircle().position([600, 100], 1, easeOutBack)
    yield* firstArrayCircle().position([-600, 100], 1, easeOutBack)

    yield* waitUntil("concat circles method")

    yield firstArrayCircle().position([-300, 100], 4)
    yield secondArrayCircle().position([300, 100], 4)

    yield* mainRectRef().opacity(1, 2)

    yield firstArrayCircle().radius([200, 0, 0, 200], 4)
    yield* secondArrayCircle().radius([0, 200, 200, 0], 4)

    yield firstArrayCircle().fill(Color.lerp('orange', 'lightgreen', .5), 3)
    yield secondArrayCircle().fill(Color.lerp('orange', 'lightgreen', .5), 3)

    yield firstArrayText().opacity(0, 1)
    yield secondArrayText().opacity(0, 1)
    yield completeText().text("[]{one, two, three, one, red, three\n four, five, six, green, black six}", 0)
    yield* completeText().opacity(1, 3)

    yield* waitUntil("circles concat")

    yield* completeText().opacity(0, 1)
    yield firstArrayText().opacity(1, 1)
    yield secondArrayText().opacity(1, 1)

    yield firstArrayCircle().radius(scale, 2)
    yield secondArrayCircle().radius(scale, 2)


    yield firstArrayCircle().fill(Color.lerp('orange', 'lightgreen', 0), 2)
    yield secondArrayCircle().fill(Color.lerp('orange', 'lightgreen', 1), 2)

    yield secondArrayCircle().position([600, 100], 3, easeOutBack)
    yield* firstArrayCircle().position([-600, 100], 3, easeOutBack)


    yield* sequence(
        .2,
        all(concatRectRef().position([800 * -1, -400], 2),
            concatRectRef().opacity(.1, 2),),
        all(intersectRectRef().opacity(1, 2),
            intersectRectRef().position([800 * 0, -400], 2),),
        all(exceptRectRef().opacity(.1, 2),
            exceptRectRef().position([800 * 1, -400], 2),),
        all(unionRectRef().opacity(.1, 2),
            unionRectRef().position([800 * 2, -400], 2),),
    )

    yield* waitUntil("intersect circles method")


    yield mainCodeRef().edit(2)`var newList = first${edit('.Concat', '.Intersect')}(second)`
    yield firstArrayCircle().position([-180, 100], 4)
    yield* secondArrayCircle().position([180, 100], 4)

    yield firstArrayText().opacity(0, 1)
    yield* secondArrayText().opacity(0, 1)
    
    yield* secondArrayCircle().compositeOperation('difference',2)

    yield completeText().text("[]{one, two, three, one, red, three\n four, five, six, green, black six}", 0)
    
    yield* completeText().opacity(1, 3)
    yield mainCodeRef().selection(DEFAULT,1)

    yield* waitUntil("circles intersect")
})