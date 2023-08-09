import {makeProject} from '@motion-canvas/core';

import enemies from "./scenes/enemies?scene";

import './global.css';
import enemiesName from "./scenes/enemiesName?scene"; // <- import the css
import testVoice from "./audio/test.mp3"

export default makeProject({
    scenes: [enemies, enemiesName],
    audio: testVoice
});
