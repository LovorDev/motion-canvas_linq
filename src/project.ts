import {makeProject} from '@motion-canvas/core';

import enemies from "./scenes/enemies?scene";

import './global.css';
import enemiesName from "./scenes/enemiesName?scene"; // <- import the css
import testVoice from "./audio/test.mp3"
import enumerations from "./scenes/enumerations?scene";

export default makeProject({
    scenes: [enemies, enemiesName,enumerations],
    audio: testVoice
});
