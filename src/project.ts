import {makeProject} from '@motion-canvas/core';

import enemies from "./scenes/enemies?scene";

import './global.css'; // <- import the css

export default makeProject({
  scenes: [enemies],
});
