import {makeScene2D} from "@motion-canvas/2d";
import {all, sequence, waitUntil} from "@motion-canvas/core/lib/flow";
import {Color, DEFAULT, Direction, easeOutBack, slideTransition} from "@motion-canvas/core";
import {Rect, Txt,Circle} from "@motion-canvas/2d/lib/components";
import {CodeBlock, edit, insert} from "@motion-canvas/2d/lib/components/CodeBlock";
import {Colors} from "./utils";
import {createRef, Reference} from "@motion-canvas/core/lib/utils";

function* RevertCircles(completeText: Reference<Txt>, firstArrayText: Reference<Txt>, secondArrayText: Reference<Txt>, firstArrayCircle: Reference<Rect>, scale: number, secondArrayCircle: Reference<Rect>) {
    
    yield* completeText().opacity(0, 1)
    yield firstArrayText().opacity(1, 1)
    yield secondArrayText().opacity(1, 1)

    yield firstArrayCircle().radius(scale, 2)
    yield secondArrayCircle().radius(scale, 2)

    yield firstArrayCircle().fill(Color.lerp('orange', 'lightgreen', 0), 2)
    yield secondArrayCircle().fill(Color.lerp('orange', 'lightgreen', 1), 2)

    yield secondArrayCircle().position([600, 100], 3, easeOutBack)
    yield* firstArrayCircle().position([-600, 100], 3, easeOutBack)
}

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
    let intersectRef = createRef<Rect>()
    let secondArrayCircle = createRef<Rect>()

    let firstArrayText = createRef<Txt>()
    let secondArrayText = createRef<Txt>()

    let completeText = createRef<Txt>()
    let mainCodeRef = createRef<CodeBlock>()
    let mainRectRef = createRef<Rect>()

    let scale = 300
    view.add(
        <>

            {/*<Circle size={scale*2}*/}
            {/*        // fill={'#FFC66D'}*/}
            {/*        clip*/}
            {/*>*/}
            {/*    <Circle size={scale*2} position={[340,0]} fill={'white'}></Circle>*/}
            {/*    /!*<Circle size={scale*2} position={[-340,0]}></Circle>*!/*/}
            {/*</Circle>*/}

            <Rect
                ref={firstArrayCircle}
                fill={'orange'}
                radius={scale}
                position={[-600, 900]}
                justifyContent={'center'}
                size={scale * 2}
                clip
            >
                <Circle size={scale*2} position={[360,0]} fill={'#76d476'} opacity={0} ref={intersectRef}></Circle>
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
                     text={"[]{one, red, three,\n green, black, six}"}/>

            </Rect>
            <Txt
                fill={'white'}
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
    yield completeText().text("[]{one, two, three, four, five, six\n one, red, three, green, black, six}", 0)
    yield* completeText().opacity(1, 3)

    yield* waitUntil("circles concat")
    
    yield* RevertCircles(completeText, firstArrayText, secondArrayText, firstArrayCircle, scale, secondArrayCircle);

    yield* waitUntil("revert concat")
    
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

    yield secondArrayCircle().compositeOperation('color')

    yield mainCodeRef().edit(2)`var newList = first${edit('.Concat', '.Intersect')}(second)`
    yield firstArrayCircle().position([-180, 100], 6)
    yield* secondArrayCircle().position([180, 100], 6)
    
    yield firstArrayText().opacity(0, 1)
    yield* secondArrayText().opacity(0, 1)

    yield intersectRef().opacity(1)
    yield firstArrayCircle().fill("rgba(0,0,0,0)", 1)
    yield* secondArrayCircle().fill("rgba(0,0,0,0)", 1)
    
    yield completeText().text("[]{one, three, six}", 0)

    yield* completeText().opacity(1, 1)
    yield mainCodeRef().selection(DEFAULT, 1)

    yield* waitUntil("circles intersect")

    yield* intersectRef().opacity(0,1)
    yield* RevertCircles(completeText, firstArrayText, secondArrayText, firstArrayCircle, scale, secondArrayCircle);

    yield* waitUntil("revert intersect")
    
    yield* sequence(
        .2,
        all(concatRectRef().position([800 * -2, -400], 2),
            concatRectRef().opacity(.1, 2),),
        all(intersectRectRef().opacity(.1, 2),
            intersectRectRef().position([800 * -1, -400], 2),),
        all(exceptRectRef().opacity(1, 2),
            exceptRectRef().position([800 * 0, -400], 2),),
        all(unionRectRef().opacity(.1, 2),
            unionRectRef().position([800 * 1, -400], 2),),
    )
    
    yield* waitUntil("except circles method")

    yield mainCodeRef().edit(2)`var newList = first${edit('.Intersect', '.Except')}(second)`
    

    yield secondArrayCircle().compositeOperation('destination-out',4)
        
    yield firstArrayCircle().position([-180, 100], 6)
    yield* secondArrayCircle().position([180, 100], 6)

    yield firstArrayText().opacity(0, 1)
    yield secondArrayText().opacity(0, 1)
    
    yield* secondArrayCircle().fill('rgb(31,31,31)',1)

    yield completeText().text("[]{two, four, five}", 0)
    yield completeText().position([-270,100], 0)
    
    
    yield* completeText().opacity(1, 1)

    let offset = 340;
    yield completeText().position([-270-offset,100], 2)
    yield firstArrayCircle().position([-180-offset, 100], 2)
    yield* secondArrayCircle().position([180- offset, 100], 2)

    let exceptCodeRef = createRef<CodeBlock>();
    view.add(<CodeBlock position={[300,0]} opacity={0} ref={exceptCodeRef} code={`var exceptedList = names
        .Where(x => x != "Alex")`}/>)

    yield* exceptCodeRef().opacity(1,2)
    
    yield* waitUntil("where example except")

    yield* exceptCodeRef().edit(2)`var exceptedList = names
        .Where(x => x != "Alex"${insert(' && x != \"John\"')})`
    
    yield* waitUntil("where except 2")
    
    yield* exceptCodeRef().edit(2)`var exceptedList = names
        .Where(x => x != "Alex" && x != \"John\"${insert(' && x != \"Doe\"')})`
    
    yield* waitUntil("where except")

    yield* exceptCodeRef().edit(4)`var exceptedList = names
        ${edit('.Where(x => x != "Alex" && x != \"John\" && x != \"Doe\")','.Except(new[] {"Alex", "John", "Doe"})')}`
    
    yield* waitUntil("circles except")
    
    
    yield* exceptCodeRef().opacity(0,2)
    exceptCodeRef().remove()

    yield secondArrayCircle().compositeOperation('color',4)
    yield* RevertCircles(completeText, firstArrayText, secondArrayText, firstArrayCircle, scale, secondArrayCircle);
    
    yield* waitUntil("revert except")
    
    yield* sequence(
        .2,
        all(concatRectRef().position([800 * -3, -400], 2),
            concatRectRef().opacity(.1, 2),),
        all(intersectRectRef().opacity(.1, 2),
            intersectRectRef().position([800 * -2, -400], 2),),
        all(exceptRectRef().opacity(.1, 2),
            exceptRectRef().position([800 * -1, -400], 2),),
        all(unionRectRef().opacity(1, 2),
            unionRectRef().position([800 * 0, -400], 2),),
    )

    yield* waitUntil("union circles method")
    
    yield mainCodeRef().edit(2)`var newList = first${edit('.Except', '.Union')}(second)`

    yield secondArrayCircle().compositeOperation('darken')

    yield firstArrayCircle().fill(Color.lerp('orange', 'lightgreen', .5), 4)
    yield secondArrayCircle().fill(Color.lerp('orange', 'lightgreen', .5), 4)
    
    yield firstArrayCircle().position([-180, 100], 6)
    yield* secondArrayCircle().position([180, 100], 6)


    yield firstArrayText().opacity(0, 1)
    yield* secondArrayText().opacity(0, 1)

    yield completeText().position([0,100])
    yield completeText().text("[] {one, two, three, four,\nfive, six red, green, black}", 0)

    yield* completeText().opacity(1, 1)

    yield* waitUntil("circles union")

    yield* sequence(
        .2,
        all(unionRectRef().opacity(1, 2),
            unionRectRef().position([800 * 3, -400], 2),),
        all(exceptRectRef().opacity(1, 2),
            exceptRectRef().position([800 * 3, -400], 2),),
        all(intersectRectRef().opacity(1, 2),
            intersectRectRef().position([800 * 3, -400], 2),),
        all(concatRectRef().position([800 * 3, -400], 2),
            concatRectRef().opacity(1, 2),),
    )
})