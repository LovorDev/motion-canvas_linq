import {makeScene2D, View2D} from "@motion-canvas/2d";
import {Rect, Txt,} from "@motion-canvas/2d/lib/components";
import {all, sequence, waitUntil} from "@motion-canvas/core/lib/flow";
import {createRef, makeRef, range, Reference, useRandom} from "@motion-canvas/core/lib/utils";
import {createSignal, DEFAULT} from "@motion-canvas/core/lib/signals";
import {easeInQuad} from "@motion-canvas/core/lib/tweening";
import {CodeBlock, edit, insert, remove} from "@motion-canvas/2d/lib/components/CodeBlock";
import {Enemy} from "./Enemy";
import {Random} from "@motion-canvas/core";


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
    let allCircles: Enemy[] = new Array(circlesCount);

    const rect = createRef<Rect>()
    const firstText = createSignal("");


    const secondText = createSignal("");
    range(circlesCount).map((pos, i) => (
        <Enemy 
            clip
            backgroundColor={GRAY}
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
        </Enemy>
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
    
    yield* namePresenter(view,redEnemiesArrayText);
    
    yield* selectMethod(view);

    yield* waitUntil('health change');

    yield* firstMethod(view, allCircles,random);
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

function* firstMethod(view: View2D, allCircles: Enemy[], random: Random) {
    const codeRef = createRef<CodeBlock>();

    yield* all( ...allCircles.map((c)=> c.health(random.nextInt(0, c.height()),4)));
    let code =`var damagedEnemy = enemies.Where(enemy => enemy.HealthPercent < 0.25f);`;
    
    
    yield view.add(
        <CodeBlock language="c#" ref={codeRef} code={`${code}`}/>
    );

    yield* waitUntil('where health');
    
    yield* codeRef().fontSize(40,1);
    
    yield* codeRef().edit(2)`var damagedEnemy = enemies.Where(enemy => enemy.HealthPercent < 0.25f)${insert('.ToList()[0]')};`

    yield* waitUntil('first [0] where health');
    
    yield* codeRef().edit(2)`var damagedEnemy = enemies.Where(enemy => enemy.HealthPercent < 0.25f)${edit('.ToList()[0]','.First()')};`

    yield* waitUntil('first where health');

    yield* codeRef().edit(3)`var damagedEnemy = enemies${edit('.Where','.First')}(enemy => enemy.HealthPercent < 0.25f)${remove('.First()')};`

    yield* codeRef().selection(DEFAULT,1);
    
    yield* waitUntil('first health');

    yield* all( ...allCircles.map((c)=> c.health(random.nextInt(0, c.height()*.5),4)));
    
    yield* waitUntil('increase health');

    yield* codeRef().edit(3)`var damagedEnemy = enemies${edit('.First','.FirstOrDefault')}(enemy => enemy.HealthPercent < 0.25f)${remove('.First()')};`
    
    yield* waitUntil('firstOrDefault health');


    yield* codeRef().edit(3)`var damagedEnemy = enemies${edit('.FirstOrDefault','.LastOrDefault')}(enemy => enemy.HealthPercent < 0.25f);`
    yield* codeRef().edit(3)`var damagedEnemy = enemies${edit('.LastOrDefault','.Last')}(enemy => enemy.HealthPercent < 0.25f);`

    yield* waitUntil('last');
    yield* codeRef().edit(3)`var ${edit('damagedEnemy','lastEnemy')} = enemies${insert('[enemies.Length - 1]')}${remove('.Last(enemy => enemy.HealthPercent < 0.25f);')}`
    yield* codeRef().edit(3)`var lastEnemy = enemies${edit('[enemies.Length - 1]','.Last()')}`
    yield* waitUntil('last only');

    yield* codeRef().edit(2)`${remove('var lastEnemy = enemies.Last()')}`;


    yield* codeRef().edit(1)`${insert('var damagedEnemy = enemies.FirstOrDefault(enemy => enemy.HealthPercent < 0.25f)')}`;
    
    yield* waitUntil('has enemy');
    
    yield* codeRef().edit(2)`var ${edit('damagedEnemy','hasDamaged')} = enemies.${insert('\n    ')}FirstOrDefault(enemy => enemy.HealthPercent < 0.25f)${insert(' is not null;')}`;

    yield* waitUntil('is null only');
    
    
}

function* selectMethod(view: View2D){
    const codeRef = createRef<CodeBlock>();

    let code =`
var enemyNames = new List<\string>();
    
foreach (var enemy in enemies)
{
    enemyNames.Add(enemy.Name);
}`;
    yield view.add(
            <CodeBlock language="c#" ref={codeRef} code={`${code}`} fontSize={40}/>
    );


    yield* waitUntil('foreach select');
    
    yield* codeRef().selection([[[0, 4], [0, 15]], [[2, 13], [2, 18]],[[4, 24], [4, 29]]], 1);
    
    yield* waitUntil('select name');
    
    yield* codeRef().edit(2)`
var enemyNames = ${edit('new List<\string>();','enemies.')}${edit('\n\nforeach (var enemy in enemies)\n{','Select(enemy => ')}${edit('\n    enemyNames.Add(enemy.Name);\n}','enemy.Name)')}`

    yield* waitUntil('convertToLinq');

    yield* codeRef().edit(2)`var enemyNames = enemies.Select(enemy => enemy${edit('.Name','.Color')})`
    yield* codeRef().edit(2)`var enemyNames = enemies.Select(enemy => enemy${edit('.Color','.transform.position')})`

    yield* waitUntil('change property');

    yield* codeRef().edit(2)`var enemyNames = enemies.Select(enemy => ${edit('enemy.transform.position','new Enemy("Clone of: " + enemy.Name)')})`
    
    yield* waitUntil('change new object');
    codeRef().remove()
}


function* namePresenter(view: View2D, redEnemiesArrayText: Reference<Txt>){
    const codeRef = createRef<CodeBlock>();
    const presentedCode = createRef<CodeBlock>();
    const rect = createRef<Rect>()
    let code = `
    class Enemy
    {
        public Color Color { get; }
    }`;    
    
    let presenterRaw = `
public class EnemyPresenter : MonoBehaviour
{
    //some fields
    public void ShowEnemy()
    {
        //code for presenting
    }
}`;
    yield view.add(
        <Rect layout ref={rect}> 
            <CodeBlock language="c#" ref={codeRef} code={`${code}`} fontSize={40}/> 
            <CodeBlock language="c#" ref={presentedCode} fontSize={40} marginLeft={60}/> 
        </Rect>
    );


    yield* codeRef().edit(2)`    
    class Enemy
    {
        public Color Color { get; }
        ${insert('public string Name { get; }')}
    }`;

    yield redEnemiesArrayText().fill(DARK_RED,.2)
    yield redEnemiesArrayText().text('List<\string> enemyNames', 2)
    
    yield* waitUntil('new property name');
    
    yield codeRef().selection(DEFAULT,1);
    
    yield* presentedCode().edit(3)`${insert(presenterRaw)}`;
    
    yield* waitUntil('presenter');


    yield* presentedCode().edit(3)`
    
public class EnemyPresenter : MonoBehaviour
{
    //some fields
    public void ShowEnemy(${insert('List<\Enemy> enemies')})
    {
        //code for presenting
    }
}`;
    let bracer = '>'
    yield* waitUntil('all array');
    yield* presentedCode().edit(3)`
    
public class ${edit('Enemy','Names')}Presenter : MonoBehaviour
{
    //some fields
    public void ShowEnemy(List<${edit('\Enemy','\string')}${bracer} ${edit('enemies','names')})
    {
        //code for presenting
    }
}`;
    yield* waitUntil('string array');
    rect().remove()
    yield* waitUntil('remove');
}


function* whereMethod(view: View2D, allCircles: any[], targetSize: number) {
    const codeRef = createRef<CodeBlock>();


    yield* bounceCirclesChain(allCircles, targetSize);


    let code = `var redEnemies = new List<\Enemy>();

for (var i = 0; i < enemies.Length; i++)
{
    if (enemies[i].Color == Color.Red)
    {
        redEnemies.Add(enemies[i]);
    }
}`;
    let code2 = `var redEnemies = new List<\Enemy>();

foreach (var enemy in enemies)
{
    if (enemy.Color == Color.Red)
    {
        redEnemies.Add(enemy);
    }
}`;
    yield view.add(
        <CodeBlock language="c#" ref={codeRef} code={`${code}`}/>,
    );


    yield* waitUntil('for code block');

    yield* codeRef().edit(2)`
var redEnemies = new List<\Enemy>();

${edit('for (var i = 0; i < enemies.Length; i++)', 'foreach (var enemy in enemies)')}
{
    if (${edit('enemies[i]', 'enemy')}.Color == Color.Red)
    {
        redEnemies.Add(${edit('enemies[i]', 'enemy')});
    }
}`;

    yield* waitUntil('foreach code block');

    yield* codeRef().edit(2)`${edit(code2, 'var redEnemies = enemies.Where(enemy => enemy.Color == Color.Red);')}`;

    yield* waitUntil('where code block');

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('enemy => enemy.Color == Color.Red', 'Predicate')});`;

    yield* waitUntil('lambda code block');

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(Predicate);
    ${insert('\nbool Predicate(Enemy enemy)\n{\n    return enemy.Color == Color.Red;\n}')}`;

    yield* waitUntil('function code block');

    yield* codeRef().selection(DEFAULT, 1);

    yield* codeRef().selection([[[0, 31], [0, 40]]], 2)

    yield* codeRef().selection([[[0, 31], [0, 40]], [[4, 1], [4, 50]]], 1);


    yield* bounceCirclesChain(allCircles, targetSize);

    yield* waitUntil('predicate select code block');


    yield* codeRef().edit(1)`var redEnemies = enemies.Where(Predicate);
    ${remove('\nbool Predicate(Enemy enemy)\n{\n    return enemy.Color == Color.Red;\n}')}`;

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('Predicate', 'enemy => enemy.Color == Color.Red')});`;

    yield* waitUntil('remove predicate select code block');


    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('enemy => enemy.Color == Color.Red', '\n{\n    return enemy.Color == Color.Red;\n}')});`;

    yield* waitUntil('return code block');

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('\n{\n    return enemy.Color == Color.Red;\n}', 'enemy => enemy.Color == Color.Red')});`;

    yield* waitUntil('revert lambda code block');
    
    codeRef().remove();
}

function* bounceCirclesChain(allCircles: any[], targetSize: number) {
    yield sequence(
        0.1,
        ...allCircles.map((c, i) =>
            c.stroke(c.fill() == RED ? LIGHT : c.stroke(), .1),
        )
    )
    yield sequence(
        0.1,
        ...allCircles.map((c, i) =>
            c.size(targetSize * 1.3, .1).to(targetSize, .1),
        )
    )
}
