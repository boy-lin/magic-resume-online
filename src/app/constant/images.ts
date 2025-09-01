import { StaticImageData } from "next/image";

import classic from "@/assets/images/template-cover/classic.jpg";
import modern from "@/assets/images/template-cover/modern.jpg";
import leftRight from "@/assets/images/template-cover/left-right.jpg";
import timeline from "@/assets/images/template-cover/timeline.jpg";
import twoColumn from "@/assets/images/template-cover/two-column.png";

export const templateImages: Record<string, StaticImageData> = {
  classic,
  modern,
  "left-right": leftRight,
  timeline,
  "two-column": twoColumn,
};
