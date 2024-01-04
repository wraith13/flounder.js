var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("config", [], {
    "defaultSpotIntervalSize": 24,
    "defaultBlur": 0.0,
    "defaultMaximumFractionDigits": 3
});
define("index", ["require", "exports", "config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.flounderStyle = void 0;
    config_json_1 = __importDefault(config_json_1);
    var flounderStyle;
    (function (flounderStyle) {
        flounderStyle.setStyle = function (element, style) {
            var current = element.style.getPropertyValue(style.key.dom);
            if (current !== style.value) // for DOM rendering performance
             {
                if (undefined !== style.value) {
                    element.style[style.key.dom] = style.value;
                }
                else {
                    element.style.removeProperty(style.key.dom);
                }
            }
            return element;
        };
        flounderStyle.setStyleList = function (element, styleList) {
            styleList.forEach(function (i) { return flounderStyle.setStyle(element, i); });
            return element;
        };
        flounderStyle.styleToString = function (style) { var _a; return "".concat(style.key.css, ": ").concat((_a = style.value) !== null && _a !== void 0 ? _a : "inherit", ";"); };
        flounderStyle.styleListToString = function (styleList, separator) {
            if (separator === void 0) { separator = " "; }
            return styleList.filter(function (i) { return undefined !== i.value; }).map(function (i) { return flounderStyle.styleToString(i); }).join(separator);
        };
        flounderStyle.getPatternType = function (data) { var _a; return (_a = data.type) !== null && _a !== void 0 ? _a : "trispot"; };
        flounderStyle.getLayoutAngle = function (data) {
            var _a;
            if ("number" === typeof data.layoutAngle) {
                throw new Error("When using ".concat(data.type, ", number cannot be used for layoutAngle."));
            }
            return (_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular";
        };
        flounderStyle.getActualLayoutAngle = function (data) {
            var _a;
            return "number" === typeof data.layoutAngle ? data.layoutAngle :
                ("regular" === ((_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular") ? 0.0 : ("diline" === data.type ? 0.125 : 0.25));
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
        var numberToString = function (data, value) { var _a; return value.toLocaleString("en-US", { maximumFractionDigits: (_a = data.maximumFractionDigits) !== null && _a !== void 0 ? _a : config_json_1.default.defaultMaximumFractionDigits, }); };
        var makeResult = function (_a) {
            var _b = _a.backgroundColor, backgroundColor = _b === void 0 ? undefined : _b, _c = _a.backgroundImage, backgroundImage = _c === void 0 ? undefined : _c, _d = _a.backgroundSize, backgroundSize = _d === void 0 ? undefined : _d, _e = _a.backgroundPosition, backgroundPosition = _e === void 0 ? undefined : _e;
            return [
                { key: { css: "background-color", dom: "backgroundColor", }, value: backgroundColor, },
                { key: { css: "background-image", dom: "backgroundImage", }, value: backgroundImage, },
                { key: { css: "background-size", dom: "backgroundSize", }, value: backgroundSize, },
                { key: { css: "background-position", dom: "backgroundPosition", }, value: backgroundPosition, },
            ];
        };
        flounderStyle.makePatternStyleList = function (data) {
            switch (flounderStyle.getPatternType(data)) {
                case "trispot":
                    return flounderStyle.makeTrispotStyleList(data);
                case "tetraspot":
                    return flounderStyle.makeTetraspotStyleList(data);
                case "stripe":
                    return flounderStyle.makeStripeStyleList(data);
                case "diline":
                    return flounderStyle.makeDilineStyleList(data);
                case "triline":
                    return flounderStyle.makeTrilineStyleList(data);
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        var makeRadialGradientString = function (data, radius, blur) {
            if (blur === void 0) { blur = Math.min(radius, flounderStyle.getBlur(data)) / 0.5; }
            return "radial-gradient(circle at center, ".concat(data.foregroundColor, " ").concat(numberToString(data, radius - blur), "px, transparent ").concat(numberToString(data, radius + blur), "px)");
        };
        var makeLinearGradientString = function (data, radius, intervalSize, angle, blur) {
            if (blur === void 0) { blur = Math.min(intervalSize - radius, radius, flounderStyle.getBlur(data)) / 0.5; }
            var deg = numberToString(data, 360.0 * angle);
            var patternStart = numberToString(data, 0);
            var a = numberToString(data, Math.max(0, radius - blur));
            var b = numberToString(data, Math.min(intervalSize * 0.5, radius + blur));
            var c = numberToString(data, Math.max(intervalSize * 0.5, intervalSize - radius - blur));
            var d = numberToString(data, Math.min(intervalSize, intervalSize - radius + blur));
            var patternEnd = numberToString(data, intervalSize);
            return "repeating-linear-gradient(".concat(deg, "deg, ").concat(data.foregroundColor, " calc(").concat(patternStart, "px + 50%), ").concat(data.foregroundColor, " calc(").concat(a, "px + 50%), transparent calc(").concat(b, "px + 50%), transparent calc(").concat(c, "px + 50%), ").concat(data.foregroundColor, " calc(").concat(d, "px + 50%), ").concat(data.foregroundColor, " calc(").concat(patternEnd, "px + 50%))");
        };
        var root2 = Math.sqrt(2.0);
        var root3 = Math.sqrt(3.0);
        var triPatternHalfRadiusSpotArea = Math.PI / (2 * root3);
        var TetraPatternHalfRadiusSpotArea = Math.PI / 4;
        flounderStyle.makePlainStyleListOrNull = function (data) {
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
        flounderStyle.reverseArguments = function (data) {
            var result = structuredClone(data);
            result.foregroundColor = flounderStyle.getBackgroundColor(data);
            result.backgroundColor = data.foregroundColor;
            result.depth = 1.0 - data.depth;
            delete result.reverseRate;
            return result;
        };
        var makeStyleListCommon = function (data, maker) {
            if ("transparent" === data.foregroundColor) {
                throw new Error("foregroundColor must be other than \"transparent\".");
            }
            var plain = flounderStyle.makePlainStyleListOrNull(data);
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
        flounderStyle.makeTrispotStyleList = function (data) { return makeStyleListCommon(data, function (data) {
            var _a = calculateSpotSize(data, triPatternHalfRadiusSpotArea, 1.0 / root3), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var backgroundImage = Array.from({ length: 4 }).map(function (_) { return radialGradient; }).join(", ");
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // horizontal
                    return makeResult({
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                        backgroundSize: "".concat(numberToString(data, intervalSize * 2.0), "px ").concat(numberToString(data, intervalSize * root3), "px"),
                        backgroundPosition: "0px 0px, ".concat(numberToString(data, intervalSize), "px 0px, ").concat(numberToString(data, intervalSize * 0.5), "px ").concat(numberToString(data, intervalSize * root3 * 0.5), "px, ").concat(numberToString(data, intervalSize * 1.5), "px ").concat(numberToString(data, intervalSize * root3 * 0.5), "px")
                    });
                case "alternative": // vertical
                    return makeResult({
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                        backgroundSize: " ".concat(numberToString(data, intervalSize * root3), "px ").concat(numberToString(data, intervalSize * 2.0), "px"),
                        backgroundPosition: "0px 0px, 0px ".concat(numberToString(data, intervalSize), "px, ").concat(numberToString(data, intervalSize * root3 * 0.5), "px ").concat(numberToString(data, intervalSize * 0.5), "px, ").concat(numberToString(data, intervalSize * root3 * 0.5), "px ").concat(numberToString(data, intervalSize * 1.5), "px")
                    });
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        flounderStyle.makeTetraspotStyleList = function (data) { return makeStyleListCommon(data, function (data) {
            var _a = calculateSpotSize(data, TetraPatternHalfRadiusSpotArea, 0.5 * root2), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // straight
                    return makeResult({
                        backgroundColor: backgroundColor,
                        backgroundImage: radialGradient,
                        backgroundSize: "".concat(numberToString(data, intervalSize), "px ").concat(numberToString(data, intervalSize), "px"),
                    });
                case "alternative": // slant
                    return makeResult({
                        backgroundColor: backgroundColor,
                        backgroundImage: Array.from({ length: 2 }).map(function (_) { return radialGradient; }).join(", "),
                        backgroundSize: "".concat(numberToString(data, (intervalSize * 2.0) / root2), "px ").concat(numberToString(data, (intervalSize * 2.0) / root2), "px"),
                        backgroundPosition: "0px 0px, ".concat(numberToString(data, intervalSize / root2), "px ").concat(numberToString(data, intervalSize / root2), "px")
                    });
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        flounderStyle.makeStripeStyleList = function (data) { return makeStyleListCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getActualLayoutAngle(data);
            var _a = calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), data.depth * (flounderStyle.getIntervalSize(data) / 2.0)), intervalSize = _a.intervalSize, radius = _a.radius;
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: makeLinearGradientString(data, radius, intervalSize, angleOffset)
            });
        }); };
        flounderStyle.makeDilineStyleList = function (data) { return makeStyleListCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getActualLayoutAngle(data);
            var _a = calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (flounderStyle.getIntervalSize(data) / 2.0)), intervalSize = _a.intervalSize, radius = _a.radius;
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: [
                    makeLinearGradientString(data, radius, intervalSize, (0.0 / 4.0) + angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (1.0 / 4.0) + angleOffset),
                ]
                    .join(", ")
            });
        }); };
        flounderStyle.makeTrilineStyleList = function (data) { return makeStyleListCommon(data, function (data) {
            var backgroundColor = flounderStyle.getBackgroundColor(data);
            var angleOffset = flounderStyle.getActualLayoutAngle(data);
            var _a = calculateMaxPatternSize(data, flounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (flounderStyle.getIntervalSize(data) / 3.0)), intervalSize = _a.intervalSize, radius = _a.radius;
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: [
                    makeLinearGradientString(data, radius, intervalSize, (0.0 / 6.0) + angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (1.0 / 6.0) + angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (2.0 / 6.0) + angleOffset),
                ]
                    .join(", ")
            });
        }); };
    })(flounderStyle || (exports.flounderStyle = flounderStyle = {}));
});
//# sourceMappingURL=index.js.map