"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const import_data = () => {
    const tours = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '/app-doc/tours.json'), 'utf-8'));
    console.log(tours);
};
import_data();
//# sourceMappingURL=import-dev-data.js.map