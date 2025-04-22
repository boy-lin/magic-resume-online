import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { filterValEqUndefined } from "@/utils";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .single();
  return userDetails;
});

export const updateUserInfoById = async (
  supabase: SupabaseClient,
  id,
  params
) => {
  return supabase
    .from("users")
    .update({
      full_name: params.fullName,
      avatar_url: params.avatarUrl,
    })
    .eq("id", id);
};

export const getResumesByUserId = cache(async (supabase: SupabaseClient) => {
  const user = await getUser(supabase);
  return supabase.from("resumes").select("*").eq("user_id", user.id);
});

export const upsertResumeById = async (supabase: SupabaseClient, val) => {
  const user = await getUser(supabase);
  const params = filterValEqUndefined({
    id: val.id,
    title: val.title,
    basic: JSON.stringify(val.basic),
    user_id: user.id,
    template_id: val.templateId,
    custom_data: JSON.stringify(val.customData),
    education: JSON.stringify(val.education),
    experience: JSON.stringify(val.experience),
    global_settings: JSON.stringify(val.globalSettings),
    menu_sections: JSON.stringify(val.menuSections),
    projects: JSON.stringify(val.projects),
    skill_content: JSON.stringify(val.skillContent),
  });
  console.debug("paramsparamsparams", params);
  return supabase.from("resumes").upsert(params);
};

export const deleteResumeById = async (supabase: SupabaseClient, id) => {
  return supabase.from("resumes").delete().eq("id", id);
};
