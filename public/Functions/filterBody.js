"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBody = void 0;
exports.filterBody = (body, allwoedFileds) => {
    let newObj = {};
    Object.keys(body).forEach(el => {
        if (allwoedFileds.includes(el)) {
            newObj[el] = body[el];
        }
    });
    return newObj;
};
//# sourceMappingURL=filterBody.js.map