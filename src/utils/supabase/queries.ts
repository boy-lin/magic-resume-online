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
  // 更新数据库中的用户信息
  const { error: dbError } = await supabase
    .from("users")
    .update({
      full_name: params.fullName,
      avatar_url: params.avatarUrl,
    })
    .eq("id", id);

  if (dbError) {
    return { error: dbError };
  }

  // 同时更新Supabase Auth中的用户元数据
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: params.fullName,
      avatar_url: params.avatarUrl,
    },
  });

  return { error: authError };
};

export const getResumesByUserId = cache(
  async (supabase: SupabaseClient, { current, pageSize }) => {
    const user = await getUser(supabase);
    return supabase
      .from("resumes")
      .select("id, title, created_at, template_id", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range((current - 1) * pageSize, current * pageSize - 1);
  }
);

export const upsertResumeById = async (supabase: SupabaseClient, val) => {
  const user = await getUser(supabase);
  const params = filterValEqUndefined({
    id: val.id,
    title: val.title,
    user_id: user.id,
    template_id: val.templateId,
    custom_data: JSON.stringify(val.customData),
    global_settings: JSON.stringify(val.globalSettings),
    menu_sections: JSON.stringify(val.menuSections),
  });
  return supabase.from("resumes").upsert(params);
};

export const deleteResumeById = async (supabase: SupabaseClient, id) => {
  return supabase.from("resumes").delete().eq("id", id);
};

export const getResumeById = cache(async (supabase: SupabaseClient, id) => {
  const { data: val, error } = await supabase
    .from("resumes")
    .select("*", {})
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: val.id,
    title: val.title,
    createdAt: val.created_at,
    updatedAt: val.updated_at,
    basic: JSON.parse(val.basic),
    templateId: val.template_id,
    customData: JSON.parse(val.custom_data),
    globalSettings: JSON.parse(val.global_settings),
    menuSections: JSON.parse(val.menu_sections),
    isPublic: val.is_public,
    publicPassword: val.public_password,
  };
});

export const publicResumeById = async (
  supabase: SupabaseClient,
  id,
  isPublic
) => {
  return supabase.from("resumes").update({ is_public: isPublic }).eq("id", id);
};

export const setPublicResumeById = async (
  supabase: SupabaseClient,
  id,
  publicPassword
) => {
  return supabase
    .from("resumes")
    .update({ public_password: publicPassword })
    .eq("id", id);
};
