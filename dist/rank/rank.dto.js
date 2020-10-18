"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankDTO = void 0;
const class_validator_1 = require("class-validator");
const interfaces_1 = require("src/interfaces");
let RankDTO = (() => {
    var _a;
    class RankDTO {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", typeof (_a = typeof interfaces_1.RankName !== "undefined" && interfaces_1.RankName) === "function" ? _a : Object)
    ], RankDTO.prototype, "rank", void 0);
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], RankDTO.prototype, "ids", void 0);
    return RankDTO;
})();
exports.RankDTO = RankDTO;
//# sourceMappingURL=rank.dto.js.map