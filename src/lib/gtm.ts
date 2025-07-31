declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "pageview",
      page: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "custom_event",
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
    });
  }
};

export const ecommerce = (data: any) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      ecommerce: data,
    });
  }
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "set_user_properties",
      user_properties: properties,
    });
  }
};

export const setCustomDimension = (dimension: string, value: string) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "set_custom_dimension",
      custom_dimension: {
        [dimension]: value,
      },
    });
  }
};
