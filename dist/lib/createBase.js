"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBase = void 0;
var simple_git_1 = __importDefault(require("simple-git"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var logger_1 = __importDefault(require("./logger"));
var runCommandHelper_1 = require("../helper/runCommandHelper");
var node_process_1 = require("node:process");
var repo = "https://github.com/sandeep-6698/backend-smith-express";
var createBase = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var destination, git, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                destination = path_1.default.join(process.cwd(), name);
                // Check if the folder already exists
                if (!fs_1.default.existsSync(destination)) {
                    fs_1.default.mkdirSync(destination);
                    logger_1.default.info("Created: ".concat(name));
                }
                else {
                    logger_1.default.warn("Folder already exists: ".concat(name));
                    return [2 /*return*/];
                }
                git = (0, simple_git_1.default)();
                return [4 /*yield*/, git.clone(repo, destination)];
            case 1:
                _a.sent();
                logger_1.default.info("Application created");
                (0, node_process_1.chdir)(destination);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 6]);
                logger_1.default.info("Installing packages using pnpm...");
                return [4 /*yield*/, (0, runCommandHelper_1.runCommandHelper)("pnpm install")];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                error_1 = _a.sent();
                logger_1.default.info("Installing packages using pnpm failed");
                logger_1.default.info("Triying with npm...");
                return [4 /*yield*/, (0, runCommandHelper_1.runCommandHelper)("npm install")];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6:
                logger_1.default.info("Ready to use");
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                console.log(error_2);
                logger_1.default.error("Faile to setup repo");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createBase = createBase;
