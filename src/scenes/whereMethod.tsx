import {View2D} from "@motion-canvas/2d";
import {createRef} from "@motion-canvas/core/lib/utils";
import {CodeBlock, edit, insert, remove} from "@motion-canvas/2d/lib/components/CodeBlock";
import {sequence, waitUntil} from "@motion-canvas/core/lib/flow";
import {DEFAULT} from "@motion-canvas/core/lib/signals";
import enemies from "./enemies";

function* whereMethod(view: View2D, allCircles: any[], targetSize: number) {
    const codeRef = createRef<CodeBlock>();


    yield* bouncecircleschain(allCircles, targetSize);


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


    yield* bouncecircleschain(allCircles, targetSize);

    yield* waitUntil('predicate select code block');


    yield* codeRef().edit(1)`var redEnemies = enemies.Where(Predicate);
    ${remove('\nbool Predicate(Enemy enemy)\n{\n    return enemy.Color == Color.Red;\n}')}`;

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('Predicate', 'enemy => enemy.Color == Color.Red')});`;

    yield* waitUntil('predicate select code block');


    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('enemy => enemy.Color == Color.Red', '\n{\n    return enemy.Color == Color.Red;\n}')});`;

    yield* waitUntil('return code block');

    yield* codeRef().edit(2)`var redEnemies = enemies.Where(${edit('\n{\n    return enemy.Color == Color.Red;\n}', 'enemy => enemy.Color == Color.Red')});`;

    yield* waitUntil('revert lambda code block');

}

function* bouncecircleschain(allCircles: any[], targetSize: number) {
    yield sequence(
        0.1,
        ...allCircles.map((c, i) =>
            c.stroke(c.fill() == enemies.RED ? enemies.LIGHT : c.stroke(), .1),
        )
    )
    yield sequence(
        0.1,
        ...allCircles.map((c, i) =>
            c.size(targetSize * 1.3, .1).to(targetSize, .1),
        )
    )
}