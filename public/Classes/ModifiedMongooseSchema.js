"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifiedMongooseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ModifiedMongooseSchema extends mongoose_1.default.Schema {
    ObjectId;
    constructor(ObjectId) {
        super();
        this.ObjectId = ObjectId;
    }
}
exports.ModifiedMongooseSchema = ModifiedMongooseSchema;
//# sourceMappingURL=ModifiedMongooseSchema.js.map