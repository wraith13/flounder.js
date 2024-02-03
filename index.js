var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("config", [], {
    "defaultSpotIntervalSize": 24,
    "defaultBlur": 0.0,
    "defaultMaximumFractionDigits": 4
});
define("index", ["require", "exports", "config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.flounderStyle = void 0;
    config_json_1 = __importDefault(config_json_1);
    var flounderStyle;
    (function (flounderStyle) {
        flounderStyle.sin = function (rate) { return Math.sin(Math.PI * 2.0 * rate); };
        flounderStyle.cos = function (rate) { return Math.cos(Math.PI * 2.0 * rate); };
        flounderStyle.styleToStylePropertyList = function (style) {
            return Object.keys(style).map(function (key) { return ({ key: key, value: style[key], }); });
        };
        flounderStyle.setStyleProperty = function (element, style) {
            var current = element.style.getPropertyValue(style.key);
            if (current !== style.value) // for DOM rendering performance
             {
                if (undefined !== style.value) {
                    element.style.setProperty(style.key, style.value);
                }
                else {
                    element.style.removeProperty(style.key);
                }
            }
            return element;
        };
        flounderStyle.makeSureStyle = function (styleOrArguments) {
            return flounderStyle.isArguments(styleOrArguments) ? flounderStyle.makeStyle(styleOrArguments) : styleOrArguments;
        };
        flounderStyle.setStyle = function (element, styleOrArguments) {
            flounderStyle.styleToStylePropertyList(flounderStyle.makeSureStyle(styleOrArguments)).forEach(function (i) { return flounderStyle.setStyleProperty(element, i); });
            return element;
        };
        flounderStyle.stylePropertyToString = function (style) { var _a; return "".concat(style.key, ": ").concat((_a = style.value) !== null && _a !== void 0 ? _a : "inherit", ";"); };
        flounderStyle.styleToString = function (styleOrArguments, separator) {
            if (separator === void 0) { separator = " "; }
            return flounderStyle.styleToStylePropertyList(flounderStyle.makeSureStyle(styleOrArguments))
                .filter(function (i) { return undefined !== i.value; })
                .map(function (i) { return flounderStyle.stylePropertyToString(i); })
                .join(separator);
        };
        flounderStyle.isArguments = function (value) {
            return null !== value &&
                "object" === typeof value &&
                "type" in value && "string" === typeof value.type &&
                "foregroundColor" in value && "string" === typeof value.foregroundColor &&
                "depth" in value && "number" === typeof value.depth;
        };
        flounderStyle.getPatternType = function (data) { var _a; return (_a = data.type) !== null && _a !== void 0 ? _a : "trispot"; };
        flounderStyle.getLayoutAngle = function (data) {
            var _a;
            if ("number" === typeof data.layoutAngle) {
                if (0 === data.layoutAngle) {
                    return "regular";
                }
                else {
                    throw new Error("When using ".concat(data.type, ", number cannot be used for layoutAngle."));
                }
            }
            if (undefined !== data.anglePerDepth && null !== data.anglePerDepth && 0 !== data.anglePerDepth) {
                throw new Error("anglePerDepth cannot be used when using ".concat(data.type, "."));
            }
            return (_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular";
        };
        flounderStyle.getActualLayoutAngle = function (data) {
            var _a;
            return "number" === typeof data.layoutAngle ? data.layoutAngle :
                "regular" === ((_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular") ? 0.0 :
                    "stripe" === data.type ? 0.25 :
                        "diline" === data.type ? 0.125 :
                            "triline" === data.type ? 0.25 :
                                0.5;
        };
        flounderStyle.getAutoAnglePerDepth = function (data) {
            return "stripe" === flounderStyle.getPatternType(data) ? (1.0 / 2.0) :
                "diline" === flounderStyle.getPatternType(data) ? (1.0 / 4.0) :
                    "triline" === flounderStyle.getPatternType(data) ? (1.0 / 6.0) :
                        1.0;
        };
        flounderStyle.getActualAnglePerDepth = function (data) {
            return "number" === typeof data.anglePerDepth ? data.anglePerDepth :
                "auto" === data.anglePerDepth ? flounderStyle.getAutoAnglePerDepth(data) :
                    "-auto" === data.anglePerDepth ? -flounderStyle.getAutoAnglePerDepth(data) :
                        0.0;
        };
        flounderStyle.getAngleOffsetByDepth = function (data) {
            return flounderStyle.getActualAnglePerDepth(data) * data.depth;
        };
        flounderStyle.getAngleOffset = function (data) {
            return flounderStyle.getActualLayoutAngle(data) + flounderStyle.getAngleOffsetByDepth(data);
        };
        flounderStyle.getBackgroundColor = function (data) { var _a; return (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent"; };
        flounderStyle.getIntervalSize = function (data) { var _a; return (_a = data.intervalSize) !== null && _a !== void 0 ? _a : config_json_1.default.defaultSpotIntervalSize; };
        flounderStyle.getBlur = function (data) { var _a; return (_a = data.blur) !== null && _a !== void 0 ? _a : config_json_1.default.defaultBlur; };
        flounderStyle.getActualReverseRate = function (data) {
            return "number" === typeof data.reverseRate ? data.reverseRate :
                ("auto" === data.reverseRate && "trispot" === flounderStyle.getPatternType(data)) ? triPatternHalfRadiusSpotArea :
                    ("auto" === data.reverseRate && "tetraspot" === flounderStyle.getPatternType(data)) ? TetraPatternHalfRadiusSpotArea :
                        ("auto" === data.reverseRate && "stripe" === flounderStyle.getPatternType(data)) ? 0.0 :
                            ("auto" === data.reverseRate && "diline" === flounderStyle.getPatternType(data)) ? 0.0 :
                                ("auto" === data.reverseRate && "triline" === flounderStyle.getPatternType(data)) ? 0.0 :
                                    999;
        };
        flounderStyle.getAbsoulteReverseRate = function (data) {
            return "number" === typeof data.reverseRate && data.reverseRate < 0.0 ? Math.abs(data.reverseRate) :
                "-auto" === data.reverseRate ? "auto" :
                    data.reverseRate;
        };
        var numberToString = function (data, value) { var _a; return value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: (_a = data.maximumFractionDigits) !== null && _a !== void 0 ? _a : config_json_1.default.defaultMaximumFractionDigits, }); };
        var makeResult = function (_a) {
            var _b = _a.backgroundColor, backgroundColor = _b === void 0 ? undefined : _b, _c = _a.backgroundImage, backgroundImage = _c === void 0 ? undefined : _c, _d = _a.backgroundSize, backgroundSize = _d === void 0 ? undefined : _d, _e = _a.backgroundPosition, backgroundPosition = _e === void 0 ? undefined : _e;
            return ({
                "background-color": backgroundColor,
                "background-image": backgroundImage,
                "background-size": backgroundSize,
                "background-position": backgroundPosition,
            });
        };
        var makeAxis = function (data, value) {
            return "calc(".concat(numberToString(data, value), "px + 50%)");
        };
        var makeOffsetAxis = function (data, offset, value) {
            return makeAxis(data, value + offset);
        };
        var makeOffsetPosition = function (data, x, y) { var _a, _b; return "".concat(makeOffsetAxis(data, (_a = data.offsetX) !== null && _a !== void 0 ? _a : 0.0, x), " ").concat(makeOffsetAxis(data, (_b = data.offsetY) !== null && _b !== void 0 ? _b : 0.0, y)); };
        flounderStyle.makeStyle = function (data) {
            switch (flounderStyle.getPatternType(data)) {
                case "trispot":
                    return flounderStyle.makeTrispotStyle(data);
                case "tetraspot":
                    return flounderStyle.makeTetraspotStyle(data);
                case "stripe":
                    return flounderStyle.makeStripeStyle(data);
                case "diline":
                    return flounderStyle.makeDilineStyle(data);
                case "triline":
                    return flounderStyle.makeTrilineStyle(data);
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        var makeRadialGradientString = function (data, radius, blur) {
            if (blur === void 0) { blur = Math.min(radius, flounderStyle.getBlur(data)) / 0.5; }
            return "radial-gradient(circle at center, ".concat(data.foregroundColor, " ").concat(numberToString(data, radius - blur), "px, transparent ").concat(numberToString(data, radius + blur), "px)");
        };
        var makeLinearGradientString = function (data, radius, intervalSize, angle, blur) {
            var _a, _b;
            if (blur === void 0) { blur = Math.min(intervalSize - radius, radius, flounderStyle.getBlur(data)) / 0.5; }
            var deg = numberToString(data, 360.0 * angle);
            var offset = undefined === data.offsetX && undefined === data.offsetY ?
                0 : flounderStyle.sin(angle) * ((_a = data.offsetX) !== null && _a !== void 0 ? _a : 0.0) - flounderStyle.cos(angle) * ((_b = data.offsetY) !== null && _b !== void 0 ? _b : 0.0);
            var patternStart = 0 + offset;
            var a = Math.max(0, radius - blur) + offset;
            var b = Math.min(intervalSize * 0.5, radius + blur) + offset;
            var c = Math.max(intervalSize * 0.5, intervalSize - radius - blur) + offset;
            var d = Math.min(intervalSize, intervalSize - radius + blur) + offset;
            var patternEnd = intervalSize + offset;
            return "repeating-linear-gradient(".concat(deg, "deg, ").concat(data.foregroundColor, " ").concat(makeAxis(data, patternStart), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, a), ", transparent ").concat(makeAxis(data, b), ", transparent ").concat(makeAxis(data, c), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, d), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, patternEnd), ")");
        };
        var root2 = Math.sqrt(2.0);
        var root3 = Math.sqrt(3.0);
        var triPatternHalfRadiusSpotArea = Math.PI / (2 * root3);
        var TetraPatternHalfRadiusSpotArea = Math.PI / 4;
        flounderStyle.makePlainStyleOrNull = function (data) {
            var _a;
            if (data.depth <= 0.0) {
                return makeResult({ backgroundColor: (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent" });
            }
            else if (1.0 <= data.depth) {
                return makeResult({ backgroundColor: data.foregroundColor });
            }
            else {
                return null;
            }
        };
        var calculateMaxPatternSize = function (data, intervalSize, radius) {
            if (undefined !== data.maxPatternSize && data.maxPatternSize < radius) {
                intervalSize = intervalSize * data.maxPatternSize / radius;
                radius = data.maxPatternSize;
            }
            return { intervalSize: intervalSize, radius: radius, };
        };
        var calculateSpotSize = function (data, halfRadiusSpotArea, maxRadiusRate) {
            var radius;
            var intervalSize = flounderStyle.getIntervalSize(data);
            if (data.depth <= halfRadiusSpotArea) {
                radius = Math.sqrt(data.depth / halfRadiusSpotArea) * (intervalSize * 0.5);
            }
            else {
                var minRadius = intervalSize * 0.5;
                var maxRadius = intervalSize * maxRadiusRate;
                var MaxRadiusWidth = maxRadius - minRadius;
                var minAreaRate = 1.0 - Math.sqrt(1.0 - halfRadiusSpotArea);
                var maxAreaRate = 1.0;
                var maxAreaRateWidth = minAreaRate - maxAreaRate;
                var areaRate = 1.0 - Math.sqrt(1.0 - data.depth);
                var areaRateWidth = areaRate - minAreaRate;
                radius = minRadius + (MaxRadiusWidth * Math.pow(areaRateWidth / maxAreaRateWidth, 2));
            }
            return calculateMaxPatternSize(data, intervalSize, radius);
        };
        var calculatePatternSize = function (data) {
            switch (flounderStyle.getPatternType(data)) {
                case "trispot":
                    return calculateSpotSize(data, triPatternHalfRadiusSpotArea, 1.0 / root3);
                case "tetraspot":
                    return calculateSpotSize(data, TetraPatternHalfRadiusSpotArea, 0.5 * root2);
                case "stripe":
                    return calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), data.depth * (flounderStyle.getIntervalSize(data) / 2.0));
                case "diline":
                    return calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (flounderStyle.getIntervalSize(data) / 2.0));
                case "triline":
                    return calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (flounderStyle.getIntervalSize(data) / 3.0));
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        flounderStyle.simpleStructuredClone = (function (value) {
            if (undefined !== value && null !== value) {
                if (Array.isArray(value)) {
                    return value.map(function (i) { return flounderStyle.simpleStructuredClone(i); });
                }
                if ("object" === typeof value) {
                    var result_1 = {};
                    Object.keys(value).forEach(function (key) { return result_1[key] = flounderStyle.simpleStructuredClone(value[key]); });
                    return result_1;
                }
            }
            return value;
        });
        flounderStyle.reverseArguments = function (data) {
            var result = flounderStyle.simpleStructuredClone(data);
            result.foregroundColor = flounderStyle.getBackgroundColor(data);
            result.backgroundColor = data.foregroundColor;
            if ("number" === typeof data.layoutAngle) {
                result.layoutAngle = flounderStyle.getActualLayoutAngle(data) + flounderStyle.getActualAnglePerDepth(data);
            }
            result.depth = 1.0 - data.depth;
            delete result.reverseRate;
            if ("number" === typeof data.anglePerDepth) {
                result.anglePerDepth = -data.anglePerDepth;
            }
            else if ("auto" === data.anglePerDepth) {
                result.anglePerDepth = "-auto";
            }
            else if ("-auto" === data.anglePerDepth) {
                result.anglePerDepth = "auto";
            }
            return result;
        };
        var makeStyleCommon = function (data, maker) {
            if ("transparent" === data.foregroundColor) {
                throw new Error("foregroundColor must be other than \"transparent\".");
            }
            var plain = flounderStyle.makePlainStyleOrNull(data);
            if (null !== plain) {
                return plain;
            }
            var reverseRate = flounderStyle.getAbsoulteReverseRate(data);
            if (reverseRate !== data.reverseRate) {
                if ("transparent" === flounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                var absoulteData = flounderStyle.reverseArguments(data);
                absoulteData.reverseRate = reverseRate;
                return maker(absoulteData);
            }
            else if (flounderStyle.getActualReverseRate(data) < data.depth) {
                if ("transparent" === flounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                return maker(flounderStyle.reverseArguments(data));
            }
            else {
                return maker(data);
            }
        };
        flounderStyle.makeTrispotStyle = function (data) { return makeStyleCommon(data, function (data) {
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var backgroundImage = Array.from({ length: 4 }).map(function (_) { return radialGradient; }).join(", ");
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // horizontal
                    {
                        var xUnit = intervalSize * 2.0;
                        var yUnit = intervalSize * root3;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, intervalSize, 0), ", ").concat(makeOffsetPosition(data, intervalSize * 0.5, intervalSize * root3 * 0.5), ", ").concat(makeOffsetPosition(data, intervalSize * 1.5, intervalSize * root3 * 0.5)),
                        });
                    }
                case "alternative": // vertical
                    {
                        var xUnit = intervalSize * root3;
                        var yUnit = intervalSize * 2.0;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, 0, intervalSize), ", ").concat(makeOffsetPosition(data, intervalSize * root3 * 0.5, intervalSize * 0.5), ", ").concat(makeOffsetPosition(data, intervalSize * root3 * 0.5, intervalSize * 1.5)),
                        });
                    }
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        flounderStyle.makeTetraspotStyle = function (data) { return makeStyleCommon(data, function (data) {
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // straight
                    {
                        var xUnit = intervalSize;
                        var yUnit = intervalSize;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: radialGradient,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: makeOffsetPosition(data, 0, 0),
                        });
                    }
                case "alternative": // slant
                    {
                        var xUnit = (intervalSize * 2.0) / root2;
                        var yUnit = (intervalSize * 2.0) / root2;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: Array.from({ length: 2 }).map(function (_) { return radialGradient; }).join(", "),
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, intervalSize / root2, intervalSize / root2)),
                        });
                    }
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        flounderStyle.makeStripeStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                angleOffset % 1.0,
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        flounderStyle.makeDilineStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                ((0.0 / 4.0) + angleOffset) % 1.0,
                ((1.0 / 4.0) + angleOffset) % 1.0
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        flounderStyle.makeTrilineStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                ((0.0 / 6.0) + angleOffset) % 1.0,
                ((1.0 / 6.0) + angleOffset) % 1.0,
                ((2.0 / 6.0) + angleOffset) % 1.0
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        flounderStyle.calculateOffsetCoefficient = function (data) {
            var _a, _b, _c, _d, _e, _f;
            var makeResult = function (x, y, isMustUseBoth) {
                var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
                return { x: x, y: y, isMustUseBoth: isMustUseBoth, intervalSize: intervalSize, radius: radius, };
            };
            switch (data.type) {
                case "trispot":
                    switch ((_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular") {
                        case "regular":
                            return makeResult(2.0, 2.0 * root3, false);
                        case "alternative":
                            return makeResult(2.0 * root3, 2.0, false);
                    }
                    break;
                case "tetraspot":
                    switch ((_b = data.layoutAngle) !== null && _b !== void 0 ? _b : "regular") {
                        case "regular":
                            return makeResult(1.0, 1.0, false);
                        case "alternative":
                            return makeResult(root2, root2, false);
                    }
                    break;
                case "stripe":
                    {
                        var angleOffset = flounderStyle.getAngleOffset(data);
                        return makeResult(1.0 * flounderStyle.sin(angleOffset), -1.0 * flounderStyle.cos(angleOffset), true);
                    }
                    break;
                case "diline":
                    {
                        if (0 === ((_c = data.anglePerDepth) !== null && _c !== void 0 ? _c : 0)) {
                            switch ((_d = data.layoutAngle) !== null && _d !== void 0 ? _d : "regular") {
                                case "regular":
                                    return makeResult(1.0, 1.0, false);
                                case "alternative":
                                    return makeResult(root2, root2, false);
                            }
                        }
                        var angleOffset = flounderStyle.getAngleOffset(data);
                        return makeResult(1.0 * flounderStyle.cos(angleOffset), 1.0 * flounderStyle.sin(angleOffset), true);
                    }
                case "triline":
                    {
                        if (0 === ((_e = data.anglePerDepth) !== null && _e !== void 0 ? _e : 0)) {
                            switch ((_f = data.layoutAngle) !== null && _f !== void 0 ? _f : "regular") {
                                case "regular":
                                    return makeResult(2.0 / root3, 2.0, false);
                                case "alternative":
                                    return makeResult(2.0, 2.0 / root3, false);
                            }
                        }
                        var angleOffset = flounderStyle.getAngleOffset(data);
                        return makeResult((2.0 / root3) * flounderStyle.cos(angleOffset), (2.0 / root3) * flounderStyle.sin(angleOffset), true);
                    }
            }
            return makeResult(0.0, 0.0, false);
        };
    })(flounderStyle || (exports.flounderStyle = flounderStyle = {}));
});
//# sourceMappingURL=index.js.map