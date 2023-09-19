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
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakasi = void 0;
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
/**
 * KAKASI - Kanji Kana Simple Inverter
 * @see https://github.com/loretoparisi/kakasi
 */
var kakasi = /** @class */ (function () {
    function kakasi(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.GetBinFolder = function (filename) {
            if (_this._options.pathDir == '') {
                var pathComponents = __dirname.split('/');
                _this._options.pathDir = pathComponents.slice(0, pathComponents.length).join('/');
            }
            var binpath = path.join(_this._options.pathDir, 'bin/', process.platform, filename);
            process.env.ITAIJIDICTPATH = path.join(_this._options.pathDir, 'data/itaijidict');
            process.env.KANWADICTPATH = path.join(_this._options.pathDir, 'data/kanwadict');
            if (fs.existsSync(binpath)) {
                // check local binary path
                return binpath;
            }
            return '';
        };
        this.mergeRecursive = function (obj1, obj2) {
            if (!obj2) {
                return obj1;
            }
            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if (obj2[p].constructor == Object) {
                        obj1[p] = _this.mergeRecursive(obj1[p], obj2[p]);
                    }
                    else {
                        obj1[p] = obj2[p];
                    }
                }
                catch (e) {
                    // Property in destination object not set; create it and set its value.
                    obj1[p] = obj2[p];
                }
            }
            return obj1;
        }; //mergeRecursive
        this._options = {
            pathDir: '',
            debug: false,
            bin: ''
        };
        this.mergeRecursive(this._options, options);
        if (!this._options.bin || this._options.bin == '') {
            this._options.bin = this.GetBinFolder('kakasi');
        }
    } //Kakasia
    kakasi.prototype.transliterate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var args;
                        args = ['-i', 'euc', '-Ha', '-Ka', '-Ja', '-Ea', '-ka', '-s', '-iutf8', '-outf8'];
                        var kakasi = (0, child_process_1.spawn)(self._options.bin, args, {});
                        args = [data];
                        var echo = (0, child_process_1.spawn)('echo', args, {});
                        echo.stdout.pipe(kakasi.stdin);
                        var res = '';
                        kakasi.stdout.on('data', function (_data) {
                            var data = new Buffer(_data, 'utf-8').toString();
                            res += data;
                        });
                        kakasi.stdout.on('end', function (_) {
                            return resolve(res);
                        });
                        kakasi.on('error', function (error) {
                            return reject(error);
                        });
                        if (self._options.debug)
                            kakasi.stdout.pipe(process.stdout);
                    })];
            });
        });
    }; //transliterate
    return kakasi;
}());
exports.kakasi = kakasi;
