import config from "./config.json";
export module flounderStyle
{
    export interface StyleKey
    {
        css: string;
        dom: string;
    }
    export type StyleValue = string | undefined;
    export type StyleProperty = { key: StyleKey; value: StyleValue; };
    export const setStyle = (element: HTMLElement, style: StyleProperty) =>
    {
        const current = element.style.getPropertyValue(style.key.dom);
        if (current !== style.value) // for DOM rendering performance
        {
            if (undefined !== style.value)
            {
                (element.style as any)[style.key.dom] = style.value;
            }
            else
            {
                element.style.removeProperty(style.key.dom);
            }
        }
    };
    export const setStyleList = (element: HTMLElement, styleList: StyleProperty[]) =>
    {
        styleList.forEach(i => setStyle(element, i));
        return element;
    }
    export const styleToString = (style: StyleProperty) => `${style.key.css}: ${style.value ?? "inherit"};`;
    export const styleListToString = (styleList: StyleProperty[], separator: string = " ") =>
        styleList.filter(i => undefined !== i.value).map(i => styleToString(i)).join(separator);
    export type FlounderType = "tri" | "tetra";
    export type Style = { key: StyleKey; value: StyleValue; };
    export type Color = string;
    export type LayoutAngle = "regular" | "alternative";
    export interface Arguments
    {
        type?: FlounderType;
        layoutAngle?: LayoutAngle;
        foregroundColor: Color;
        backgroundColor?: Color; // default is "transparent"
        spotIntervalSize?: number;
        depth: number; // must be 0.0 <= depth and depth <= 1.0
        blur?: number; // must be 0.0 <= blur
        maxSpotSize?: number; // must be 1 <= maxSpotSize and maxSpotSize <= (spotIntervalSize *0.5);
        reverseRate?: number | "auto"; // must be 0.0 <= depth and depth <= 1.0
        maximumFractionDigits?: number;
    }
    export const getPatternType = (data: Arguments): FlounderType => data.type ?? "tri";
    export const getLayoutAngle = (data: Arguments): LayoutAngle => data.layoutAngle ?? "regular";
    export const getBackgroundColor = (data: Arguments): Color => data.backgroundColor ?? "transparent";
    export const getBlur = (data: Arguments): number => data.blur ?? config.defaultBlur;
    export const getActualReverseRate = (data: Arguments): number =>
        "number" === typeof data.reverseRate ? data.reverseRate:
        ("auto" === data.reverseRate && "tri" === getPatternType(data)) ? triPatternHalfRadiusSpotArea:
        ("auto" === data.reverseRate && "tetra" === getPatternType(data)) ? TetraPatternHalfRadiusSpotArea:
        999;
    const numberToString = (data: Arguments, value: number) =>
        value.toLocaleString("en-US", { maximumFractionDigits: data.maximumFractionDigits ?? config.defaultMaximumFractionDigits, });
    const makeResult = ({ backgroundColor = undefined as StyleValue, backgroundImage = undefined as StyleValue, backgroundSize = undefined as StyleValue, backgroundPosition = undefined as StyleValue}): StyleProperty[] =>
    [
        { key: { css: "background-color", dom: "backgroundColor", }, value:backgroundColor, },
        { key: { css: "background-image", dom: "backgroundImage", }, value:backgroundImage, },
        { key: { css: "background-size", dom: "backgroundSize", }, value:backgroundSize, },
        { key: { css: "background-position", dom: "backgroundPosition", }, value:backgroundPosition, },
    ];
    export const makePatternStyleList = (data: Arguments): StyleProperty[] =>
    {
        switch(getPatternType(data))
        {
        case "tri":
            return makeTriPatternStyleList(data);
        case "tetra":
            return makeTetraPatternStyleList(data);
        default:
            throw new Error(`Unknown FlounderType: ${data.type}`);
        }
    };
    const makeRadialGradientString = (data: Arguments, radius: number, blur = Math.min(radius /0.5, getBlur(data)) /0.5) =>
        `radial-gradient(circle at center, ${data.foregroundColor} ${numberToString(data, radius -blur)}px, transparent ${numberToString(data, radius +blur)}px)`;
    const root2 = Math.sqrt(2.0);
    const root3 = Math.sqrt(3.0);
    const triPatternHalfRadiusSpotArea = Math.PI / (2 *root3);
    const TetraPatternHalfRadiusSpotArea = Math.PI / 4;
    export const makePlainStyleListOrNull = (data: Arguments): StyleProperty[] | null =>
    {
        if (data.depth <= 0.0)
        {
            return makeResult({ backgroundColor: data.backgroundColor ?? "transparent" });
        }
        else
        if (1.0 <= data.depth)
        {
            return makeResult({ backgroundColor: data.foregroundColor });
        }
        else
        {
            return null;
        }
    };
    const calculateSize = (data: Arguments, halfRadiusSpotArea: number, maxRadiusRate: number) =>
    {
        var radius: number;
        var spotIntervalSize = data.spotIntervalSize ?? config.defaultSpotIntervalSize;
        if (data.depth <= halfRadiusSpotArea)
        {
            radius = Math.sqrt(data.depth / halfRadiusSpotArea) *(spotIntervalSize *0.5);
        }
        else
        {
            const minRadius = spotIntervalSize *0.5;
            const maxRadius = spotIntervalSize *maxRadiusRate;
            const MaxRadiusWidth = maxRadius -minRadius;
            const minAreaRate = halfRadiusSpotArea;
            const maxAreaRate = 1.0;
            const maxAreaRateWidth = minAreaRate -maxAreaRate;
            const areaRate = data.depth;
            const areaRateWidth = areaRate -minAreaRate;
            const adjusterForReducePixelCollapseEffect = undefined === data.maxSpotSize ? 0.9: 0.7;
            radius = minRadius +(MaxRadiusWidth *Math.pow(areaRateWidth / maxAreaRateWidth, 2) *adjusterForReducePixelCollapseEffect);
        }
        if (undefined !== data.maxSpotSize && data.maxSpotSize < radius)
        {
            spotIntervalSize = spotIntervalSize *data.maxSpotSize /radius;
            radius = data.maxSpotSize;
        }
        return { radius, spotIntervalSize };
    };
    export const reverseArguments = (data: Arguments): Arguments =>
    {
        const result = structuredClone(data);
        result.foregroundColor = getBackgroundColor(data);
        result.backgroundColor = data.foregroundColor;
        result.depth = 1.0 -data.depth;
        delete result.reverseRate;
        return result;
    };
    export const makeTriPatternStyleList = (data: Arguments): StyleProperty[] =>
    {
        if ("transparent" === data.foregroundColor)
        {
            throw new Error(`foregroundColor must be other than "transparent".`);
        }
        const plain = makePlainStyleListOrNull(data);
        if (null !== plain)
        {
            return plain;
        }
        else
        if (getActualReverseRate(data) < data.depth)
        {
            if ("transparent" === getBackgroundColor(data))
            {
                throw new Error(`When using reverseRate, backgroundColor must be other than "transparent".`);
            }
            return makeTriPatternStyleList(reverseArguments(data));
        }
        else
        {
            const { radius, spotIntervalSize } = calculateSize(data, triPatternHalfRadiusSpotArea, 1.0 /root3);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const backgroundImage: StyleValue = Array.from({ length: 4 }).map(_ => radialGradient).join(", ");
            switch(getLayoutAngle(data))
            {
            case "regular": // horizontal
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: `${numberToString(data, spotIntervalSize *2.0)}px ${numberToString(data, spotIntervalSize *root3)}px`,
                    backgroundPosition: `0px 0px, ${numberToString(data, spotIntervalSize)}px 0px, ${numberToString(data, spotIntervalSize *0.5)}px ${numberToString(data, spotIntervalSize *root3 *0.5)}px, ${numberToString(data, spotIntervalSize *1.5)}px ${numberToString(data, spotIntervalSize * root3 * 0.5)}px`
                });
            case "alternative": // vertical
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: ` ${numberToString(data, spotIntervalSize *root3)}px ${numberToString(data, spotIntervalSize *2.0)}px`,
                    backgroundPosition: `0px 0px, 0px ${numberToString(data, spotIntervalSize)}px, ${numberToString(data, spotIntervalSize *root3 *0.5)}px ${numberToString(data, spotIntervalSize *0.5)}px, ${numberToString(data, spotIntervalSize *root3 *0.5)}px ${numberToString(data, spotIntervalSize *1.5)}px`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    };
    export const makeTetraPatternStyleList = (data: Arguments): StyleProperty[] =>
    {
        if ("transparent" === data.foregroundColor)
        {
            throw new Error(`foregroundColor must be other than "transparent".`);
        }
        const plain = makePlainStyleListOrNull(data);
        if (null !== plain)
        {
            return plain;
        }
        else
        if (getActualReverseRate(data) < data.depth)
        {
            if ("transparent" === getBackgroundColor(data))
            {
                throw new Error(`When using reverseRate, backgroundColor must be other than "transparent".`);
            }
            return makeTetraPatternStyleList(reverseArguments(data));
        }
        else
        {
            const { radius, spotIntervalSize } = calculateSize(data, TetraPatternHalfRadiusSpotArea, 0.5 *root2);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            switch(getLayoutAngle(data))
            {
            case "regular": // straight
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: radialGradient,
                    backgroundSize: `${numberToString(data, spotIntervalSize)}px ${numberToString(data, spotIntervalSize)}px`,
                });
            case "alternative": // slant
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: Array.from({ length: 2 }).map(_ => radialGradient).join(", "),
                    backgroundSize: `${numberToString(data, (spotIntervalSize *2.0) /root2)}px ${numberToString(data, (spotIntervalSize *2.0) /root2)}px`,
                    backgroundPosition: `0px 0px, ${numberToString(data, spotIntervalSize /root2)}px ${numberToString(data, spotIntervalSize /root2)}px`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    };
}
