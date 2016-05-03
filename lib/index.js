"use strict";
import { Router } from './Router';
export const Affront = {
	Router: new Router()

};

if (!window) window = {};
window.Affront = Affront;