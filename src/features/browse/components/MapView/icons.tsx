import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { TbBasket, TbEgg } from "react-icons/tb";

import { t } from "@/i18n/t";
import { easterColors } from "@/theme/tokens/colors";

const PIN_STYLE = [
  "display:flex",
  "align-items:center",
  "justify-content:center",
  "width:32px",
  "height:32px",
  "border-radius:50%",
  "border:2px solid #fff",
  "box-shadow:0 1px 4px rgba(0,0,0,0.4)",
].join(";");

function pinIcon(markup: string, background: string) {
  return L.divIcon({
    html: `<span style="${PIN_STYLE};background:${background}">${markup}</span>`,
    className: "map-pin-marker",
    iconSize: [32, 32],
  });
}

export const userLocationIcon = pinIcon(
  renderToStaticMarkup(
    <TbBasket title={t("map.userMarker.title")} size={18} color="#fff" />,
  ),
  easterColors.cornflower[500].value,
);

export const listingIcon = pinIcon(
  renderToStaticMarkup(
    <TbEgg title={t("map.listingMarker.title")} size={16} color="#fff" />,
  ),
  easterColors.coral[500].value,
);
