import {makeProject} from '@motion-canvas/core';

import enemies from "./scenes/enemies?scene";

import './global.css';
import enemiesName from "./scenes/enemiesName?scene"; // <- import the css

export default makeProject({
    scenes: [enemies, enemiesName]
});
