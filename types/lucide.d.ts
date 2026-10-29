declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        color?: string;
        strokeWidth?: string | number;
    }
    export type Icon = FC<IconProps>;
    export const MapPin: Icon;
    export const ChevronDown: Icon;
    export const X: Icon;
    export const MessageCircle: Icon;
    export const Eye: Icon;
    export const TrendingUp: Icon;
    export const PenLine: Icon;
    export const Menu: Icon;
    export const LogOut: Icon;
    export const User: Icon;
    export const ArrowLeft: Icon;
    export const Loader2: Icon;
    export const ImagePlus: Icon;
    export const Bold: Icon;
    export const Italic: Icon;
    export const Heading2: Icon;
    export const Quote: Icon;
    export const Map: Icon;
    export const Users: Icon;
    export const Tag: Icon;
    export const BookOpen: Icon;
    export const Link2: Icon;
    export const Clock: Icon;
    export const Check: Icon;
    export const Sparkles: Icon;
    export const Heart: Icon;
    export const Hand: Icon;
    export const MessageSquare: Icon;
    export const Megaphone: Icon;
    export const HeartHandshake: Icon;
    export const ShieldCheck: Icon;
    export const SlidersHorizontal: Icon;
    export const ArrowDownWideNarrow: Icon;
}
